import { Formatter, RenderContext, Stave, StaveNote } from 'vexflow'
import type { DisplayCompasPentagrama } from './DisplayCompasPentagrama'

export class DisplayInstrumentoPentagrama {
  getStave(context: RenderContext): Stave {
    const stave = new Stave(0, 0, 700)
    stave.addClef(this.clave).addTimeSignature('4/4')
    stave.setContext(context).draw()
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

  public clave: string = 'treble'
  public visible: boolean = true
  public compases: DisplayCompasPentagrama[] = []

  constructor(compases: DisplayCompasPentagrama[] = []) {
    this.compases = compases
  }
}
