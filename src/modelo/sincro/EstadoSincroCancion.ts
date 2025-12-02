import type { EstadoReproduccion } from '../../EstadosAplicacion'

export class EstadoSincroCancion {
  compas: number
  golpeEnCompas: number
  estado: EstadoReproduccion
  delay: number

  constructor(
    compas: number,
    golpeEnCompas: number,
    estado: EstadoReproduccion,
    delay: number,
  ) {
    this.compas = compas
    this.golpeEnCompas = golpeEnCompas
    this.estado = estado
    this.delay = delay
  }
}
