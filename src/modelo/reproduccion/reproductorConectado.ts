import { useAppStore } from '../../stores/appStore'
import { ClienteSocket } from '../conexion/ClienteSocket'
import { Reproductor } from './reproductor'
import { SincroSesion } from '../sincro/SincroSesion'
import { OrigenCancion } from '../cancion/origencancion'
import { CancionManager } from '../cancion/CancionManager'
import { Cancion } from '../cancion/cancion'
import { HelperSincro } from '../sincro/HelperSincro'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { ListaReproduccionConectada } from './listareproduccionconectada'

export class ReproductorConectado extends Reproductor {
  cliente: ClienteSocket
  momentoInicio: Date | null = null
  compasInicio: number = 0
  token: string = ''
  listaReproduccionConcetada: ListaReproduccionConectada
  async GetCancionDelFogon() {
    const origen = new OrigenCancion('fogon', '', '')
    const cancion = await CancionManager.getInstance().Get(origen)
    const appStore = useAppStore()
    appStore.cancion = cancion
    appStore.origenCancion = origen
  }
  constructor(cliente: ClienteSocket, token: string) {
    super()
    this.listaReproduccionConcetada = new ListaReproduccionConectada(
      cliente,
      token,
    )
    this.listaReproduccion = this.listaReproduccionConcetada
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
      appStore.sesSincroCancion = new SincroSesion(
        desde,
        compas, // duracionGolpe
      )
      appStore.MediaVistas?.Iniciar?.()
      this.sincronizar()
      if (appStore.cancion) {
        if (appStore.compas < 0) {
          appStore.compas = 0
        }
      }
    })
    this.cliente.setCancionDetenidaHandler(() => {
      console.log('Reproducción detenida')
      super.detenerReproduccion()
    })
    this.cliente.setCompasActualizadoHandler((compas: number) => {
      console.log(`Compás actualizado a ${compas}`)
      const appStore = useAppStore()
      appStore.compas = compas
    })
    this.cliente.setCancionSincronizadaHandler(
      (compas: number, desde: number) => {
        const appStore = useAppStore()
        console.log(
          `En ${appStore.sesSincroCancion.timeInicio} Sincronizando inicio sesion  ${appStore.sesSincroCancion.timeInicio} , time  ${desde}`,
        )
        if (appStore.MediaVistas === null) {
          appStore.sesSincroCancion.desdeCompas = compas
          appStore.sesSincroCancion.timeInicio = desde
        }
      },
    )
  }
  async EnviarCancion(cancion: Cancion) {
    const origenN = new OrigenCancion('fogon', '', '')
    CancionManager.getInstance().Save(origenN, cancion)
  }

  override async ClickCancion(cancion: ItemIndiceCancion) {
    await this.listaReproduccionConcetada.ClickCancion(cancion)
  }

  override async ClickTocarLista(lista: ItemIndiceCancion[]) {
    await this.listaReproduccionConcetada.ClickTocarLista(lista)
  }
  override async ClickCancionNro(nro: number) {
    await this.listaReproduccionConcetada.ClickCancionNro(nro)
  }

  override async iniciarReproduccion() {
    super.iniciarReproduccion()
    const appStore = useAppStore()
    this.cliente.iniciarReproduccion(
      appStore.compas,
      appStore.sesSincroCancion.timeInicio,
    )
  }

  override async sincronizar() {
    await super.sincronizar()
    const appStore = useAppStore()
    if (appStore.MediaVistas !== null) {
      const helper = HelperSincro.getInstance()
      const momento = helper.MomentoSincro()
      const sincro = helper.GetSincro(
        appStore.EstadoSincro,
        momento,
        appStore.cancion!.duracionGolpe * 1000,
        appStore.cancion!.compasCantidad,
        0,
      )
      const dif = Math.abs(
        HelperSincro.Diferencia(
          appStore.sesSincroCancion.timeInicio,
          sincro.timeInicio,
        ),
      )
      if (dif > 20) {
        console.log(
          `Sincronizando inicio sesion  ${appStore.sesSincroCancion.timeInicio} , time inicio ${sincro.timeInicio} con diferencia de ${dif} ms`,
        )
        appStore.sesSincroCancion.timeInicio = sincro.timeInicio
        this.cliente.sincronizarReproduccion(0, sincro.timeInicio)
      }
    }
  }

  override detenerReproduccion() {
    this.cliente.detenerReproduccion()
  }

  override updateCompas(compas: number) {
    this.cliente.actualizarCompas(compas)
  }
}
