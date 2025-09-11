import type { Pentagrama } from '../cancion/pentagrama'
import { XMLParser } from 'fast-xml-parser'

export class XMLHelper {
  public XMLToPentagramas(xml: string): Pentagrama[] {
    // Implementación de la conversión de XML a pentagramas
    const parser = new XMLParser({ ignoreAttributes: false })
    const parse = parser.parse(xml)
    console.log('Partes:', parse['score-partwise']['part-list']['score-part'])
    return parse['score-partwise']?.partlist || []
  }
}
