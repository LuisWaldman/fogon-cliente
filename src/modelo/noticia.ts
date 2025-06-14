export class Noticia {
  fechayhora: Date
  titulo: string
  texto: string
  mastexto: string

  constructor(
    fechayhora: Date,
    titulo: string,
    texto: string,
    mastexto: string,
  ) {
    this.fechayhora = fechayhora
    this.titulo = titulo
    this.texto = texto
    this.mastexto = mastexto
  }
}
