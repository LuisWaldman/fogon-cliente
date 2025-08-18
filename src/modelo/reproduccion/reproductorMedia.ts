import { useAppStore } from '../../stores/appStore'
import { Reproductor } from './reproductor'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroCancion } from '../sincro/SincroCancion'
import type { MediaVista } from './MediaVista'
import type { Media } from '../cancion/media'

export class ReproductorMedia extends Reproductor {
  momentoInicio: Date | null = null
  compasInicio: number = 0
  private mediavista: MediaVista | null = null

  public setMediaVista(mediavista: MediaVista): void {
    this.mediavista = mediavista
  }

  override sincronizar() {
    const appStore = useAppStore()
    const helper = HelperSincro.getInstance()
    let momento = 0
    if (this.mediavista && this.mediavista.GetTiempoDesdeInicio) {
      momento = this.mediavista.GetTiempoDesdeInicio()
      console.log(`Sincronizando en el MEDIA:: ${momento}`)
    }
    const duracionGolpe = appStore.cancion?.duracionGolpe * 1000
    const golpesxcompas = appStore.cancion?.compasCantidad || 4
    const sincro = new SincroCancion(
      duracionGolpe,
      0,
      golpesxcompas, // golpesxcompas
      0,
    )
    appStore.sesSincroCancion = sincro
    const est = helper.GetEstadoSincro(sincro, momento)
    appStore.EstadoSincro = est
    appStore.compas = est.compas
    appStore.golpeDelCompas = est.golpeEnCompas
    appStore.estadoReproduccion = est.estado
    this.reloj.setDelay(est.delay)
  }

  override iniciarReproduccion() {
    super.iniciarReproduccion()
    const appStore = useAppStore()
    appStore.sesSincroCancion.timeInicio = 0
    this.mediavista?.Iniciar?.()
  }

  override detenerReproduccion() {
    super.detenerReproduccion()
    this.mediavista?.Pausar?.()
  }
}
