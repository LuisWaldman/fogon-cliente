import { Cancion } from '../../modelo/cancion'
import { HtmlAcorde, HtmlAcordeSimple, HtmlAcordeConBr } from './htmlAcorde'

export class EditarHelper {
  static textoAobjetoshtml(texto: string, cancion: Cancion): HtmlAcorde[] {
    //HtmlAcorde, HtmlAcordeSimple, HtmlAcordeConBr

    const acordes = cancion.acordes.GetTodosLosAcordes()
    if (acordes == null) {
      return []
    }
    return this.acordesAobjetoshtml(texto, acordes)
  }

  static getAcorde(acordes: string[], id: number): string {
    if (id == -1) {
      return ''
    }
    if (id >= acordes.length) {
      return '.'
    }

    return acordes[id]
  }

  static acordesAobjetoshtml(texto: string, acordes: string[]): HtmlAcorde[] {
    //HtmlAcorde, HtmlAcordeSimple, HtmlAcordeConBr
    const tore: HtmlAcorde[] = []
    let cont = 0
    const partes = texto.split('|')
    partes.forEach((parte) => {
      if (parte.includes('<br>')) {
        const partesSplit = parte.split('<br>')

        tore.push(
          new HtmlAcordeConBr(
            this.getAcorde(acordes, cont),
            partesSplit[0].length,
            partesSplit[partesSplit.length - 1].length,
            partesSplit.length - 1,
            cont,
          ),
        )
      } else {
        tore.push(
          new HtmlAcordeSimple(
            this.getAcorde(acordes, cont),
            parte.length,
            cont,
          ),
        )
      }
      cont++
    })
    return tore
  }

  static htmlAstring(html: HtmlAcorde[]): string {
    let tore = ''
    html.forEach((element) => {
      tore += element.renderizar()
    })
    return tore
  }

  static ArmarFondoEditarAcordes(
    textoCancion: string,
    cancion: Cancion,
  ): string {
    return this.htmlAstring(this.textoAobjetoshtml(textoCancion, cancion))
  }
}
