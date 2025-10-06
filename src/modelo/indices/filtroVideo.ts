import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroVideo extends FiltroIndice {
  constructor() {
    super()
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    return item.video
  }
}
