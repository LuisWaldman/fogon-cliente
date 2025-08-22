export class ResumenNotaMidi {
  public nota: string
  public cuarto: number
  public duracionCuartos: number
  constructor(nota: string, cuarto: number, duracionCuartos: number) {
    this.nota = nota
    this.cuarto = cuarto
    this.duracionCuartos = duracionCuartos
  }
}
