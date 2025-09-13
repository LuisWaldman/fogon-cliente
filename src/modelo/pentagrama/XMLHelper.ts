import { Pentagrama } from '../cancion/pentagrama'
import { XMLParser } from 'fast-xml-parser'
import { PentagramaCompas } from '../cancion/pentagramacompas'
import type { PentagramaNotas } from '../cancion/pentagramanotas'
import { parseScore } from 'musicxml-interfaces'

export class XMLHelper {
  public XMLToPentagramas(xml: string): Pentagrama[] {
    const ret: Pentagrama[] = []

    // Eliminar DOCTYPE y declaraciones de entidades para evitar que el navegador intente cargar DTDs externos
    const safeXml = xml
      .replace(/<!DOCTYPE[\s\S]*?>/i, '')
      .replace(/<!ENTITY[\s\S]*?>/gi, '')

    // Parsear a objeto tipado
    const score = parseScore(safeXml)
    score.partList.forEach((part) => {
      const pentagrama = Pentagrama.GetPentagramaDefault(0)
      if ('partName' in part) {
        console.log(part.partName.partName)
        pentagrama.instrumento = part.partName.partName
      }
      ret.push(pentagrama)
    })
    let parteId = 0
      console.log(score.measures)
      score.measures.forEach((measure) => {
      console.log(measure.parts)
      // Por ahora solo se crean compases vacíos
      /*
          
          const notas: PentagramaNotas[][] = []
          const compas = new PentagramaCompas(notas)
          ret[parteId].compases.push(compas)
          */
    })

    parteId++

    return ret
  }
}
