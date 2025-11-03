import type { vistaHome } from './vistaHome'

export class StrategyVista {
  protected vista: vistaHome
  public constructor(vista: vistaHome) {
    this.vista = vista
  }

  public iniciar(): void {
    // Implementación específica para iniciar la vistaHome
    this.vista.viendoListas = []
  }

  public cambioLista(): void {
    // Implementación específica para iniciar la vistaHome
    this.vista.viendoListas = []
  }
  public resultadoBusqueda(): void {
    // Implementación específica para iniciar la vistaHome
    this.vista.viendoListas = []
  }
}
