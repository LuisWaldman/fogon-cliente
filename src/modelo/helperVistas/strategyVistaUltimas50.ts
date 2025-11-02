import { UltimasCanciones } from '../cancion/ultimascanciones'
import { StrategyVista } from './strategyVista'
import type { vistaHome } from './vistaHome'

export class StrategyVistaUltimas50 extends StrategyVista {
  
  private ultimasCanciones: UltimasCanciones = new UltimasCanciones()
  public constructor(vista: vistaHome) {
    super(vista)
  }

  public override iniciar(vista: vistaHome): void {
    // Implementación por defecto para iniciar la vistaHome
    vista.viendoListas = []
    vista.viendoCanciones = this.ultimasCanciones.obtenerUltimas()
  }
}
