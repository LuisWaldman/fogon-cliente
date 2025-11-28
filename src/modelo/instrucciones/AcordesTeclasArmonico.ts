export class AcordesTeclasArmonico {
  acorde: string = ''
  desdetecla: string = 'C4'
  hastatecla: string = 'B5'
  teclas: string[] = []
  valoresteclas: string[][] = []

  constructor(
    acorde: string,
    divisores: number,
    teclas: string[] = [],
    desdetecla: string = 'C4',
    hastatecla: string = 'B5',
  ) {
    this.acorde = acorde
    this.teclas = teclas
    this.desdetecla = desdetecla
    this.hastatecla = hastatecla
    const nuevosValores: string[][] = []
    for (let j = 0; j < teclas.length; j++) {
      const valorTecla: string[] = []
      for (let i = 0; i < divisores; i++) {
        valorTecla.push('')
      }
      nuevosValores.push(valorTecla)
    }
    this.valoresteclas = nuevosValores
  }
}
