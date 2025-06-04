export class ChordNote {
  string: number
  fret: number | 'x'
  label?: string

  constructor(string: number, fret: number | 'x', label?: string) {
    this.string = string
    this.fret = fret
    this.label = label
  }
}

export class AcordesGuitarra {
  position?: number
  barres?: { fromString: number; toString: number; fret: number }[]
  chord: (string | number)[][]
  constructor(
    chord: (string | number)[][],
    position?: number,
    barres?: { fromString: number; toString: number; fret: number }[],
  ) {
    this.chord = chord
    this.position = position
    this.barres = barres
  }
}

export class AcordesGuitarraHelper {
  /**
   * Recibe un string y devuelve una nota en formato GuitarChord.
   * El string debe tener el formato: "3 2 1 0 x x" (de la 1ra a la 6ta cuerda).
   */
  static getAcorde(chordStr: string): AcordesGuitarra {
    console.log('getAcorde', chordStr)
    const partes: (string | number)[][] = [
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0], // fret 0 = open string
      [5, 0], // fret x = muted string
      [6, 0],
    ]

    const position: number = 0
    const barres: { fromString: number; toString: number; fret: number }[] = []

    if (chordStr === 'B7') {
      partes[0] = [1, 3]
      partes[2] = [3, 3]
      partes[3] = [4, 2]
      partes[4] = [5, 3]
      partes[5] = [6, 'x']
    }
    if (chordStr === 'G') {
      partes[0] = [1, 3]
      partes[4] = [5, 2]
      partes[5] = [6, 3]
    }
    if (chordStr === 'C') {
      partes[1] = [2, 1]
      partes[3] = [4, 2]
      partes[4] = [5, 3]
      partes[5] = [6, 'x']
    }
    if (chordStr === 'E') {
      partes[3] = [4, 2]
      partes[4] = [5, 2]
    }
    if (chordStr === 'Em') {
      partes[3] = [4, 2]
      partes[4] = [5, 2]
    }
    return new AcordesGuitarra(partes, position, barres)
  }
}
