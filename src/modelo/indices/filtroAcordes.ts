import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class filtroAcordes extends FiltroIndice {
  acordes: string[] = []
  constructor(tempos: string) {
    super()
    this.acordes = tempos.split(',')
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    for (const acorde of this.acordes) {
      const [min, max] = acorde.split('_').map(Number)
      if (item.cantacordes >= min && item.cantacordes <= max) {
        return true
      }
    }
    return false
  }
}
