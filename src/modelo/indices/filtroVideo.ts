import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroVideo extends FiltroIndice {
  private video: string
  constructor(video: string) {
    super()
    this.video = video
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    if (this.video === 'video') {
      return item.video
    } else {
      return !item.video
    }
  }
}
