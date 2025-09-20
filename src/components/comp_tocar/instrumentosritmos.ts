export class InstrumentosRitmos {
  texto: string
  alto: number
  ancho: number
  left: number
  top: number
  circulo: boolean
  nota: string
  size: string

  constructor(
    texto: string,
    nota: string,
    alto: number,
    ancho: number,
    left: number,
    top: number,
    circulo: boolean,
    size: string = '36px',
  ) {
    this.texto = texto
    this.alto = alto
    this.ancho = ancho
    this.left = left
    this.top = top
    this.circulo = circulo
    this.nota = nota
    this.size = size
  }
}
