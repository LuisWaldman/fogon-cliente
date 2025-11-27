import { AcordesCuerdas } from './AcordesCuerdas'
import type { InstrumentoLineas } from './InstrumentoLineas'
import { InstrumentoLineasCompas } from './InstrumentoLineasCompas'

export class InstrumentoLineasCompasBuildHelper {
  /**
   * Recibe un string y devuelve una nota en formato GuitarChord.
   * El string debe tener el formato: "3 2 1 0 x x" (de la 1ra a la 6ta cuerda).
   */
  static getAcorde(
    instrumento: InstrumentoLineas,
    chordStr: string,
    compasCantidad: number,
  ): InstrumentoLineasCompas {
    const ret = new InstrumentoLineasCompas(
      instrumento.notaLinea.length,
      compasCantidad,
      instrumento.notasPosibles[0],
    )
    console.log(
      'Harmonica helper getAcorde',
      instrumento,
      chordStr,
      compasCantidad,
    )

    return ret
  }
}
