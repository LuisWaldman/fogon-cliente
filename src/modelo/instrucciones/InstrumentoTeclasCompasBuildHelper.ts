import { AcordesCuerdas } from './AcordesCuerdas'
import { AcordesTecladosHelper } from './AcordesTecladosHelper'
import { AcordesTeclasArmonico } from './AcordesTeclasArmonico'
import type { InstrumentoLineas } from './InstrumentoLineas'
import { InstrumentoLineasCompas } from './InstrumentoLineasCompas'

export class InstrumentoTeclasCompasBuildHelper {
  /**
   * Recibe un string y devuelve una nota en formato GuitarChord.
   * El string debe tener el formato: "3 2 1 0 x x" (de la 1ra a la 6ta cuerda).
   */
  static getAcorde(
    chordStr: string,
    compasCantidad: number,
  ): AcordesTeclasArmonico {
    const notasAcorde = AcordesTecladosHelper.getAcorde(chordStr)
    const ret = new AcordesTeclasArmonico(
      chordStr,
      compasCantidad,
      notasAcorde.teclas,
      notasAcorde.desdetecla,
      notasAcorde.hastatecla,
    )
    return ret
  }
}
