import { Formatter, RenderContext, Stave, StaveNote } from 'vexflow'
import type { DisplayCompasPentagrama } from './DisplayCompasPentagrama'

export class DisplayClavePentagrama {
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

    // Solo formatear y dibujar notas si existen
    if (misNotas.length > 0) {
      const notasValidas = misNotas.filter(
        (nota) => nota != null && typeof nota.getMetrics === 'function',
      )

      if (notasValidas.length > 0) {
        // FormatAndDraw ya no necesita dibujar el stave
        Formatter.FormatAndDraw(context, stave, notasValidas)
      }
    }

    return stave
  }
  public compases: DisplayCompasPentagrama[] = []

  constructor(compases: DisplayCompasPentagrama[] = []) {
    this.compases = compases
  }
}
