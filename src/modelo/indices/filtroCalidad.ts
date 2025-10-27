import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroCalidad extends FiltroIndice {
  calidad: string[] = []
  constructor(calidad: string) {
    super()
    this.calidad = calidad.split(',')
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    return this.calidad.some((calidad) => parseInt(calidad) == item.calidad)
  }
}
