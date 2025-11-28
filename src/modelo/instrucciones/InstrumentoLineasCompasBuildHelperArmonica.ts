import type { InstrumentoLineas } from './InstrumentoLineas'
import { InstrumentoLineasCompas } from './InstrumentoLineasCompas'

export class InstrumentoLineasCompasBuildHelperArmonica {
  /**
   * Recibe un string y devuelve una nota en formato GuitarChord.
   * El string debe tener el formato: "3 2 1 0 x x" (de la 1ra a la 6ta cuerda).
   */
  static getAcorde(
    instrumento: InstrumentoLineas,
    chordStr: string,
    compasCantidad: number,
    escala: string,
  ): InstrumentoLineasCompas {
    const ret = new InstrumentoLineasCompas(
      instrumento.notaLinea.length,
      compasCantidad,
      instrumento.notasPosibles[0],
    )
    console.log(
      'Harmonica helper getAcorde',
      escala,
      instrumento,
      chordStr,
      compasCantidad,
    )

    return ret
  }
}
