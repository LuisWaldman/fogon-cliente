import type { vistaHome } from './vistaHome'

export class StrategyVista {
  protected vista: vistaHome
  public constructor(vista: vistaHome) {
    this.vista = vista
  }

  public iniciar(vista: vistaHome): void {
    // Implementación específica para iniciar la vistaHome
    vista.viendoListas = []
    console.log('Iniciando vistaHome con appStore:')
  }
}
