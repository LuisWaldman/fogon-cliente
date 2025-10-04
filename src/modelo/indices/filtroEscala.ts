import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroEscala extends FiltroIndice {
  escala: string = ''
  constructor(escala: string) {
    super()
    this.escala = escala
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    return item.escala === this.escala
  }
}
