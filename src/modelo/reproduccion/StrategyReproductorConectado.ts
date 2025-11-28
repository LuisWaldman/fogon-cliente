import { useAppStore } from '../../stores/appStore'
import type { Cancion } from '../cancion/cancion'
import { CancionManager } from '../cancion/CancionManager'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { OrigenCancion } from '../cancion/origencancion'
import type { ClienteSocket } from '../conexion/ClienteSocket'
import { Logger } from '../logger'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroSesion } from '../sincro/SincroSesion'
import type { Reproductor } from './reproductor'
import { StrategyReproductor } from './strategyReproductor'

export class StrategyReproductorConectado extends StrategyReproductor {
  protected cliente: ClienteSocket
  protected token: string

  constructor(reproductor: Reproductor, cliente: ClienteSocket, token: string) {
    super(reproductor)
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
      Logger.log(`Reproducción iniciada desde compás ${compas} en ${desde}`)
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
      Logger.log('Reproducción detenida')
      super.detenerReproduccion()
    })
    this.cliente.setCompasActualizadoHandler((compas: number) => {
      Logger.log(`Compás actualizado a ${compas}`)
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
  async GetCancionDelFogon() {
    const origen = new OrigenCancion('fogon', '', '')
    const cancion = await CancionManager.getInstance().Get(origen)
    const appStore = useAppStore()
    appStore.cancion = cancion
    appStore.origenCancion = origen
  }

  override async CargarCancion(cancion: ItemIndiceCancion) {
    const appStore = useAppStore()
    if (appStore.rolSesion != 'director') {
      appStore.estadosApp.texto = 'Esperando que el director envie la cancion'
    } else {
      appStore.estadosApp.texto = 'Obteniendo cancion para enviar...'
      const cancionObtenida = await CancionManager.getInstance().Get(
        ItemIndiceCancion.GetOrigen(cancion),
      )
      appStore.estadosApp.texto = 'Enviando cancion...'
      this.EnviarCancion(cancionObtenida)
    }
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
}
