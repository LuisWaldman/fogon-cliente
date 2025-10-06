import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroTempo extends FiltroIndice {
  tempos: string[] = []
  constructor(tempos: string) {
    super()
    this.tempos = tempos.split(',')
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    for (const tempo of this.tempos) {
      const [min, max] = tempo.split('_').map(Number)
      if (item.bpm >= min && item.bpm <= max) {
        return true
      }
    }
    return false
  }
}
