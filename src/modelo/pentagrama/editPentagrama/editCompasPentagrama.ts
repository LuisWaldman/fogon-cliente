import type { PentagramaNotas } from '../../cancion/pentagramanotas'
import { EditAcordePatronNotas } from './editAcordeNotas'
import { EditAcordePentagrama } from './editAcordePentagrama'

export class EditCompasPentagrama {
  AddAcorde(acordePentagrama: PentagramaNotas[]) {
    const toPush = new EditAcordePatronNotas(this.acorde.totalNotas())
    acordePentagrama.forEach((s) => {
      const notaTexto = s.nota.substring(0, s.nota.length - 1)
      const notaOctava = parseInt(s.nota.substring(s.nota.length - 1))
      const existe = this.acorde.notassola.indexOf(notaTexto)
      if (existe !== -1) {
        toPush.patrones[existe] = 'o'
      }
    })

    this.acordespatron.push(toPush)
  }
  public ritmo: number[] = []
  public acorde: EditAcordePentagrama
  public acordespatron: EditAcordePatronNotas[] = []
  constructor(acorde: string) {
    this.acorde = new EditAcordePentagrama(acorde)
  }
}
