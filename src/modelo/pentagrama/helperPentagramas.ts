import type { Cancion } from '../cancion/cancion'
import { MusicaHelper } from '../cancion/MusicaHelper'
import { CompasPentagrama } from './compaspentagrama'
import { DisplayPentagrama } from './displayPentagrama'
import { NotaPentagrama } from './notapentagrama'
import { Pentagrama } from './pentagrama'
import { RenglonPentagrama } from './renglonpentagrama'

export class HelperPentagramas {
  private musica = new MusicaHelper()
  public creaDisplayPentagrama(cancion: Cancion): DisplayPentagrama {
    const display = new DisplayPentagrama()
    const acordes = cancion.acordes.GetTodosLosAcordes()
    let renglon = new RenglonPentagrama()
    renglon.pentagramas.push(new Pentagrama([]))
    for (let i = 0; i < acordes.length; i++) {
      const acorde = acordes[i]
      renglon.pentagramas[0].compases.push(this.creaCompasPentagrama(acorde, 4))
      if (i > 0 && i % 3 === 0) {
        display.renglones.push(renglon)
        renglon = new RenglonPentagrama()
        renglon.pentagramas.push(new Pentagrama([]))
      }
    }
    display.renglones.push(renglon)
    return display
  }

  public creaCompasPentagrama(
    acorde: string,
    octava: number,
  ): CompasPentagrama {
    const notas = this.musica.GetNotasdeacorde(acorde)
    const compas = new CompasPentagrama()
    for (let i = 0; i < notas.length; i++) {
      compas.Notas.push(new NotaPentagrama(notas[i], octava))
    }
    return compas
  }
}
