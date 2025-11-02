import { StrategyVista } from './strategyVista'
import type { vistaHome } from './vistaHome'

export class StrategyVistaDefault extends StrategyVista {
  public constructor(vista: vistaHome) {
    super(vista)
  }

  public override iniciar(): void {
    // Implementación por defecto para iniciar la vistaHome
    console.log('Iniciando vistaHome con la estrategia por defecto.')
  }
}
