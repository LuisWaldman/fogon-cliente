import { AcordesCuerdas } from './AcordesCuerdas'

export class AcordesUkeleleHelper {
  /**
   * Recibe un string y devuelve una nota en formato UkuleleChord.
   * El ukelele tiene 4 cuerdas (G-C-E-A de la 4ta a la 1ra cuerda).
   * El string representa las posiciones de la 1ra a la 4ta cuerda.
   */
  static getAcorde(chordStr: string): AcordesCuerdas {
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
      cuerda[3] = '2'
    }
    if (chordStr === 'G') {
      cuerda[0] = '2'
      cuerda[1] = '3'
      cuerda[2] = '2'
    }
    if (chordStr === 'Dm') {
      cuerda[0] = '1'
      cuerda[1] = '2'
      cuerda[2] = '2'
    }
    if (chordStr === 'F') {
      cuerda[1] = '1'
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
      cuerda[0] = '2'
      cuerda[1] = '1'
      cuerda[2] = '2'
    }
    if (chordStr === 'Cmaj7') {
      cuerda[1] = '2'
    }
    if (chordStr === 'Dm7') {
      cuerda[0] = '1'
      cuerda[1] = '2'
      cuerda[2] = '1'
    }
    if (chordStr === 'F#m7' || chordStr === 'Fa#m7') {
      cuerda[0] = '2'
      cuerda[1] = '1'
      cuerda[2] = '2'
      cuerda[3] = '2'
    }
    if (chordStr === 'Bm7' || chordStr === 'Sim7') {
      cejilla = 2
      cuerda[1] = '2'
      cuerda[2] = '2'
      cuerda[3] = '2'
    }
    if (chordStr === 'Em7') {
      cuerda[1] = '2'
      cuerda[3] = '2'
    }
    if (chordStr === 'Am7') {
      cuerda[1] = '2'
    }
    if (chordStr === 'Gm7') {
      cuerda[0] = '1'
      cuerda[1] = '3'
      cuerda[2] = '1'
      cuerda[3] = '1'
    }

    return new AcordesCuerdas(chordStr, cejilla, cuerda)
  }
}
