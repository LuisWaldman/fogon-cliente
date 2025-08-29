import type { PentagramaNotas } from '../../cancion/pentagramanotas'

export class EditAcordePatronNotas {
  public patrones: string[] = []
  public constructor(compasDivisor: number) {
    for (let i = 0; i < compasDivisor; i++) {
      this.patrones.push('x')
    }
  }
}
