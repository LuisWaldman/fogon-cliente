import type { Cancion } from '../../cancion/cancion'
import { MusicaHelper } from '../../cancion/MusicaHelper'
import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import { EditCompasPentagrama } from './editCompasPentagrama'

export class HelperEditPentagrama {
  CopiarEnPentagrama(cancion: Cancion, pentagraId: number, compas: number) {
    if (cancion.pentagramas.length < pentagraId) {
      return
    }

    const pentagrama = cancion.pentagramas[pentagraId]
    if (compas > pentagrama.compases.length) {
      return
    }
    const display = this.getDisplayEditCompas(pentagrama.compases[compas])
    pentagrama.compases = []
    const acordes = cancion.acordes.GetTodosLosAcordes()
    const desdeacorde: string = acordes[compas]
    const musica = new MusicaHelper()
    const esBat = pentagrama.instrumento.includes('ater')
    for (let i = 0; i < acordes.length; i++) {
      if (esBat) {
        pentagrama.compases.push(this.getCompas(display))
      } else {
        const hastaacorde: string = acordes[i]
        const desplaza = musica.DistanciaAcordes(desdeacorde, hastaacorde)
        pentagrama.compases.push(this.getCompasDesplazado(display, desplaza))
      }
    }
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
      let ritmoReal = ritmo.toString()
      if (!Number.isInteger(ritmo)) {
        ritmoReal = Math.floor(ritmo).toString() + 'd'
      }

      const pentatoAdd: PentagramaNotas[] = []
      edit.patron[index].forEach((patron, patronid) => {
        if (patron) {
          const nota = edit.notas[patronid]
          if (nota) {
            pentatoAdd.push(new PentagramaNotas(nota, ritmoReal))
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

  public getCompasDesplazado(
    edit: EditCompasPentagrama,
    corrimiento: number,
  ): PentagramaCompas {
    const musica = new MusicaHelper()
    const pentas: PentagramaNotas[][] = []
    edit.ritmo.forEach((ritmo, index) => {
      const pentatoAdd: PentagramaNotas[] = []
      edit.patron[index].forEach((patron, patronid) => {
        if (patron) {
          const nota = edit.notas[patronid]
          if (nota) {
            const nNota = musica.NotaMasDiferencial(nota, corrimiento)
            pentatoAdd.push(new PentagramaNotas(nNota, ritmo.toString()))
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
