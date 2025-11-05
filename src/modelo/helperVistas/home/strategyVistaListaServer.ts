import { useAppStore } from '../../../stores/appStore'
import { CancionManager } from '../../cancion/CancionManager'
import { StrategyVista } from './strategyVista'
import { vistaHome } from './vistaHome'

export class StrategyVistaServer extends StrategyVista {
  public constructor(vista: vistaHome) {
    super(vista)
  }

  public override async iniciar(): Promise<void> {
    // Implementación por defecto para iniciar la vistaHome
    const appStore = useAppStore()
    this.vista.viendoListas = appStore.listasEnServer
    this.vista.viendoCanciones = []
    if (this.vista.viendoListas.length > 0) {
      this.vista.viendoLista = this.vista.viendoListas[0]
      await this.cambioLista()
    }
  }

  override async cambioLista(): Promise<void> {
    this.vista.viendoCanciones =
      (await CancionManager.getInstance().listasServerManager?.GetCancionesLista(
        this.vista.viendoLista,
      )) || []
  }
}
