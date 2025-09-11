export class DisplayNotaPentagrama {
  public nota: string
  public octava: number
  public modificador: string = '' // n, #, b
  constructor(nota: string, octava: number) {
    this.nota = nota
    this.octava = octava
  }
}
