export class AcordeDisplay {
  public contenido: string
  public left: number
  public compas: number = 0
  public constructor(contenido: string, left: number) {
    this.contenido = contenido
    this.left = left
  }
}
