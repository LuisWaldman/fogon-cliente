import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import { Note } from './Note'

export class Measure {
  GetPentagramaCompas(): PentagramaCompas {
    const notas: PentagramaNotas[][] = []
    for (const n of this.notes) {
      if (n.isRest) {
        notas.push([new PentagramaNotas('C4', `${n.duration?.toString()}r`)])
      } else {
        const nuevaNota = new PentagramaNotas(
          `${n.step ?? ''}${n.octave ?? ''}${n.alter ? (n.alter > 0 ? '#' : 'b') : ''}`,
          n.GetDuracionString(),
        )
        if (n.isChord) {
          notas[notas.length - 1].push(nuevaNota)
        } else {
          notas.push([nuevaNota])
        }
      }
    }
    const toReturn: PentagramaCompas = new PentagramaCompas(notas)
    return toReturn
  }
  number?: number
  notes: Note[] = []

  constructor(init?: Partial<Measure>) {
    Object.assign(this, init)
  }
}
