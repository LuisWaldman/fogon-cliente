import { AnalisisArmonico } from './analisisArmonico'
import type { Cancion } from './cancion'

export class MusicaHelper {
  ActualizarEscala(
    cancion: Cancion,
    desdeEscala: string[],
    hastaEscala: string[],
  ): Cancion {
    cancion.escala = hastaEscala[0]
    for (let i = 0; i < cancion.acordes.partes.length; i++) {
      for (let j = 0; j < cancion.acordes.partes[i].acordes.length; j++) {
        cancion.acordes.partes[i].acordes[j] = this.GetAcordesNuevaEscala(
          cancion.acordes.partes[i].acordes[j],
          desdeEscala,
          hastaEscala,
        )
      }
    }
    return cancion
  }
  GetNotasPosicionadasNuevaEscala(
    desdePosiciones: string[][],
    desdeEscala: string[],
    hastaEscala: string[],
  ): string[][] {
    const toRet: string[][] = []
    for (let i = 0; i < desdePosiciones.length; i++) {
      toRet[i] = []
      for (let j = 0; j < desdePosiciones[i].length; j++) {
        toRet[i][j] = this.GetNotaNuevaEscala(
          desdePosiciones[i][j],
          desdeEscala,
          hastaEscala,
        )
      }
    }
    return toRet
  }

  GetAcordesNuevaEscala(
    nota: string,
    desdeEscala: string[],
    hastaEscala: string[],
  ): string {
    return nota
      .split(' ')
      .map((acorde) => {
        return this.GetNotaNuevaEscala(acorde, desdeEscala, hastaEscala)
      })
      .join(' ')
  }

  GetNotaNuevaEscala(
    nota: string,
    desdeEscala: string[],
    hastaEscala: string[],
  ): string {
    let notAlt = nota
    let bajoNota = ''
    if (notAlt.includes('/')) {
      notAlt = notAlt.split('/')[0] // Si es un acorde con alteración, tomamos solo la parte antes de la barra
      bajoNota = this.GetNotaNuevaEscala(
        nota.split('/')[1],
        desdeEscala,
        hastaEscala,
      )
    }

    // MODIFICA LAS QUE TIENEN NUMERO
    const numMatch = nota.match(/[0-9]+/)?.[0] || ''
    notAlt = notAlt.replace(numMatch, '')
    const toRetEscala = desdeEscala.indexOf(notAlt)
    if (toRetEscala !== -1) {
      return (
        hastaEscala[toRetEscala] + numMatch + (bajoNota ? `/${bajoNota}` : '')
      )
    }
    // Check if notAlt starts with any note in desdeEscala
    let i = 0
    while (i < notAlt.length && toRetEscala === -1) {
      const partialNote = notAlt.substring(0, notAlt.length - i)
      for (let j = 0; j < desdeEscala.length; j++) {
        if (desdeEscala[j].startsWith(partialNote)) {
          const suffix = notAlt.substring(partialNote.length)
          return (
            hastaEscala[j] +
            suffix +
            numMatch +
            (bajoNota ? `/${bajoNota}` : '')
          )
        }
      }
      i++
    }
    return '?' + bajoNota ? `/${bajoNota}` : ''
  }

  GetNotasPosicionadasEscala(cancion: Cancion, escala: string[]): string[][] {
    const acordesRaw: string[] = cancion.acordes.GetTodosLosAcordes()

    const notasUnicas: Set<string> = new Set<string>()
    acordesRaw.forEach((notasCompas) => {
      notasCompas.split(' ').forEach((nota) => {
        if (nota.trim() !== '') {
          notasUnicas.add(nota)
        }
      })
    })

    const notas: string[] = Array.from(notasUnicas)

    const notasPosicionadas: string[][] = [[], [], [], [], [], [], [], []]
    notas.forEach((nota) => {
      const posicion = this.PosicionNotaEnEscala(escala, nota)
      if (posicion !== -1) {
        notasPosicionadas[posicion].push(nota)
      } else {
        notasPosicionadas[7].push(nota) // Si no está en la escala, lo ponemos en la última posición
      }
    })

    return notasPosicionadas
  }
  PosicionNotaEnEscala(escala: string[], nota: string) {
    let notAlt = nota
    if (notAlt.includes('/')) {
      notAlt = notAlt.split('/')[0] // Si es un acorde con alteración, tomamos solo la parte antes de la barra
    }
    notAlt = notAlt.replace(/[0-9]/g, '') // Eliminar números de la nota
    const toRet = escala.indexOf(notAlt)
    if (toRet === -1) {
      for (let i = 0; i < escala.length; i++) {
        if (escala[i].startsWith(notAlt[0])) {
          return i // Si no está en la escala, buscamos una coincidencia parcial
        }
      }
    }
    return toRet
  }
  getDistanciaNotas(nota1: string, nota2: string, escala: string): number {
    const acoresEscala = this.GetNotasdeescala(escala)

    let octavaNota1 = 0

    if (!isNaN(parseInt(nota1.slice(-1)))) {
      octavaNota1 = parseInt(nota1.slice(-1))
    }

    let octavaNota2 = 0
    if (!isNaN(parseInt(nota2.slice(-1)))) {
      octavaNota2 = parseInt(nota2.slice(-1))
    }

    const notaNombre1 = nota1.replace(/[0-9]/g, '')
    const notaNombre2 = nota2.replace(/[0-9]/g, '')
    const nroNota1 = acoresEscala.indexOf(notaNombre1)
    const nroNota2 = acoresEscala.indexOf(notaNombre2)

    const distancia = nroNota1 - nroNota2 + (octavaNota1 - octavaNota2) * 7
    return distancia
  }

