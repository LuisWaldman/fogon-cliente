export class Sesion {
  nombre: string
  usuarios: number
  estado: string
  latitud: number
  longitud: number

  constructor(
    nombre: string,
    usuarios: number,
    estado: string,
    latitud: number,
    longitud: number,
  ) {
    this.nombre = nombre
    this.usuarios = usuarios
    this.estado = estado
    this.latitud = latitud
    this.longitud = longitud
  }
}
