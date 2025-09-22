import type { PentagramaBeam } from './pentagramabeam'
import type { PentagramaNotas } from './pentagramanotas'

export class PentagramaCompas {
  public notas: PentagramaNotas[][] = []
  public beams: PentagramaBeam[] = []

  constructor(notas: PentagramaNotas[][]) {
    this.notas = notas
  }
}
