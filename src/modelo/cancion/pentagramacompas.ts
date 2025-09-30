import type { PentagramaBeam } from './pentagramabeam'
import type { PentagramaLigadura } from './pentagramaligadura'
import type { PentagramaNotas } from './pentagramanotas'

export class PentagramaCompas {
  public notas: PentagramaNotas[][] = []
  public beams: PentagramaBeam[] = []
  public ligaduras: PentagramaLigadura[] = []

  constructor(notas: PentagramaNotas[][]) {
    this.notas = notas
  }
}
