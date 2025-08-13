import type { Cancion } from '../../modelo/cancion/cancion'
import { SeparadorSilabas } from '../../modelo/cancion/SeparadorSilabas'
import { BuildFondo } from './buildFondo'

export class BuildFondoMetricaES extends BuildFondo {
  override build(_cancion: Cancion, textoCancion: string): string {
    const renglones = textoCancion.split('<br>')
    let ret = ''
    for (const renglon of renglones) {
      const palabras = renglon.split(' ')
      for (const palabra of palabras) {
        if (ret != '') {
          ret += '&nbsp;'
        }
        ret += '<span>'
        const sepSilabas = new SeparadorSilabas()
        const silabasPalabra = sepSilabas.getSilabas(palabra)
        for (let i = 0; i < silabasPalabra.silabas.length; i++) {
          ret += silabasPalabra.silabas[i].silaba + ' '
        }
        ret += '</span>'
      }
      ret += '<br>'
    }
    return ret
  }
}
