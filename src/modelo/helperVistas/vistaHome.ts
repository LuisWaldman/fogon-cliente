import { ref } from 'vue'
import { useAppStore } from '../../stores/appStore'
import type { StrategyVista } from './strategyVista'
import { StrategyVistaDefault } from './strategyVistaDefault'
import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { StrategyVistaUltimas50 } from './strategyVistaUltimas50'

export class vistaHome {
  public viendo: string = 'inicio'
  public viendoOrigen: string = 'localstorage'
  public viendoCanciones: ItemIndiceCancion[] = []
  public viendoListas: string[] = []
  public cargandoCanciones: boolean = true
  public cargandoListas: boolean = true
  private strategia: StrategyVista = new StrategyVistaUltimas50(this)

  public async iniciar() {
    await this.strategia.iniciar(this)
  }


  public clickViendo(viendo: string) {
    this.viendo = viendo
  }

  public cliclkViendoOrigen(viendoOrigen: string) {
    this.viendoOrigen = viendoOrigen
  }

  public cambiarStrategia() {
    this.strategia.iniciar()
  }
  
}
