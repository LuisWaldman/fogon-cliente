import type { Cancion } from '../../modelo/cancion/cancion'

export abstract class BuildFondo {
  abstract build(cancion: Cancion, textoCancion: string): string
  static hacerTexto(cancion: Cancion): string {
    return cancion.letras.renglones.flat().join('|').replace('/n', '/n')
  }

  textoRenglones(texto: string): string[][] {
    return texto.split('<br>').map((renglon) => {
      return renglon.split('|')
    })
  }
}
