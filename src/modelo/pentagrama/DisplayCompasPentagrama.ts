import { StaveNote } from 'vexflow'
import type { DisplayAcordesPentagrama } from './DisplayAcordesPentagrama'
import type { PentagramaBeam } from '../cancion/pentagramabeam'

export class DisplayCompasPentagrama {
  beams: PentagramaBeam[] = []
  getStaveNote(clave: string): StaveNote[] {
    const ret: StaveNote[] = []
    for (const acorde of this.acordes) {
      ret.push(acorde.getStaveNote(clave))
    }
    return ret
  }
  public nroCompas: number
  constructor(nroCompas: number) {
    this.nroCompas = nroCompas
  }

  public acordes: DisplayAcordesPentagrama[] = []
}
