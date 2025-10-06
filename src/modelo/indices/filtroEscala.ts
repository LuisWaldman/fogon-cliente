import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroEscala extends FiltroIndice {
  escala: string[] = []
  constructor(escala: string) {
    super()
    this.escala = escala.split(',')
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    return this.escala.includes(item.escala)
  }
}
