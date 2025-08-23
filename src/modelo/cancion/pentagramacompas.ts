import type { PentagramaNotas } from './pentagramanotas'

export class PentagramaCompas {
  public notas: PentagramaNotas[][] = []

  constructor(notas: PentagramaNotas[][]) {
    this.notas = notas
  }
}
