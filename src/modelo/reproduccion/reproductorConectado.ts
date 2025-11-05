import { useAppStore } from '../../stores/appStore'
import { ClienteSocket } from '../conexion/ClienteSocket'
import { Reproductor } from './reproductor'
import { SincroCancion } from '../sincro/SincroCancion'
import { OrigenCancion } from '../cancion/origencancion'
import { CancionManager } from '../cancion/CancionManager'
import { Cancion } from '../cancion/cancion'

export class ReproductorConectado extends Reproductor {
  cliente: ClienteSocket
  momentoInicio: Date | null = null
  compasInicio: number = 0
  token: string = ''

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
    })
    this.cliente.setCompasActualizadoHandler((compas: number) => {
      console.log(`Compás actualizado a ${compas}`)
      const appStore = useAppStore()
      appStore.compas = compas
    })
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
    super.iniciarReproduccion()
  }

  override detenerReproduccion() {
    this.cliente.detenerReproduccion()
  }

  override updateCompas(compas: number) {
    this.cliente.actualizarCompas(compas)
  }
}