  getAnalisis(nota: string, acoresEscala: string[]): AnalisisArmonico {
    let notaSinAlteracion: string = nota
    let alteracion: string = ''
    const alteraciones = ['4', '5', '6', '7', '9', '11', '13']
    for (let i = 0; i < alteraciones.length; i++) {
      if (notaSinAlteracion.includes(alteraciones[i])) {
        notaSinAlteracion = notaSinAlteracion.replace(alteraciones[i], '')
        alteracion = alteraciones[i]
      }
    }

    for (let i = 0; i < acoresEscala.length; i++) {
      if (acoresEscala[i] == notaSinAlteracion) {
        return new AnalisisArmonico(true, i + 1, alteracion, nota)
      }
    }
    return new AnalisisArmonico(false, -1, '', nota)
  }

  notas: string[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ]

  GetNotas() {
    return this.notas
  }
  modos: { [key: string]: number[] } = {}
  modosParaacorde: { [key: string]: string[] } = {}
  constructor() {
    this.modos['mayor'] = [2, 2, 1, 2, 2, 2]
    this.modos['menor'] = [2, 1, 2, 2, 1, 2]
    this.modosParaacorde['mayor'] = ['', 'm', 'm', '', '', 'm', 'dim']
    this.modosParaacorde['menor'] = ['m', 'dim', '', 'm', 'm', '', '']
  }

  // Devuelve el numero de nota
  numeroNota(nota: string): number {
    return this.notas.indexOf(nota)
  }
  // Devuelve el numero de nota
  nombreNota(nota: number): string {
    return this.notas[nota]
  }

  public GetNotasdeescala(escala: string | undefined): string[] {
    if (escala == undefined) return []
    if (escala == '') return []
    let buscar = escala
    let modoEscala = 'mayor'
    if (escala.includes('m')) {
      buscar = buscar.replace('m', '')
      modoEscala = 'menor'
    }

    let notaInd = this.numeroNota(buscar)
    const modoSusecion: number[] = this.modos[modoEscala]
    const modoParaacorde: string[] = this.modosParaacorde[modoEscala]

    const acordes = [this.notas[notaInd] + modoParaacorde[0]]
    for (let i = 0; i < modoSusecion.length; i++) {
      notaInd += modoSusecion[i]
      acordes.push(this.notas[notaInd % this.notas.length])
    }

    return acordes
  }

  GetAcordesdeescala(escala: string) {
    if (escala == '') return []
    if (escala == undefined) return []
    let buscar = escala
    let modoEscala = 'mayor'
    if (escala.includes('m')) {
      buscar = buscar.replace('m', '')
      modoEscala = 'menor'
    }

    let notaInd = this.numeroNota(buscar)
    const modoSusecion: number[] = this.modos[modoEscala]
    const modoParaacorde: string[] = this.modosParaacorde[modoEscala]

    const acordes = [this.notas[notaInd] + modoParaacorde[0]]
    for (let i = 0; i < modoSusecion.length; i++) {
      notaInd += modoSusecion[i]
      acordes.push(
        this.notas[notaInd % this.notas.length] + modoParaacorde[i + 1],
      )
    }

    return acordes
  }

  esMenor(nota1: string, nota2: string) {
    const nroNota1 = this.numeroNota(nota1)
    const nroNota2 = this.numeroNota(nota2)
    console.log('Emenor', nroNota1, nroNota2)
    if (nroNota1 < nroNota2) {
      return true
    }
    return false
  }
  getNotasdeacorde(acorde: string, escala: string = ''): string[] {
    const toRet: string[] = []
    const notas = this.GetNotasdeescala(acorde)
    let escaPut = escala
    toRet.push(notas[0] + escaPut)
    if (this.esMenor(notas[2], notas[0])) {
      console.log(escaPut, escala, notas[2], notas[0])
      escaPut = (parseInt(escaPut) + 1).toString()
      console.log(escaPut, escala)
    }
    toRet.push(notas[2] + escaPut)
    if (this.esMenor(notas[4], notas[0]) && escaPut == escala) {
      escaPut = (parseInt(escaPut) + 1).toString()
    }
    toRet.push(notas[4] + escaPut)

    return toRet
  }
}
