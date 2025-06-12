import { ObjetoPosteable } from './objetoPosteable.ts'

export class Perfil extends ObjetoPosteable {
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
    super()
    this.imagen = imagen
    this.nombreUsuario = nombreUsuario
    this.descripcion = descripcion
    this.instrumento = instrumento
  }
}
