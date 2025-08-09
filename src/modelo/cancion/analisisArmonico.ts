export class AnalisisArmonico {
  nota: number
  estaEnscala: boolean
  alteracion: string
  muestra: string

  constructor(
    estaEnscala: boolean,
    nota: number,
    alteracion: string,
    muestra: string,
  ) {
    this.nota = nota
    this.estaEnscala = estaEnscala
    this.alteracion = alteracion
    this.muestra = muestra
  }
}
