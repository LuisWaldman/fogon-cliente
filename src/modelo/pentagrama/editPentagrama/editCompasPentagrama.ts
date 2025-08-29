import type { PentagramaNotas } from '../../cancion/pentagramanotas'
import { EditAcordePatronNotas } from './editAcordeNotas'
import { EditAcordePentagrama } from './editAcordePentagrama'

export class EditCompasPentagrama {
  public ritmo: number[] = []
  public acorde: EditAcordePentagrama
  public acordespatron: EditAcordePatronNotas[] = []
  constructor(acorde: string, esBateria: boolean) {
    this.acorde = new EditAcordePentagrama(acorde, esBateria)
  }
  CompletarRitmo() {
    const divisores = [1, 2, 4, 8, 16, 32] // sin puntillo
    const total = this.ritmo.reduce((acc, d) => acc + 1 / d, 0)
    let restante = 1 - total

    while (restante > 0.00001) {
      const candidato = divisores.find((d) => 1 / d <= restante)
      if (!candidato) break
      this.ritmo.push(candidato)
      this.AddAcorde([])
      restante -= 1 / candidato
    }
  }
  AddAcorde(acordePentagrama: PentagramaNotas[]) {
    const toPush = new EditAcordePatronNotas(this.acorde.totalNotas())
    acordePentagrama.forEach((s) => {
      const notaTexto = s.nota.substring(0, s.nota.length - 1)
      const existe = this.acorde.notassola.indexOf(notaTexto)
      if (existe !== -1) {
        toPush.patrones[existe] = 'o'
      }
    })

    this.acordespatron.push(toPush)
  }
}
