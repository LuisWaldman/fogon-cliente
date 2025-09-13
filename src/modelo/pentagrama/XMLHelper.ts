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
    let pentagramaid = 1
    for (const p of score.parts) {
      for (const c of p.claves) {
        const pentagrama = new Pentagrama()
        pentagrama.instrumento = p.id || 'Piano'
        pentagrama.clave = c === 'F' ? 'bass' : 'treble'
        for (const m of p.measures) {
          pentagrama.compases.push(m.GetPentagramaCompas(pentagramaid))
        }
        ret.push(pentagrama)
        pentagramaid++
      }
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
    // Nota: las <clef> aparecen dentro de <attributes> en los compases.
    // Se deja score.parts vacío aquí y asignamos claves por parte al procesar cada <part>.
    // (No hacemos nada en este punto)

    const partsRaw = scoreObj.part
      ? Array.isArray(scoreObj.part)
        ? scoreObj.part
        : [scoreObj.part]
      : []

    for (const p of partsRaw) {
      const part = new Part()
      part.id = p.id ?? p['@id'] ?? p['@_id'] ?? undefined
      const measuresRaw = p.measure
        ? Array.isArray(p.measure)
          ? p.measure
          : [p.measure]
        : []

      // Buscar un compás que tenga <attributes> y extraer sus <clef>
      const attribMeasure =
        measuresRaw.find(
          (m: any) => m.attributes || m['attributes'] || m['@attributes'],
        ) ?? undefined
      const attributes =
        attribMeasure?.attributes ??
        attribMeasure?.['attributes'] ??
        attribMeasure?.['@attributes'] ??
        undefined
      if (attributes) {
        const clefs = attributes.clef ?? attributes['clef']
        if (clefs) {
          if (Array.isArray(clefs)) {
            // guardar signos de las claves (p. ej. "G", "F")
            part.claves = clefs.map(
              (c: { sign?: string; [key: string]: unknown }) =>
                c.sign ?? (c['sign'] || 'G'), // valor por defecto si no hay signo
            )
          } else {
            part.claves = [clefs.sign ?? clefs['sign']]
          }
        }
      }

      for (const m of measuresRaw) {
        const measure = new Measure()
        measure.number =
          Number(m.number ?? m['@number'] ?? m['@_number'] ?? NaN) || undefined
        // detectar <barline> / <repeat> y asignar direction / times al Measure
        const barlinesRaw = m.barline
          ? Array.isArray(m.barline)
            ? m.barline
            : [m.barline]
          : []
        for (const b of barlinesRaw) {
          const repeatRaw = b.repeat ?? b['repeat'] ?? undefined
          if (!repeatRaw) continue
          const repeats = Array.isArray(repeatRaw) ? repeatRaw : [repeatRaw]
          for (const r of repeats) {
            const dir =
              r.direction ?? r['direction'] ?? r['@direction'] ?? undefined
            if (dir === 'forward' || dir === 'backward') {
              measure.direction = dir as 'forward' | 'backward'
            }
            const timesRaw = r.times ?? r['times'] ?? undefined
            if (typeof timesRaw !== 'undefined') {
              // times puede venir como string o como objeto con texto
              const timesVal =
                typeof timesRaw === 'object'
                  ? (timesRaw['#text'] ??
                    timesRaw['#'] ??
                    Object.values(timesRaw)[0])
                  : timesRaw
              const timesNum = Number(timesVal)
              if (!Number.isNaN(timesNum) && timesNum > 0) {
                measure.times = timesNum
              }
            }
          }
        }

        const notesRaw = m.note
          ? Array.isArray(m.note)
            ? m.note
            : [m.note]
          : []

        for (const n of notesRaw) {
          // detectar rest aunque venga como objeto vacío, string o con atributos
          const isRest = typeof n.rest !== 'undefined' && n.rest !== null
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

          // asignar número de staff si viene en la nota (<staff>1</staff> en MusicXML)
          const staffRaw =
            n.staff ?? n['staff'] ?? n['@staff'] ?? n['@_staff'] ?? undefined
          note.staff =
            typeof staffRaw !== 'undefined'
              ? Number(staffRaw) || undefined
              : undefined

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
