export class InstrumentoLineasCompas {
  valorGolpePorLinea: string[][]
  public constructor(
    lineas: number,
    golpesPorLinea: number,
    valorDefafult: string,
  ) {
    const nuevasLineas: string[][] = []
    for (let i = 0; i < lineas; i++) {
      const valoresLinea: string[] = []
      for (let j = 0; j < golpesPorLinea; j++) {
        valoresLinea.push(valorDefafult)
      }
      nuevasLineas.push(valoresLinea)
    }
    this.valorGolpePorLinea = nuevasLineas
  }
}
