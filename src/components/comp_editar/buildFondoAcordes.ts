import type { Cancion } from '../../modelo/cancion/cancion'
import { BuildFondo } from './buildFondo'
import type { HtmlAcorde } from './htmlAcorde'

export class BuildFondoAcordes extends BuildFondo {
  public htmlastring(html: HtmlAcorde[]): string {
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
    let anterioroEnter = false
    for (const renglon of renglones) {
      const partes = renglon.split('|')
      for (let i = 0; i < partes.length; i++) {
        if (anterioroEnter) {
          ret += '&nbsp;'.repeat(partes[i].length)
          anterioroEnter = false
        } else {
          ret +=
            this.getAcorde(acordes, cont) + '&nbsp;'.repeat(partes[i].length)
          cont++
        }
      }
      ret += '<br>'
      anterioroEnter = renglones.length > 0
    }
    return ret
  }
}
