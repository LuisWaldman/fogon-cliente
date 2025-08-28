import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import { EditCompasPentagrama } from './editCompasPentagrama'

export class HelperEditPentagrama {
  public getDisplay(pentagrama: PentagramaCompas): EditCompasPentagrama {
    const ret = new EditCompasPentagrama()
    pentagrama.notas.forEach((acorde) => {
      ret.ritmo.push(PentagramaNotas.duracionRitmo(acorde[0].duracion))
    })
    return ret
  }
  public getCompas(edit: EditCompasPentagrama): PentagramaCompas {
    return new PentagramaCompas([])
  }
}
