export class AcordesTeclas {
  acorde: string = ''
  desdetecla: string = 'C4'
  hastatecla: string = 'B5'
  teclas: string[] = []

  constructor(
    acorde: string,
    teclas: string[] = [],
    desdetecla: string = 'C4',
    hastatecla: string = 'B5',
  ) {
    this.acorde = acorde
    this.teclas = teclas
    this.desdetecla = desdetecla
    this.hastatecla = hastatecla
  }
}
