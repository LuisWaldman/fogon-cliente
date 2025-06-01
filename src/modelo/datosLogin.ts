export class datosLogin {
  public modo: string
  public usuario: string
  public password: string
  public mantenerseLogeado: boolean
  constructor(
    modo: string,
    usuario: string,
    password: string,
    mantenerseLogeado: boolean,
  ) {
    this.modo = modo
    this.usuario = usuario
    this.password = password
    this.mantenerseLogeado = mantenerseLogeado
  }
}
