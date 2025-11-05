import { useAppStore } from '../../stores/appStore'
import { Reproductor } from './reproductor'
import type { MediaVista } from './MediaVista'

export class ReproductorMedia extends Reproductor {
  momentoInicio: Date | null = null
  compasInicio: number = 0
  private mediavista: MediaVista | null = null

  public setMediaVista(mediavista: MediaVista): void {
    this.mediavista = mediavista
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
