import { StaveNote } from 'vexflow'
import type { DisplayAcordesPentagrama } from './DisplayAcordesPentagrama'
import type { PentagramaBeam } from '../cancion/pentagramabeam'
import type { PentagramaLigadura } from '../cancion/pentagramaligadura'

export class DisplayCompasPentagrama {
  beams: PentagramaBeam[] = []
  ligaduras: PentagramaLigadura[] = []
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
