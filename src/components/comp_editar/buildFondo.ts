import type { Cancion } from '../../modelo/cancion'
import {
  HtmlAcordeConBr,
  HtmlAcordeSimple,
  type HtmlAcorde,
} from './htmlAcorde'

export abstract class BuildFondo {
  abstract build(cancion: Cancion, textoCancion: string): string
  abstract hacerTexto(cancion: Cancion): string

  textoRenglones(texto: string): string[][] {
    return texto.split('<br>').map((renglon) => {
      return renglon.split('|')
    })
  }
}

export class BuildFondoAcordes extends BuildFondo {
  public html_astring(html: HtmlAcorde[]): string {
    let tore = ''
    html.forEach((element) => {
      tore += element.renderizar()
    })
    return tore
  }

  public getAcorde(acordes: string[], id: number): string {
    if (id == -1) {
      return ''
    }
    if (id >= acordes.length) {
      return '.'
    }

    return acordes[id]
  }

  override build(cancion: Cancion, textoCancion: string): string {
    let acordes = cancion.acordes.GetTodosLosAcordes()
    // this.getAcorde(acordes, cont)
    if (acordes == null) {
      acordes = []
    }
    const renglones = textoCancion.split('<br>')
    let ret = ''
    let cont = 0
    let anterioro_enter = false
    for (const renglon of renglones) {
      const partes = renglon.split('|')
      for (let i = 0; i < partes.length; i++) {
        if (anterioro_enter) {
          ret += '&nbsp;'.repeat(partes[i].length)
          anterioro_enter = false
        } else {
          ret +=
            this.getAcorde(acordes, cont) + '&nbsp;'.repeat(partes[i].length)
          cont++
        }
      }
      ret += '<br>'
      anterioro_enter = renglones.length > 0
    }
    return ret
  }

  override hacerTexto(cancion: Cancion): string {
    return cancion.letras.renglones.flat().join('|').replace(/\/n/g, '<br>')
  }
}

export class BuildFondoMetricaES extends BuildFondo {
  hacerTexto(cancion: Cancion): string {
    throw new Error('Method not implemented.')
  }
  override build(cancion: Cancion, textoCancion: string): string {
    const renglones = textoCancion.split('<br>')
    let ret = ''
    for (const renglon of renglones) {
      ret += renglon.replace(/\[([^\]]+)\]/g, '').trim() + 'METRI<br>'
      ret += 'METRICA ES' + '<br>'
    }
    return ret
  }
}
