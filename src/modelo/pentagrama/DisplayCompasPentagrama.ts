import { StaveNote } from 'vexflow'
import type { DisplayNotaPentagrama } from './DisplayNotapentagrama'

export class DisplayCompasPentagrama {
  getStaveNote(): StaveNote[] | null {
    for (const nota of this.Notas) {
      if (nota.nota === undefined || nota.octava === undefined) {
        return null
      }
    }
    const keys = this.Notas.filter((nota) => nota.nota !== undefined).map(
      (nota) => nota.nota.toLowerCase() + '/' + nota.octava,
    )
    const notes = [
      new StaveNote({ keys: keys, duration: this.duracion.toString() }),
    ]
    return notes
  }
  public Notas: DisplayNotaPentagrama[] = []
  public duracion: string = 'qd'
}
