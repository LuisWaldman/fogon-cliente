import { Formatter, RenderContext, Stave, StaveNote } from 'vexflow'
import type { DisplayAcordesPentagrama } from './DisplayAcordesPentagrama'
import type { DisplayCompasPentagrama } from './DisplayCompasPentagrama'

export class DisplayInstrumentoPentagrama {
  getStave(context: RenderContext): Stave {
    const stave = new Stave(0, 0, 700)
    stave.addClef('treble').addTimeSignature('4/4')
    stave.setContext(context).draw()
    /*
    const notes = [
      new StaveNote({
        keys: ['c/4', 'g/4'],
        duration: 'q',
      }),
      new StaveNote({
        keys: ['c/4', 'g/4'],
        duration: 'q',
      }),
      new StaveNote({
        keys: ['e/4', 'a/4'],
        duration: 'q',
      }),
    ]

    Formatter.FormatAndDraw(context, stave, notes)
    return stave
    */
    const todasLasNotas: StaveNote[] = []
    for (const compas of this.compases) {
      const staveNotes = compas.getStaveNote()
      if (staveNotes) {
        todasLasNotas.push(...staveNotes) // Usar spread operator para aplanar el array
      }
    }
    Formatter.FormatAndDraw(context, stave, todasLasNotas)

    return stave
  }

  public compases: DisplayCompasPentagrama[] = []

  constructor(compases: DisplayCompasPentagrama[] = []) {
    this.compases = compases
  }
}
