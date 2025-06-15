import { ObjetoPosteable } from './objetoPosteable.ts'

export class Perfil extends ObjetoPosteable {
  imagen: string // URL o base64 de la imagen de perfil
  nombre: string
  usuario: string
  descripcion: string
  instrumento: string

  constructor(
    imagen: string,
    nombre: string,
    usuario: string,
    descripcion: string,
    instrumento: string,
  ) {
    super()
    this.imagen = imagen
    this.nombre = nombre
    this.usuario = usuario
    this.descripcion = descripcion
    this.instrumento = instrumento
  }
}
