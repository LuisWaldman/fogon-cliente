export class EstadoSincroCancion {
  compas: number
  golpeEnCompas: number
  estado: string
  delay: number

  constructor(
    compas: number,
    golpeEnCompas: number,
    estado: string,
    delay: number,
  ) {
    this.compas = compas
    this.golpeEnCompas = golpeEnCompas
    this.estado = estado
    this.delay = delay
  }
}
