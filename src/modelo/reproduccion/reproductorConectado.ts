import { useAppStore } from '../../stores/appStore'
import { ClienteSocket } from '../conexion/ClienteSocket'
import { Reproductor } from './reproductor'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroCancion } from '../sincro/SincroCancion'
import { OrigenCancion } from '../cancion/origencancion'
import { CancionManager } from '../cancion/CancionManager'
import { Cancion } from '../cancion/cancion'

export class ReproductorConectado extends Reproductor {
  cliente: ClienteSocket
  momentoInicio: Date | null = null
  compasInicio: number = 0
  token: string = ''

  sincronizar() {
    const appStore = useAppStore()
    const helper = HelperSincro.getInstance()
    const momento = helper.MomentoSincro()
    const duracionGolpe = appStore.cancion?.duracionGolpe * 1000
    const golpesxcompas = appStore.cancion?.compasCantidad || 4
    const sincro = new SincroCancion(
      duracionGolpe,
      appStore.sesSincroCancion.timeInicio,
      golpesxcompas, // golpesxcompas
      appStore.sesSincroCancion.desdeCompas, // duracionGolpe
    )

    appStore.sesSincroCancion = sincro
    const est = helper.GetEstadoSincro(sincro, momento)
    appStore.EstadoSincro = est
    appStore.compas = est.compas
    appStore.golpeDelCompas = est.golpeEnCompas
    appStore.estadoReproduccion = est.estado
    this.reloj.setDelay(est.delay)
  }

  async GetCancionDelFogon() {
    const origen = new OrigenCancion('fogon', '', '')
    const cancion = await CancionManager.getInstance().Get(origen)
    const appStore = useAppStore()
    appStore.cancion = cancion
    appStore.origenCancion = origen
  }
  constructor(cliente: ClienteSocket, token: string) {
    super()
    const appStore = useAppStore()
    this.token = token
    this.cliente = cliente
    this.cliente.setCancionActualizadaHandler(async () => {
      appStore.estadosApp.estado = ''
      appStore.estadosApp.texto = 'Obteniendo cancion...'
      await this.GetCancionDelFogon()
      appStore.estadosApp.estado = 'ok'
    })
    this.cliente.setCancionIniciadaHandler((compas: number, desde: number) => {
      console.log(`Reproducción iniciada desde compás ${compas} en ${desde}`)
      const duracionGolpe = appStore.cancion?.duracionGolpe * 1000
      appStore.sesSincroCancion = new SincroCancion(
        duracionGolpe,
        desde,
        appStore.cancion?.compasCantidad || 4, // golpesxcompas
        compas, // duracionGolpe
      )
      this.sincronizar()
      if (appStore.cancion) {
        this.reloj.setDuracion(appStore.cancion.duracionGolpe * 1000)
        this.reloj.setIniciaCicloHandler(this.onInicioCiclo.bind(this))
        this.reloj.iniciar()
        if (appStore.compas < 0) {
          appStore.compas = 0
        }
      }
    })
    this.cliente.setCancionDetenidaHandler(() => {
      console.log('Reproducción detenida')
      const appStore = useAppStore()
      appStore.estadoReproduccion = 'pausado'
      appStore.golpeDelCompas = 0
      this.reloj.pausar()
    })
    this.cliente.setCompasActualizadoHandler((compas: number) => {
      console.log(`Compás actualizado a ${compas}`)
      const appStore = useAppStore()
      appStore.compas = compas
    })
  }

  override onInicioCiclo() {
    this.sincronizar()
  }
  async EnviarCancion(cancion: Cancion) {
    const origenN = new OrigenCancion('fogon', '', '')
    CancionManager.getInstance().Save(origenN, cancion)
  }

  override async ClickCancion(origen: OrigenCancion) {
    const appStore = useAppStore()
    appStore.estadosApp.texto = 'Obteniendo cancion...'
    const cancionObtenida = await CancionManager.getInstance().Get(origen)
    appStore.origenCancion = origen
    appStore.estadosApp.texto = 'Enviando cancion...'
    await this.EnviarCancion(cancionObtenida)
  }

  override async iniciarReproduccion() {
    const appStore = useAppStore()
    if (appStore.cancion) {
      appStore.estadoReproduccion = 'Iniciando'
      if (appStore.compas < 0) {
        appStore.compas = 0
      }
      this.cliente.iniciarReproduccion(
        appStore.compas,
        appStore.cancion.duracionCompas * 1000,
      )
    }
  }

  override detenerReproduccion() {
    this.cliente.detenerReproduccion()
  }

  override updateCompas(compas: number) {
    this.cliente.actualizarCompas(compas)
  }
}
