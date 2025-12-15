import type { textoResumen } from '../textoResumen'

export class AnalizadorSonteto {
  static metricaMas(texto: textoResumen) {
    let ret = ''
    if (texto.silabas.length === 1) {
      if (texto.silabas[0].base === 11) {
        ret = '+'
        if (texto.silabas[0].diferencia === 0) {
          ret += '+'
        }
      }
    }
    return ret
  }
  static GetTipo(texto: textoResumen): string {
    if (texto.versos === 14 && texto.silabas.length === 1) {
      const rimassonteto = ['ABBAABBACDCDEE', 'ABBAABBACDCDCD']
      const rimasActual = texto.renglones.map((r) => r.LetraRima).join('')
      if (rimassonteto.includes(rimasActual)) {
        return 'Soneto+' + this.metricaMas(texto)
      }
      const rimassonteto11 = ['ABABCDCDEFFEGG', 'ABABCDCDEFEFGG']
      if (rimassonteto11.includes(rimasActual)) {
        return 'Soneto' + this.metricaMas(texto)
      }
    }

    return ''
  }
}
