import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import type { EditAcordeNota } from './editAcordeNotas'
import { EditCompasPentagrama } from './editCompasPentagrama'

export class HelperEditPentagrama {
  public getDisplayEditCompas(
    pentagrama: PentagramaCompas,
    acorde: string,
  ): EditCompasPentagrama {
    const ret = new EditCompasPentagrama(acorde)
    let cPrimer = true
    pentagrama.notas.forEach((acordePentagrama) => {
      let min = 9999999999
      acordePentagrama.forEach((nota) => {
        min = Math.min(min, PentagramaNotas.duracionRitmo(nota.duracion))
      })
      ret.ritmo.push(min)
      if (cPrimer) {
        cPrimer = false
        ret.acorde.SetOctavaFromNotas(acordePentagrama)
      }
      ret.AddAcorde(acordePentagrama)
    })
    return ret
  }
  public getCompas(edit: EditCompasPentagrama): PentagramaCompas {
    return new PentagramaCompas([])
  }
}
