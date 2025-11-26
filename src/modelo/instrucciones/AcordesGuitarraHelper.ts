import { AcordesCuerdas } from './AcordesCuerdas'

export class AcordesGuitarraHelper {
  /**
   * Recibe un string y devuelve una nota en formato GuitarChord.
   * El string debe tener el formato: "3 2 1 0 x x" (de la 1ra a la 6ta cuerda).
   */
  static getAcorde(chordStr: string): AcordesCuerdas {
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
    if (chordStr === 'B7') {
      cuerda[5] = 'x'
      cuerda[4] = '2'
      cuerda[3] = '1'
      cuerda[2] = '2'
    }
    if (chordStr === 'C7') {
      cuerda[5] = 'x'
      cuerda[4] = '3'
      cuerda[3] = '2'
      cuerda[2] = '3'
      cuerda[1] = '1'
    }
    if (chordStr === 'D7') {
      cuerda[5] = 'x'
      cuerda[4] = 'x'
      cuerda[2] = '2'
      cuerda[1] = '1'
      cuerda[0] = '2'
    }
    if (chordStr === 'E7') {
      cuerda[4] = '2'
      cuerda[2] = '1'
    }
    if (chordStr === 'A7') {
      cuerda[1] = '2'
      cuerda[3] = '2'
    }
    if (chordStr === 'G7') {
      cuerda[5] = '3'
      cuerda[4] = '2'
      cuerda[2] = '3'
    }
    if (chordStr === 'Cmaj7') {
      cuerda[5] = 'x'
      cuerda[4] = '3'
      cuerda[2] = '2'
    }
    if (chordStr === 'Dm7') {
      cuerda[5] = 'x'
      cuerda[4] = 'x'
      cuerda[2] = '2'
      cuerda[1] = '1'
      cuerda[0] = '1'
    }
    if (chordStr === 'F#m7' || chordStr === 'Fa#m7') {
      cejilla = 2
      cuerda[3] = '2'
      cuerda[2] = '2'
      cuerda[1] = '2'
    }
    if (chordStr === 'Bm7' || chordStr === 'Sim7') {
      cejilla = 2
      cuerda[2] = '2'
      cuerda[1] = '2'
    }
    if (chordStr === 'Em7') {
      cuerda[4] = '2'
    }
    if (chordStr === 'Am7') {
      cuerda[1] = '1'
      cuerda[2] = '2'
    }
    if (chordStr === 'Gm7') {
      cejilla = 3
      cuerda[2] = '3'
      cuerda[1] = '3'
    }
    return new AcordesCuerdas(chordStr, cejilla, cuerda)
  }
}
