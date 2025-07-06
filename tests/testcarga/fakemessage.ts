export class FakeMessage {
  mensaje: string
  args: unknown[]

  constructor(mensaje: string, args: unknown[] = []) {
    this.mensaje = mensaje
    this.args = args
  }
}
