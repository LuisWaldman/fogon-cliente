import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroCalidad extends FiltroIndice {
  minCalidad: number
  maxCalidad: number
  constructor(minCalidad: number, maxCalidad: number) {
    super()
    this.minCalidad = minCalidad
    this.maxCalidad = maxCalidad
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    return item.calidad >= this.minCalidad && item.calidad <= this.maxCalidad
  }
}
