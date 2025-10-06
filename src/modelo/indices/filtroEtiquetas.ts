import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroEtiquetas extends FiltroIndice {
  etiqueta: string = ''
  constructor(etiqueta: string) {
    super()
    this.etiqueta = etiqueta
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    return item.etiquetas.includes(this.etiqueta)
  }
}
