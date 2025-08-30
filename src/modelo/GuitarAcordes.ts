export class AcordesGuitarra {
  cejilla?: number
  cuerda: string[] = []
  acorde: string = ''
  constructor(acorde: string, cejilla?: number, notas: string[] = []) {
    this.acorde = acorde
    this.cejilla = cejilla
    this.cuerda = notas
  }
}

export class AcordesGuitarraHelper {
  /**
   * Recibe un string y devuelve una nota en formato GuitarChord.
   * El string debe tener el formato: "3 2 1 0 x x" (de la 1ra a la 6ta cuerda).
   */
  static getAcorde(chordStr: string): AcordesGuitarra {
    console.log('getAcorde', chordStr)
    const cuerda: string[] = ['0', '0', '0', '0', '0', '0']
    const cejilla: number = 0

    if (chordStr === 'B7') {
      cuerda[0] = '2'
      cuerda[2] = '2'
      cuerda[3] = '1'
      cuerda[4] = '2'
      cuerda[5] = 'x'
    }
    if (chordStr === 'G') {
      cuerda[0] = '3'
      cuerda[4] = '2'
      cuerda[5] = '3'
    }
    if (chordStr === 'C') {
      cuerda[1] = '1'
      cuerda[3] = '2'
      cuerda[4] = '3'
      cuerda[5] = 'x'
    }
    if (chordStr === 'E') {
      cuerda[3] = '2'
      cuerda[4] = '2'
    }
    if (chordStr === 'Em') {
      cuerda[3] = '2'
      cuerda[4] = '2'
    }
    return new AcordesGuitarra(chordStr, cejilla, cuerda)
  }
}
