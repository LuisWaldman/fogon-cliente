import type { B } from 'vitest/dist/chunks/worker.d.tQu2eJQy.js'
import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import { EditCompasPentagrama } from './editCompasPentagrama'
import { EditAcordePentagrama } from './editAcordePentagrama'

export class HelperEditPentagrama {
  public getDisplayEditCompas(
    pentagrama: PentagramaCompas,
    acorde: string,
    esBateria: boolean,
  ): EditCompasPentagrama {
    const ret = new EditCompasPentagrama(acorde, esBateria)
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
      ret.AddAcorde(acordePentagrama, esBateria)
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
