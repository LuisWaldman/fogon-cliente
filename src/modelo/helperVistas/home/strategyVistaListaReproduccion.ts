import { useAppStore } from '../../../stores/appStore'
import { StrategyVista } from './strategyVista'
import { vistaHome } from './vistaHome'

export class StrategyListaReproduccion extends StrategyVista {
  public constructor(vista: vistaHome) {
    super(vista)
  }
  public override async iniciar(): Promise<void> {
    // Implementación por defecto para iniciar la vistaHome

    const appStore = useAppStore()
    this.vista.viendoCanciones = appStore.aplicacion.reproductor.listaReproduccion.lista
  }
}
