import type { Cancion } from '../../modelo/cancion'

export abstract class BuildFondo {
  abstract build(cancion: Cancion, textoCancion: string): string
}

export class BuildFondoAcordes extends BuildFondo {
  override build(cancion: Cancion, textoCancion: string): string {
    const renglones = textoCancion.split('<br>')
    let ret = ''
    for (const renglon of renglones) {
      ret += renglon.replace(/\[([^\]]+)\]/g, '').trim() + '<br>'
      //ret += 'ACORDES' + '<br>'
    }
    return ret
  }
}

export class BuildFondoMetricaES extends BuildFondo {
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
