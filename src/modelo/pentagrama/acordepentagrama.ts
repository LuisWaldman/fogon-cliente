import type { DisplayNotaPentagrama } from './DisplayNotapentagrama'

export class AcordePentagrama {
  public notas: DisplayNotaPentagrama[]
  constructor(notas: DisplayNotaPentagrama[]) {
    this.notas = notas
  }
}
