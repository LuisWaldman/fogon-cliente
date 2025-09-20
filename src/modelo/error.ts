export class Error {
  fecha: Date
  mensaje: string
  stack: string

  constructor(mensaje: string, stack: string) {
    this.fecha = new Date()
    this.mensaje = mensaje
    this.stack = stack
  }
}
