import { ObjetoPosteable } from './objetoPosteable.ts'

export class Perfil extends ObjetoPosteable {
  SetDefaults() {
    console.log('SetDefaults perfil', this.instrumentosFavoritos)
    if (this.instrumentosFavoritos.length === 0) {
      this.instrumentosFavoritos = ['Guitarra', 'Piano', 'Ukelele']
      this.nombreSesion =
        'Fogon de ' +
        (this.nombre || 'invitado' + Math.floor(Math.random() * 20000))
      this.instrumento = this.instrumento || 'Guitarra'
    }
  }
  imagen: string // URL o base64 de la imagen de perfil
  nombre: string
  usuario: string
  descripcion: string
  instrumento: string
  nombreSesion: string = ''
  CifradoLatino: boolean = true
  instrumentosFavoritos: string[] = []

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
