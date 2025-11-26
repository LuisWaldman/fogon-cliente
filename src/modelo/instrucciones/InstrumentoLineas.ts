export class InstrumentoLineas {
  nombreLinea: string[] = []
  notaLinea: string[] = []
  notasPosibles: string[] = []
  constructor(
    nombreLinea: string[] = [],
    notaLinea: string[] = [],
    notasPosibles: string[] = [],
  ) {
    this.nombreLinea = nombreLinea
    this.notaLinea = notaLinea
    this.notasPosibles = notasPosibles
  }

  public static GetGuitarraEstandar(): InstrumentoLineas {
    return new InstrumentoLineas(
      ['E', 'B', 'G', 'D', 'A', 'E'],
      ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
      ['x', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    )
  }

  public static GetUkeleleEstandar(): InstrumentoLineas {
    return new InstrumentoLineas(
      ['A', 'E', 'C', 'G'],
      ['A4', 'E4', 'C4', 'G4'],
      ['x', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    )
  }

  public static GetBajo4CuerdasEstandar(): InstrumentoLineas {
    return new InstrumentoLineas(
      ['G', 'D', 'A', 'E'],
      ['G2', 'D2', 'A1', 'E1'],
      ['x', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    )
  }

  public static GetHarmonicaEstandar(): InstrumentoLineas {
    return new InstrumentoLineas(
      [''],
      [''],
      [
        '',
        '1',
        '(1)',
        '2',
        '(2)',
        '3',
        '4',
        '(4)',
        '5',
        '(5)',
        '6',
        '(6)',
        '7',
        '(7)',
        '8',
        '(8)',
        '9',
        '(9)',
        '10',
        '(10)',
      ],
    )
  }

  public static GetPianoEstandar(): InstrumentoLineas {
    return new InstrumentoLineas(
      [
        'C1',
        'D1',
        'E1',
        'F1',
        'G1',
        'A1',
        'B1',
        'C2',
        'D2',
        'E2',
        'F2',
        'G2',
        'A2',
        'B2',
        'C3',
        'D3',
        'E3',
        'F3',
        'G3',
        'A3',
        'B3',
        'C4',
        'D4',
        'E4',
        'F4',
        'G4',
        'A4',
        'B4',
        'C5',
        'D5',
        'E5',
        'F5',
        'G5',
        'A5',
        'B5',
        'C6',
        'D6',
        'E6',
        'F6',
        'G6',
        'A6',
        'B6',
        'C7',
        'D7',
        'E7',
        'F7',
        'G7',
        'A7',
        'B7',
        'C8',
      ],
      [
        'C1',
        'D1',
        'E1',
        'F1',
        'G1',
        'A1',
        'B1',
        'C2',
        'D2',
        'E2',
        'F2',
        'G2',
        'A2',
        'B2',
        'C3',
        'D3',
        'E3',
        'F3',
        'G3',
        'A3',
        'B3',
        'C4',
        'D4',
        'E4',
        'F4',
        'G4',
        'A4',
        'B4',
        'C5',
        'D5',
        'E5',
        'F5',
        'G5',
        'A5',
        'B5',
        'C6',
        'D6',
        'E6',
        'F6',
        'G6',
        'A6',
        'B6',
        'C7',
        'D7',
        'E7',
        'F7',
        'G7',
        'A7',
        'B7',
        'C8',
      ],
      ['', 'O'],
    )
  }
}
