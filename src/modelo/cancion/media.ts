export class Media {
  public tipo: string
  public id: string
  public delay: number = 0

  constructor(tipo: string, id: string, delay: number) {
    this.tipo = tipo
    this.id = id
    this.delay = delay
  }
}
