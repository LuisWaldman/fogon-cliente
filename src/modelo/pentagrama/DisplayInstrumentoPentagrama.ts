import { Formatter, RenderContext, Stave, StaveNote } from 'vexflow'
import type { DisplayCompasPentagrama } from './DisplayCompasPentagrama'
import type { Cancion } from '../cancion/cancion'

export class DisplayInstrumentoPentagrama {
  getStave(context: RenderContext, cancion: Cancion, y: number = 0): Stave {
    const stave = new Stave(0, y, 700)
    //addKeySignature
    const key = `${cancion.escala}`
    const compas = `${cancion.compasCantidad}/${cancion.compasUnidad}`
    stave.addClef(this.clave).addKeySignature(key).addTimeSignature(compas)
    stave.setContext(context).draw()
    const todasLasNotas: StaveNote[] = []
    for (const compas of this.compases) {
      const staveNotes = compas.getStaveNote(this.clave)
      if (staveNotes) {
        todasLasNotas.push(...staveNotes) // Usar spread operator para aplanar el array
      }
    }
    Formatter.FormatAndDraw(context, stave, todasLasNotas)

    return stave
  }

  public clave: string
  public compases: DisplayCompasPentagrama[] = []

  constructor(compases: DisplayCompasPentagrama[] = [], clave: string) {
    this.compases = compases
    this.clave = clave
  }
}
