import { StaveNote } from 'vexflow'
import type { DisplayAcordesPentagrama } from './DisplayAcordesPentagrama'

export class DisplayCompasPentagrama {
  getStaveNote(clave: string): StaveNote[] {
    const ret: StaveNote[] = []
    for (const acorde of this.acordes) {
      ret.push(acorde.getStaveNote(clave))
    }
    return ret
  }
  public acordes: DisplayAcordesPentagrama[] = []
}
