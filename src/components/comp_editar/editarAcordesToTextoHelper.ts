import { Acordes, Parte } from '../../modelo/cancion/acordes'

export class EditarAcordesToTextoHelper {
  static acordesToTexto(acordes: Acordes): string {
    let texto = ''
    const retornoCarro = '\n'
    const partesMostradas = new Set<number>()
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
          texto += retornoCarro
        }
        texto += `'${parte.nombre}'`
        if (!partesMostradas.has(indice)) {
          texto += parte.acordes.join('|')
          partesMostradas.add(indice)
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
  public ordenPartes: number[] = []

  parteLinea(parte: Parte): string {
    return `'${parte.nombre}'${parte.acordes.join('|')}`
  }

  private indiceNombres: number = 1
  asignarNombre(nombre: string): string {
    if (nombre === '') {
      nombre = `v${this.indiceNombres}`
      this.indiceNombres++
    }
    return nombre
  }
  agregarPartetexto(texto: string): number[] {
    const parte: Parte = new Parte('', [])
    const ret: number[] = []
    let indice = -1
    let multiplicador = 1
    if (texto.includes('*')) {
      multiplicador = parseInt(texto.split('*')[1])
      texto = texto.split('*')[0].trim()
    }
    texto = texto.trim()
    let nombreParte = ''
    if (texto.startsWith("'")) {
      const finNombre = texto.indexOf("'", 1)
      if (finNombre > 0) {
        nombreParte = texto.substring(1, finNombre)
        texto = texto.substring(finNombre + 1).trim()
      }
    }
    const acordes = texto
      .split('|')
      .map((acorde) => acorde.trim())
      .filter((acorde) => acorde !== '')

    const existente = this.partes.findIndex((p) => p.nombre === nombreParte)
    if (existente === -1) {
      parte.nombre = this.asignarNombre(nombreParte)
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

  textoToAcordes(texto: string): Acordes {
    if (texto === '') {
      return new Acordes([new Parte('vacio', [])], [0])
    }
    const partesTexto = texto.split('\n')
    partesTexto.forEach((parteTexto) => {
      const indices = this.agregarPartetexto(parteTexto)
      this.ordenPartes.push(...indices)
    })
    return new Acordes(this.partes, this.ordenPartes)
  }
}
