import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
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
    const pentas: PentagramaNotas[][] = []
    edit.ritmo.forEach((ritmo, index) => {
      const pentatoAdd: PentagramaNotas[] = []
      edit.acordespatron[index].patrones.forEach((patron, patronid) => {
        if (patron === 'o') {
          const nota = edit.acorde.notas[patronid]
          console.log(nota, ritmo)
          pentatoAdd.push(new PentagramaNotas(nota, ritmo.toString()))
        }
      })
      if (pentatoAdd.length == 0) {
        pentatoAdd.push(new PentagramaNotas('C4', ritmo.toString() + 'r'))
      }

      pentas.push(pentatoAdd)
    })
    return new PentagramaCompas(pentas)
  }
}
