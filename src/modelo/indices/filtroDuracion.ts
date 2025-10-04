import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class DuracionTempo extends FiltroIndice {
  minDur: number
  maxDur: number
  constructor(minDur: number, maxDur: number) {
    super()
    this.minDur = minDur
    this.maxDur = maxDur
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    return item.duracion >= this.minDur && item.duracion <= this.maxDur
  }
}
