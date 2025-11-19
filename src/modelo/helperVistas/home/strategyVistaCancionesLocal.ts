import { CancionManager } from '../../cancion/CancionManager'
import { ListasDBManager } from '../../cancion/ListasDBManager'
import { StrategyVista } from './strategyVista'
import { vistaHome } from './vistaHome'

export class StrategyCancionesLocal extends StrategyVista {
  public listasManager: ListasDBManager = new ListasDBManager()

  public constructor(vista: vistaHome) {
    super(vista)
  }

  public override async iniciar(): Promise<void> {
    this.vista.viendoCanciones = await CancionManager.getInstance().GetDBIndex()
  }
}
