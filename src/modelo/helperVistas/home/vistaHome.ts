import type { StrategyVista } from './strategyVista'
import { StrategyVistaDefault } from './strategyVistaDefault'
import type { ItemIndiceCancion } from '../../cancion/ItemIndiceCancion'
import { StrategyVistaUltimas50 } from './strategyVistaUltimas50'
import { StrategyVistaLocal } from './strategyVistaListasLocal'
import { StrategyVistaServer } from './strategyVistaListaServer'
import { StrategyCancionesLocal } from './strategyVistaCancionesLocal'
import { StrategyCancionesServer } from './strategyVistaCancionesServer'
import { StrategyListaReproduccion } from './strategyVistaListaReproduccion'

export class vistaHome {
  public viendo: string = 'inicio'
  public viendoOrigen: string = 'localstorage'
  public viendoTexto: string = '🔥 Cargando...'
  public viendoCanciones: ItemIndiceCancion[] = []
  public viendoListas: string[] = []
  public viendoLista: string = ''
  private strategia: StrategyVista = new StrategyVistaUltimas50(this)

  public async iniciar() {
    await this.strategia.iniciar()
  }

  public async cambioLista(nuevaLista: string) {
    this.viendoLista = nuevaLista
    await this.strategia.cambioLista()
  }

  public async clickViendo(viendo: string, logueado: boolean, conLista: boolean) {
    this.viendo = viendo
    if (logueado) {
      if (viendo === 'listas' || viendo === 'canciones') {
        this.viendoOrigen = 'server'
      }
    }
    if (conLista && viendo === 'listas') {
      this.viendoOrigen = 'reproduccion'
    }
    await this.cambiarStrategia()
  }

  public async clickViendoOrigen(viendoOrigen: string) {
    this.viendoOrigen = viendoOrigen
    
    await this.cambiarStrategia()
  }

  public cambiarStrategia() {
    if (this.viendo === 'inicio') {
      this.strategia = new StrategyVistaUltimas50(this)
    } else if (this.viendo === 'listas') {
      if (this.viendoOrigen === 'localstorage') {
        this.strategia = new StrategyVistaLocal(this)
      } else if (this.viendoOrigen === 'server') {
        this.strategia = new StrategyVistaServer(this)
      } else {
        this.strategia = new StrategyListaReproduccion(this)
      }
    } else if (this.viendo === 'canciones') {
      if (this.viendoOrigen === 'localstorage') {
        this.strategia = new StrategyCancionesLocal(this)
      } else if (this.viendoOrigen === 'server') {
        this.strategia = new StrategyCancionesServer(this)
      }
    } else {
      this.strategia = new StrategyVistaDefault(this)
    }
  }
}
