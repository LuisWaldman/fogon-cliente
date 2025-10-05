import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroTempo extends FiltroIndice {
  minBPM: number
  maxBPM: number
  constructor(minBPM: number, maxBPM: number) {
    super()
    this.minBPM = minBPM
    this.maxBPM = maxBPM
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    return item.bpm >= this.minBPM && item.bpm <= this.maxBPM
  }
}
