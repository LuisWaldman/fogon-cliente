import { Formatter, RenderContext, Stave, Beam, StaveTie } from 'vexflow'
import type { DisplayCompasPentagrama } from './DisplayCompasPentagrama'
import type { Cancion } from '../cancion/cancion'

export class DisplayInstrumentoPentagrama {
  getStave(
    context: RenderContext,
    cancion: Cancion,
    y: number = 0,
    compasActual: number,
  ): Stave {
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
      if (staveNotes && staveNotes.length > 0) {
        if (compasActual == compas.nroCompas) {
          context.setFillStyle('#ff2600ff')
          context.setStrokeStyle('#ff2600ff')
        } else {
          context.setFillStyle('#a9a8f6')
          context.setStrokeStyle('#a9a8f6')
        }
        Formatter.FormatAndDraw(context, staveCompas, staveNotes)
        staveCompas.setContext(context).draw()

        // DIBUJAR BEAMS
        if (compas.beams && compas.beams.length > 0) {
          for (const beamData of compas.beams) {
            // beamData.inicio y beamData.fin son los índices de las notas
            const notesForBeam = staveNotes.slice(
              beamData.inicio,
              beamData.fin + 1,
            )
            if (notesForBeam.length > 0) {
              const beam = new Beam(notesForBeam)
              beam.setContext(context).draw()
            }
          }
        }

        if (compas.ligaduras && compas.ligaduras.length > 0) {
          console.log('ligaduras', compas.ligaduras)
          for (const ligaduraData of compas.ligaduras) {
            const startNote = staveNotes[ligaduraData.desdeNota]
            const endNote = staveNotes[ligaduraData.hastaNota]
            if (startNote && endNote) {
              const tie = new StaveTie({
                firstNote: startNote,
                lastNote: endNote,
                firstIndexes: [0],
                lastIndexes: [0],
              })
              tie.setContext(context).draw()
            }
          }
        }
      }
    }
    return stave
  }

  public clave: string
  public compases: DisplayCompasPentagrama[] = []

  constructor(compases: DisplayCompasPentagrama[] = [], clave: string) {
    this.compases = compases
    this.clave = clave
  }
}
