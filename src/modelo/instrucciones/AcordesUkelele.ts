export class AcordesUkelele {
  cejilla?: number
  cuerda: string[] = []
  acorde: string = ''
  constructor(acorde: string, cejilla?: number, notas: string[] = []) {
    this.acorde = acorde
    this.cejilla = cejilla
    this.cuerda = notas
  }
}
