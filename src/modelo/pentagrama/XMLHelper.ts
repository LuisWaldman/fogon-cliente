import { Pentagrama } from '../cancion/pentagrama'
import { XMLParser } from 'fast-xml-parser'
import { Score } from './xmlpentagrama/Score'
import { Part } from './xmlpentagrama/Part'
import { Measure } from './xmlpentagrama/Measure'
import { Note } from './xmlpentagrama/Note'

export class XMLHelper {
  public XMLToPentagramas(xml: string): Pentagrama[] {
    const ret: Pentagrama[] = []
    const score = this.XMLTToScore(xml)
    for (const p of score.parts) {
      const pentagrama = new Pentagrama()
      pentagrama.instrumento = p.id || 'Piano'
      pentagrama.clave = 'treble' // podría mejorarse leyendo el XML
      for (const m of p.measures) {
        pentagrama.compases.push(m.GetPentagramaCompas())
      }
      ret.push(pentagrama)
    }
    return ret
  }

  // Nueva función: convierte MusicXML (score-partwise) a Score
  public XMLTToScore(xml: string): Score {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    })
    const jsonObj = parser.parse(xml)
    const scoreObj =
      jsonObj['score-partwise'] || jsonObj['score-timewise'] || jsonObj

    const score = new Score()

    const partsRaw = scoreObj.part
      ? Array.isArray(scoreObj.part)
        ? scoreObj.part
        : [scoreObj.part]
      : []

    for (const p of partsRaw) {
      const part = new Part()
      part.id = p.id ?? p['@id'] ?? p['@_id'] ?? undefined
      // try to get part name from part-list if present
      if (p['@name']) part.name = p['@name']

      const measuresRaw = p.measure
        ? Array.isArray(p.measure)
          ? p.measure
          : [p.measure]
        : []

      for (const m of measuresRaw) {
        const measure = new Measure()
        measure.number =
          Number(m.number ?? m['@number'] ?? m['@_number'] ?? NaN) || undefined

        const notesRaw = m.note
          ? Array.isArray(m.note)
            ? m.note
            : [m.note]
          : []

        for (const n of notesRaw) {
          const isRest = !!n.rest
          const note = new Note()
          note.isRest = isRest

          // detectar <chord/>: comprobar existencia de la propiedad
          note.isChord =
            typeof n.chord !== 'undefined' &&
            n.chord !== null &&
            n.chord !== false

          if (!isRest && n.pitch) {
            const pitch = n.pitch
            note.step = pitch.step ?? pitch['step']
            note.octave = pitch.octave ? Number(pitch.octave) : undefined
            note.alter = pitch.alter ? Number(pitch.alter) : undefined
          }
          note.duration = n.duration ? Number(n.duration) : undefined
          note.type = n.type ?? undefined

          // si esta nota forma parte de un acorde, marcar la nota anterior como raíz
          if (note.isChord && measure.notes.length > 0) {
            ;(measure.notes[measure.notes.length - 1] as Note).chordRoot = true
          }

          // handle tie element (may be object or array)
          if (n.tie) {
            if (Array.isArray(n.tie)) {
              note.tie = n.tie[0].type ?? n.tie[0]
            } else {
              note.tie =
                n.tie.type ?? (typeof n.tie === 'string' ? n.tie : undefined)
            }
          }

          measure.notes.push(note)
        }

        part.measures.push(measure)
      }

      score.parts.push(part)
    }

    return score
  }
}
