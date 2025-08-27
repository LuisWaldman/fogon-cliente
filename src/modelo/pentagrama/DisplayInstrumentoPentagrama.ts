import { Formatter, RenderContext, Stave } from 'vexflow'
import type { DisplayCompasPentagrama } from './DisplayCompasPentagrama'
import type { Cancion } from '../cancion/cancion'

export class DisplayInstrumentoPentagrama {
  getStave(context: RenderContext, cancion: Cancion, y: number = 0, compasActual: number): Stave {
    let x = 0
    context.setFillStyle('#a9a8f6')
    context.setStrokeStyle('#a9a8f6')
    const anchoPrimerStave = 100
    const anchoCompasStave = 200
    const stave = new Stave(x, y, anchoPrimerStave)
    //addKeySignature
    const key = `${cancion.escala}`
    const compas = `${cancion.compasCantidad}/${cancion.compasUnidad}`
    stave.addClef(this.clave).addKeySignature(key).addTimeSignature(compas)
    stave.setContext(context).draw()
    x += anchoPrimerStave

    
    for (const compas of this.compases) {
      const staveCompas = new Stave(x, y, anchoCompasStave)
      x += anchoCompasStave
      const staveNotes = compas.getStaveNote(this.clave)
      if (staveNotes) {
        if (compasActual == compas.nroCompas) {

            context.setFillStyle('#ff2600ff')
            context.setStrokeStyle('#ff2600ff')
        } else {
            context.setFillStyle('#a9a8f6')
            context.setStrokeStyle('#a9a8f6')
        }
        Formatter.FormatAndDraw(context, staveCompas, staveNotes)
        staveCompas.setContext(context).draw()
      }
      
    }
    /*
    Para dibujar el puntillo
    Dot.buildAndAttach([todasLasNotas[0]], { index: 0 })
    */
    
    

    return stave
  }

  public clave: string
  public compases: DisplayCompasPentagrama[] = []

  constructor(compases: DisplayCompasPentagrama[] = [], clave: string) {
    this.compases = compases
    this.clave = clave
  }
}
