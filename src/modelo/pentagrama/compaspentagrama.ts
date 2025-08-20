import { StaveNote } from 'vexflow'
import type { NotaPentagrama } from './notapentagrama'

export class CompasPentagrama {
  getStaveNote(): StaveNote[] {
    const keys = this.Notas.filter((nota) => nota.nota !== undefined).map(
      (nota) => nota.nota.toLowerCase() + '/' + nota.octava,
    )
    console.log('teclas:', keys)
    const notes = [new StaveNote({ keys: keys, duration: '1' })]
    return notes
  }
  public Notas: NotaPentagrama[] = []
}
