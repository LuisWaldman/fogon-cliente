import type { Cancion } from '../../cancion/cancion'
import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import { EditCompasPentagrama } from './editCompasPentagrama'

export class HelperEditPentagrama {
  CopiarEnPentagrama(cancion: Cancion, pentagraId: number, compas: number) {
    if (cancion.pentagramas.length < pentagraId) {
      return
    }
    console.log('CopiarEnPentagrama', pentagraId, compas)
    return
    /*
    const pentagrama = cancion.pentagramas[pentagraId]
    if (compas > pentagrama.compases.length) {
      return
    }
    const display = this.getDisplayEditCompas(
      pentagrama.compases[compas],
    )
    pentagrama.compases = []
    for (let i = 0; i < cancion.acordes.ordenPartes.length; i++) {
      const ordenParte = cancion.acordes.ordenPartes[i]
      for (
        let j = 0;
        j < cancion.acordes.partes[ordenParte].acordes.length;
        j++
      ) {
        display.acorde.acorde = cancion.acordes.partes[ordenParte].acordes[j]
        display.acorde.Calcular()
        pentagrama.compases.push(this.getCompas(display))
      }
    }*/
  }
  public getDisplayEditCompas(
    pentagrama: PentagramaCompas,
  ): EditCompasPentagrama {
    const ret = new EditCompasPentagrama()
    // Recorro el pentagrama buscando acordes fuera del compas
    pentagrama.notas.forEach((acordePentagrama) => {
      acordePentagrama.forEach((nota) => {
        if (!ret.notas.includes(nota.nota)) {
          ret.notas.push(nota.nota)
        }
      })
    })
    pentagrama.notas.forEach((acordePentagrama) => {
      let min = 9999999999
      acordePentagrama.forEach((nota) => {
        min = Math.min(min, PentagramaNotas.duracionRitmo(nota.duracion))
      })

      ret.ritmo.push(min)
      ret.AddAcorde(acordePentagrama)
    })
    ret.CompletarRitmo()
    return ret
  }
  public getCompas(edit: EditCompasPentagrama): PentagramaCompas {
    const pentas: PentagramaNotas[][] = []
    edit.ritmo.forEach((ritmo, index) => {
      const pentatoAdd: PentagramaNotas[] = []
      edit.patron[index].forEach((patron, patronid) => {
        if (patron) {
          const nota = edit.notas[patronid]
          if (nota) {
            pentatoAdd.push(new PentagramaNotas(nota, ritmo.toString()))
          }
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
