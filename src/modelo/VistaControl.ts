export class VistaControl {
  tamanioReferencia: number
  totalRenglones: number
  renglonesAvanza: number
  alto: number
  tipo: string
  clase: string

  constructor(
    tamanioReferencia: number,
    totalRenglones: number,
    renglonesAvanza: number,
    tipo: string,
    clase: string,
    alto: number,
  ) {
    this.tamanioReferencia = tamanioReferencia
    this.totalRenglones = totalRenglones
    this.renglonesAvanza = renglonesAvanza
    this.tipo = tipo
    this.clase = clase
    this.alto = alto
  }
}
