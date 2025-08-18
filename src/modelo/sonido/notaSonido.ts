export class NotaSonido {
  public frecuencia: number
  public nota: string
  public octava: number
  public constructor(frecuencia: number, nota: string, escala: number) {
    this.frecuencia = frecuencia
    this.nota = nota
    this.octava = escala
  }
}
