import { Formatter, RenderContext, Stave, StaveNote } from 'vexflow'
import type { DisplayAcordesPentagrama } from './DisplayAcordesPentagrama'

export class DisplayInstrumentoPentagrama {
  getStave(context: RenderContext): Stave {
    const stave = new Stave(10, 0, 700)
    stave.addClef('treble').addTimeSignature('4/4')
    stave.setContext(context).draw()
    
    const misNotas: StaveNote[] = []
    for (const acorde of this.acordes) {
      const staveNotes = acorde.getStaveNote()
      let x = 0
      if (staveNotes) {
        staveNotes.forEach((nota) => {
          nota.setX(x)
          //nota.setStyle({ strokeStyle: 'red', fillStyle: 'red' })
        })
        x += 55
        misNotas.push(...staveNotes)
        //Formatter.FormatAndDraw(context, stave, staveNotes)
      }
    }
    
    Formatter.FormatAndDraw(context, stave, misNotas)
    // Dibujar el pentagrama primero
    
    return stave
  }
  public acordes: DisplayAcordesPentagrama[] = []

  constructor(compases: DisplayAcordesPentagrama[] = []) {
    this.acordes = compases
  }
}
