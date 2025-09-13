import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import { Note } from './Note'

export class Measure {
  GetPentagramaCompas(staff: number): PentagramaCompas {
    const notas: PentagramaNotas[][] = []
    for (const n of this.notes) {
      if (n.staff === staff || (staff === 1 && n.staff === undefined)) {
        if (n.isRest) {
          notas.push([new PentagramaNotas('C4', `${n.GetDuracionString()}r`)])
        } else {
          const nuevaNota = new PentagramaNotas(
            `${n.step ?? ''}${n.alter ? (n.alter > 0 ? '#' : 'b') : ''}${n.octave ?? ''}`,
            n.GetDuracionString(),
          )
          if (n.isChord) {
            notas[notas.length - 1].push(nuevaNota)
          } else {
            notas.push([nuevaNota])
          }
        }
      }
    }
    const toReturn: PentagramaCompas = new PentagramaCompas(notas)
    return toReturn
  }
  number?: number
  direction?: 'forward' | 'backward'
  times?: number
  notes: Note[] = []

  constructor(init?: Partial<Measure>) {
    Object.assign(this, init)
  }
}
