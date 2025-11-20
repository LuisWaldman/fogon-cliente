import { useAppStore } from '../../../stores/appStore'
import { UltimasCanciones } from '../../cancion/ultimascanciones'
import { StrategyVista } from './strategyVista'
import type { vistaHome } from './vistaHome'

export class StrategyVistaInicio extends StrategyVista {
  private ultimasCanciones: UltimasCanciones = new UltimasCanciones()
  public constructor(vista: vistaHome) {
    super(vista)
  }

  public override iniciar(): void {
    // Implementación por defecto para iniciar la vistaHome

    const appStore = useAppStore()
    if (appStore.busqueda.length > 0) {
      this.vista.viendoCanciones = appStore.busqueda
      this.vista.viendoTexto = `Mostrando ${this.vista.viendoCanciones.length} de búsqueda`
      return
    }

    this.vista.viendoListas = []
    this.vista.viendoCanciones = this.ultimasCanciones.obtenerUltimas()
    this.vista.viendoTexto =
      this.vista.viendoCanciones.length === 0
        ? ''
        : 'Ultimas ' + this.vista.viendoCanciones.length + ' canciones'
  }
}
