import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroCalidad extends FiltroIndice {
  minCalidad: number
  maxCalidad: number
  constructor(minCalidad: number, maxCalidad: number) {
    super()
    this.minDur = minDur
    this.maxDur = maxDur
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    return item.duracion >= this.minDur && item.duracion <= this.maxDur
  }
}
