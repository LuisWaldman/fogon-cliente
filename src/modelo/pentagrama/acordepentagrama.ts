import type { NotaPentagrama } from './notapentagrama'

export class AcordePentagrama {
  public notas: NotaPentagrama[]
  constructor(notas: NotaPentagrama[]) {
    this.notas = notas
  }
}
