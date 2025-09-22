import { PentagramaBeam } from '../../cancion/pentagramabeam'
import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import { Note } from './Note'

export class Measure {
  GetPentagramaCompas(staff: number): PentagramaCompas {
    const notas: PentagramaNotas[][] = []
    const beams: PentagramaBeam[] = []
    for (const n of this.notes) {
      if (n.staff === staff || (staff === 1 && n.staff === undefined)) {
        if (n.isRest) {
          notas.push([new PentagramaNotas('C4', `${n.GetDuracionString()}r`)])
        } else {
          const nuevaNota = new PentagramaNotas(
            `${n.step ?? ''}${n.alter ? (n.alter > 0 ? '#' : 'b') : ''}${n.octave ?? ''}`,
            n.GetDuracionString(),
          )
          n.beam?.forEach((b) => {
            if (b.type === 'begin') {
              beams.push(new PentagramaBeam(b.number, notas.length, -1))
            } else if (b.type === 'end') {
              const existingBeam = beams.find(
                (beam) => beam.numero === b.number && beam.fin === -1,
              )
              if (existingBeam) {
                existingBeam.fin = notas.length
              }
            }
          })
          if (n.isChord) {
            notas[notas.length - 1].push(nuevaNota)
          } else {
            notas.push([nuevaNota])
          }
        }
      }
    }
    const toReturn: PentagramaCompas = new PentagramaCompas(notas)
    toReturn.beams = beams
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
