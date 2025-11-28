import { AcordesCuerdas } from './AcordesCuerdas'
import { InstrumentoLineas } from './InstrumentoLineas'
import { InstrumentoLineasCompas } from './InstrumentoLineasCompas'

export class InstrumentoLineasCompasBuildHelperGuitarra {
  /**
   * Construye un compás de instrumento de líneas para guitarra a partir del nombre de un acorde.
   * Convierte los acordes definidos en formato de cuerdas al formato de líneas del instrumento.
   */
  public static instrumento: InstrumentoLineas =
    InstrumentoLineas.GetGuitarraEstandar()

  static getAcorde(
    chordStr: string,
    compasCantidad: number,
  ): InstrumentoLineasCompas {
    const ret = new InstrumentoLineasCompas(
      this.instrumento.notaLinea.length,
      compasCantidad,
      this.instrumento.notasPosibles[0],
    )

    // Obtener el acorde usando AcordesCuerdas que ya tiene todas las digitaciones
    const acorde = this.getAcordeDigitacion(chordStr)

    // Convertir las cuerdas del acorde a líneas del instrumento
    // Las cuerdas van de 0-5 (de aguda a grave)
    // Las líneas del instrumento también van de 0-5
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
   * Obtiene la digitación del acorde. Esta es una versión simplificada
   * que devuelve directamente un objeto AcordesCuerdas con las digitaciones.
   */
  private static getAcordeDigitacion(chordStr: string): AcordesCuerdas {
    const cuerda: string[] = ['0', '0', '0', '0', '0', '0']
    let cejilla: number = 0

    if (chordStr === 'C') {
      cuerda[5] = 'x'
      cuerda[4] = '3'
      cuerda[2] = '2'
      cuerda[1] = '1'
    }
    if (chordStr === 'E') {
      cuerda[4] = '2'
      cuerda[3] = '2'
      cuerda[2] = '1'
    }
    if (chordStr === 'A') {
      cuerda[1] = '2'
      cuerda[2] = '2'
      cuerda[3] = '2'
    }
    if (chordStr === 'Em') {
      cuerda[3] = '2'
      cuerda[4] = '2'
    }
    if (chordStr === 'Am') {
      cuerda[1] = '1'
      cuerda[2] = '2'
      cuerda[3] = '2'
    }
    if (chordStr === 'Bm') {
      cejilla = 2
      cuerda[1] = '2'
      cuerda[2] = '3'
      cuerda[3] = '3'
    }
    if (chordStr === 'D') {
      cuerda[5] = 'x'
      cuerda[4] = 'x'
      cuerda[2] = '2'
      cuerda[1] = '3'
      cuerda[0] = '2'
    }
    if (chordStr === 'G') {
      cuerda[0] = '3'
      cuerda[4] = '2'
      cuerda[5] = '3'
    }
    if (chordStr === 'Dm') {
      cuerda[5] = 'x'
      cuerda[4] = 'x'
      cuerda[2] = '2'
      cuerda[1] = '3'
      cuerda[0] = '1'
    }
    if (chordStr === 'F') {
      cejilla = 1
      cuerda[3] = '3'
      cuerda[2] = '2'
      cuerda[5] = 'x'
    }

    return new AcordesCuerdas(chordStr, cejilla, cuerda)
  }
}
