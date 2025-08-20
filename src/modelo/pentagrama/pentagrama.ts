import type { CompasPentagrama } from './compaspentagrama'

export class Pentagrama {
  public compases: CompasPentagrama[] = []

  constructor(compases: CompasPentagrama[] = []) {
    this.compases = compases
  }
}
