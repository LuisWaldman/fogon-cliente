import { Formatter, RenderContext, Stave, StaveNote } from 'vexflow'
import type { DisplayCompasPentagrama } from './DisplayCompasPentagrama'

export class DisplayInstrumentoPentagrama {
  getStave(context: RenderContext): Stave {
    console.log('DIBUJANDO PENTAGRAMA')
    const stave = new Stave(10, 0, 700)
    stave.addClef('treble').addTimeSignature('4/4')

    const misNotas: StaveNote[] = []
    for (const compas of this.compases) {
      const staveNotes = compas.getStaveNote()
      if (staveNotes) {
        misNotas.push(...staveNotes)
      }
    }
    // Dibujar el pentagrama primero
    stave.setContext(context).draw()
    Formatter.FormatAndDraw(context, stave, misNotas)
    return stave
  }
  public compases: DisplayCompasPentagrama[] = []

  constructor(compases: DisplayCompasPentagrama[] = []) {
    this.compases = compases
  }
}
