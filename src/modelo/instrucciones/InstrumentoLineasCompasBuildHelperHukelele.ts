import { AcordesCuerdas } from './AcordesCuerdas'
import { InstrumentoLineas } from './InstrumentoLineas'
import { InstrumentoLineasCompas } from './InstrumentoLineasCompas'

export class InstrumentoLineasCompasBuildHelperUkelele {
  /**
   * Construye un compás de instrumento de líneas para ukelele a partir del nombre de un acorde.
   * Convierte los acordes definidos en formato de cuerdas al formato de líneas del instrumento.
   */
  public static instrumento: InstrumentoLineas =
    InstrumentoLineas.GetUkeleleEstandar()

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

    // Convertir las cuerdas del acorde a líneas del instrumento
    // El ukelele tiene 4 cuerdas: A, E, C, G (de aguda a grave)
    for (
      let i = 0;
      i < acorde.cuerda.length && i < ret.valorGolpePorLinea.length;
      i++
    ) {
      if (acorde.cuerda[i] !== 'x') {
        ret.valorGolpePorLinea[i][0] = acorde.cuerda[i]
      }
    }

    return ret
  }

  /**
   * Obtiene la digitación del acorde para ukelele.
   * Usa las mismas digitaciones que AcordesUkeleleHelper.
   */
  private static getAcordeDigitacion(chordStr: string): AcordesCuerdas {
    const cuerda: string[] = ['0', '0', '0', '0']
    let cejilla: number = 0

    if (chordStr === 'C') {
      cuerda[3] = '3'
    }
    if (chordStr === 'E') {
      cuerda[0] = '2'
      cuerda[1] = '4'
      cuerda[2] = '4'
      cuerda[3] = '4'
    }
    if (chordStr === 'A') {
      cuerda[0] = '2'
      cuerda[1] = '1'
    }
    if (chordStr === 'Em') {
      cuerda[1] = '4'
      cuerda[2] = '3'
      cuerda[3] = '2'
    }
    if (chordStr === 'Am') {
      cuerda[3] = '2'
    }
    if (chordStr === 'Bm') {
      cejilla = 2
      cuerda[1] = '2'
      cuerda[2] = '3'
      cuerda[3] = '4'
    }
    if (chordStr === 'D') {
      cuerda[0] = '2'
      cuerda[1] = '2'
      cuerda[2] = '2'
    }
    if (chordStr === 'G') {
      cuerda[1] = '2'
      cuerda[2] = '3'
    }
    if (chordStr === 'Dm') {
      cuerda[0] = '1'
      cuerda[1] = '2'
      cuerda[2] = '2'
    }
    if (chordStr === 'F') {
      cuerda[0] = '1'
      cuerda[3] = '2'
    }
    if (chordStr === 'B7') {
      cuerda[0] = '2'
      cuerda[1] = '3'
      cuerda[2] = '2'
    }
    if (chordStr === 'C7') {
      cuerda[2] = '1'
    }
    if (chordStr === 'D7') {
      cuerda[0] = '2'
      cuerda[1] = '2'
      cuerda[2] = '2'
      cuerda[3] = '3'
    }
    if (chordStr === 'E7') {
      cuerda[0] = '2'
      cuerda[1] = '1'
      cuerda[2] = '2'
    }
    if (chordStr === 'A7') {
      cuerda[1] = '1'
    }
    if (chordStr === 'G7') {
      cuerda[0] = '1'
      cuerda[1] = '2'
      cuerda[2] = '2'
    }

    return new AcordesCuerdas(chordStr, cejilla, cuerda)
  }
}
