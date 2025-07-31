import { Acordes, Parte } from '../../modelo/acordes'
import { Cancion } from '../../modelo/cancion'

export class EditarAcordesToTextoHelper {
  static acordes_to_texto(acordes: Acordes): string {
    let texto = ''
    const retorno_carro = '\n'
    const partes_mostradas = new Set<number>()
    let repite = 0
    let ultima = -1

    acordes.ordenPartes.forEach((indice, i) => {
      const parte = acordes.partes[indice]
      if (ultima != indice) {
        if (repite > 0) {
          texto += `*${repite + 1}`
          repite = 0
        }
        if (i > 0) {
          texto += retorno_carro
        }
        texto += `'${parte.nombre}'`
        if (!partes_mostradas.has(indice)) {
          texto += parte.acordes.join('|')
          partes_mostradas.add(indice)
        }
      } else {
        repite++
      }
      ultima = indice
    })

    if (repite > 0) {
      texto += `*${repite + 1}`
      repite = 0
    }

    return texto
  }

  public partes: Parte[] = []
  public orden_partes: number[] = []

  parte_linea(parte: Parte): string {
    return `'${parte.nombre}'${parte.acordes.join('|')}`
  }

  private indice_nombres: number = 1
  asignar_nombre(nombre: string): string {
    if (nombre === '') {
      nombre = `v${this.indice_nombres}`
      this.indice_nombres++
    }
    return nombre
  }
  agregar_partetexto(texto: string): number[] {
    const parte: Parte = new Parte('', [])
    const ret: number[] = []
    let indice = -1
    let multiplicador = 1
    if (texto.includes('*')) {
      multiplicador = parseInt(texto.split('*')[1])
      texto = texto.split('*')[0].trim()
    }
    texto = texto.trim()
    let nombre_parte = ''
    if (texto.startsWith("'")) {
      const fin_nombre = texto.indexOf("'", 1)
      if (fin_nombre > 0) {
        nombre_parte = texto.substring(1, fin_nombre)
        texto = texto.substring(fin_nombre + 1).trim()
      }
    }
    const acordes = texto
      .split('|')
      .map((acorde) => acorde.trim())
      .filter((acorde) => acorde !== '')

    const existente = this.partes.findIndex((p) => p.nombre === nombre_parte)
    if (existente === -1) {
      parte.nombre = this.asignar_nombre(nombre_parte)
      parte.acordes = acordes
      this.partes.push(parte)
      indice = this.partes.length - 1
    } else {
      indice = existente
    }
    for (let i = 0; i < multiplicador; i++) {
      ret.push(indice)
    }
    return ret
  }

  texto_to_acordes(texto: string): Acordes {
    if (texto === '') {
      return new Acordes([new Parte('vacio', [])], [0])
    }
    const partes_texto = texto.split('\n')
    partes_texto.forEach((parte_texto) => {
      const indices = this.agregar_partetexto(parte_texto)
      this.orden_partes.push(...indices)
    })
    return new Acordes(this.partes, this.orden_partes)
  }
}
