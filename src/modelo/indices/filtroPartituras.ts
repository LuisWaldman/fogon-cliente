import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroPartituras extends FiltroIndice {
  partitura: string = ''
  constructor(partitura: string) {
    super()
    this.partitura = partitura
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    if (this.partitura === '') {
      return true
    }
    return item.pentagramas.includes(this.partitura)
  }
}
