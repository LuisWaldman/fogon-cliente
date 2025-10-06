import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroPartes extends FiltroIndice {
  partes: string[] = []
  constructor(partes: string) {
    super()
    this.partes = partes.split(',')
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    for (const parte of this.partes) {
      if (item.cantpartes.toString() === parte) {
        return true
      }
    }
    return false
  }
}
