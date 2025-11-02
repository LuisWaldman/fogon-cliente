import { CancionManager } from '../cancion/CancionManager'
import { StrategyVista } from './strategyVista'
import { vistaHome } from './vistaHome'

export class StrategyCancionesServer extends StrategyVista {
  public constructor(vista: vistaHome) {
    super(vista)
  }
  public override async iniciar(): Promise<void> {
    // Implementación por defecto para iniciar la vistaHome
    this.vista.viendoCanciones =
      (await CancionManager.getInstance().listasServerManager?.GetCanciones()) ||
      []
  }
}
