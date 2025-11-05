import { ListasDBManager } from '../../cancion/ListasDBManager'
import { StrategyVista } from './strategyVista'
import { vistaHome } from './vistaHome'

export class StrategyVistaLocal extends StrategyVista {
  public listasManager: ListasDBManager = new ListasDBManager()

  public constructor(vista: vistaHome) {
    super(vista)
  }

  public override async iniciar(): Promise<void> {
    // Implementación por defecto para iniciar la vistaHome

    await this.listasManager.initDB()
    this.vista.viendoListas = await this.listasManager.GetListas()
    if (this.vista.viendoListas.length > 0) {
      this.vista.viendoLista = this.vista.viendoListas[0]
      await this.cambioLista()
    } else {
      this.vista.viendoLista = ''
      this.vista.viendoCanciones = []
    }
  }

  override async cambioLista(): Promise<void> {
    this.vista.viendoCanciones = await this.listasManager.GetCanciones(
      this.vista.viendoLista,
    )
  }
}
