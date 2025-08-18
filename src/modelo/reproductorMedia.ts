import { useAppStore } from '../stores/appStore'
import { ClienteSocket } from './conexion/ClienteSocket'
import { Reproductor } from './reproductor'
import { HelperSincro } from './sincro/HelperSincro'
import { SincroCancion } from './sincro/SincroCancion'
import { OrigenCancion } from './cancion/origencancion'

export class ReproductorMedia extends Reproductor {
  momentoInicio: Date | null = null
  compasInicio: number = 0

  private GetTiempoInicio?: () => number
  public setGetTiempoInicio(handler: () => number): void {
    this.GetTiempoInicio = handler
  }

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

  constructor() {
    super()
  }

  override onInicioCiclo() {
    this.sincronizar()
  }
}
