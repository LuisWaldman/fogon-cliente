export class Perfil {
  imagen: string // URL o base64 de la imagen de perfil
  nombreUsuario: string
  descripcion: string
  instrumento: string

  constructor(
    imagen: string,
    nombreUsuario: string,
    descripcion: string,
    instrumento: string,
  ) {
    this.imagen = imagen
    this.nombreUsuario = nombreUsuario
    this.descripcion = descripcion
    this.instrumento = instrumento
  }
}
