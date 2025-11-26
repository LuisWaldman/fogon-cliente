import { AcordesTeclas } from './AcordesTeclas'

export class AcordesPianoHelper {
  /**
   * Recibe un string y devuelve las notas del acorde para piano.
   * Retorna un objeto AcordesTeclas con el nombre del acorde y las teclas a tocar.
   */
  static getAcorde(chordStr: string): AcordesTeclas {
    const teclas: string[] = []
    if (chordStr === 'C') {
      teclas.push('C4', 'E4', 'G4')
    }
    if (chordStr === 'E') {
      teclas.push('E4', 'G#4', 'B4')
    }
    if (chordStr === 'A') {
      teclas.push('A4', 'C#5', 'E5')
    }
    if (chordStr === 'Em') {
      teclas.push('E4', 'G4', 'B4')
    }
    if (chordStr === 'Am') {
      teclas.push('A4', 'C5', 'E5')
    }
    if (chordStr === 'Bm' || chordStr === 'Sim') {
      teclas.push('B4', 'D5', 'F#5')
    }
    if (chordStr === 'D') {
      teclas.push('D4', 'F#4', 'A4')
    }
    if (chordStr === 'G') {
      teclas.push('G4', 'B4', 'D5')
    }
    if (chordStr === 'Dm') {
      teclas.push('D4', 'F4', 'A4')
    }
    if (chordStr === 'F') {
      teclas.push('F4', 'A4', 'C5')
    }
    if (chordStr === 'B7') {
      teclas.push('B4', 'D#5', 'F#5', 'A5')
    }
    if (chordStr === 'C7') {
      teclas.push('C4', 'E4', 'G4', 'Bb4')
    }
    if (chordStr === 'D7') {
      teclas.push('D4', 'F#4', 'A4', 'C5')
    }
    if (chordStr === 'E7') {
      teclas.push('E4', 'G#4', 'B4', 'D5')
    }
    if (chordStr === 'A7') {
      teclas.push('A4', 'C#5', 'E5', 'G5')
    }
    if (chordStr === 'G7') {
      teclas.push('G4', 'B4', 'D5', 'F5')
    }
    if (chordStr === 'Cmaj7') {
      teclas.push('C4', 'E4', 'G4', 'B4')
    }
    if (chordStr === 'Dm7') {
      teclas.push('D4', 'F4', 'A4', 'C5')
    }
    if (chordStr === 'F#m7' || chordStr === 'Fa#m7') {
      teclas.push('F#4', 'A4', 'C#5', 'E5')
    }
    if (chordStr === 'Bm7' || chordStr === 'Sim7') {
      teclas.push('B4', 'D5', 'F#5', 'A5')
    }
    if (chordStr === 'Em7') {
      teclas.push('E4', 'G4', 'B4', 'D5')
    }
    if (chordStr === 'Am7') {
      teclas.push('A4', 'C5', 'E5', 'G5')
    }
    if (chordStr === 'Gm7') {
      teclas.push('G4', 'Bb4', 'D5', 'F5')
    }

    return new AcordesTeclas(chordStr, teclas)
  }
}
