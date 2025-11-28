import { AcordesCuerdas } from './AcordesCuerdas'
import { InstrumentoLineas } from './InstrumentoLineas'
import { InstrumentoLineasCompas } from './InstrumentoLineasCompas'

export class InstrumentoLineasCompasBuildHelperBajo {
  /**
   * Construye un compás de instrumento de líneas para bajo de 4 cuerdas a partir del nombre de un acorde.
   * Convierte los acordes definidos en formato de cuerdas al formato de líneas del instrumento.
   */
  public static instrumento: InstrumentoLineas =
    InstrumentoLineas.GetBajo4CuerdasEstandar()

  static getAcorde(
    chordStr: string,
    compasCantidad: number,
  ): InstrumentoLineasCompas {
    const ret = new InstrumentoLineasCompas(
      this.instrumento.notaLinea.length,
      compasCantidad,
      this.instrumento.notasPosibles[0],
    )

    // Obtener el acorde usando AcordesCuerdas
    const acorde = this.getAcordeDigitacion(chordStr)

    // Convertir las cuerdas del acorde al bajo (solo usar las 4 cuerdas graves)
    // El bajo tiene 4 cuerdas: G, D, A, E (de aguda a grave)
    // Tomamos las cuerdas 3, 4, 5 de la guitarra más la fundamental
    for (
      let i = 0;
      i < acorde.cuerda.length && i < ret.valorGolpePorLinea.length;
      i++
    ) {
      if (acorde.cuerda[i] !== 'x' && acorde.cuerda[i] !== '0') {
        ret.valorGolpePorLinea[i][0] = acorde.cuerda[i]
      }
    }

    return ret
  }

  /**
   * Obtiene la digitación del acorde para bajo de 4 cuerdas.
   * El bajo típicamente toca la fundamental y la quinta del acorde.
   */
  private static getAcordeDigitacion(chordStr: string): AcordesCuerdas {
    const cuerda: string[] = ['0', '0', '0', '0']
    let cejilla: number = 0

    if (chordStr === 'C') {
      cuerda[2] = '3' // A (3er traste) = C
    }
    if (chordStr === 'E') {
      cuerda[3] = '0' // E al aire
      cuerda[1] = '2' // D (2do traste) = E
    }
    if (chordStr === 'A') {
      cuerda[2] = '0' // A al aire
    }
    if (chordStr === 'Em') {
      cuerda[3] = '0' // E al aire
      cuerda[1] = '2' // D (2do traste) = E
    }
    if (chordStr === 'Am') {
      cuerda[2] = '0' // A al aire
    }
    if (chordStr === 'Bm' || chordStr === 'Sim') {
      cejilla = 2
      cuerda[2] = '2' // A (2do traste) = B
    }
    if (chordStr === 'D') {
      cuerda[1] = '0' // D al aire
    }
    if (chordStr === 'G') {
      cuerda[0] = '0' // G al aire
    }
    if (chordStr === 'Dm') {
      cuerda[1] = '0' // D al aire
    }
    if (chordStr === 'F') {
      cejilla = 1
      cuerda[3] = '1' // E (1er traste) = F
    }
    if (chordStr === 'B7') {
      cuerda[2] = '2' // A (2do traste) = B
    }
    if (chordStr === 'C7') {
      cuerda[2] = '3' // A (3er traste) = C
    }
    if (chordStr === 'D7') {
      cuerda[1] = '0' // D al aire
    }
    if (chordStr === 'E7') {
      cuerda[3] = '0' // E al aire
    }
    if (chordStr === 'A7') {
      cuerda[2] = '0' // A al aire
    }
    if (chordStr === 'G7') {
      cuerda[0] = '0' // G al aire
    }

    return new AcordesCuerdas(chordStr, cejilla, cuerda)
  }
}
