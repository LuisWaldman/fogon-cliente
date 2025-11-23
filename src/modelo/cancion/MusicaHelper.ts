import { AnalisisArmonico } from './analisisArmonico'
import type { Cancion } from './cancion'
type Acorde = {
  nombre: string // Ej: "Cmaj7"
  fundamental: string // Ej: "C"
  bajo: string // Ej: "E" si es inversión
  intervalos: number[] // Ej: [0, 4, 7, 11]
  tipo: string // Ej: "maj7", "m", "dim", etc.
  notas: string[] // Ej: ["C", "E", "G", "B"]
}

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

  GetAcordeDeNotas(nota: string, otrasnotas: string[]): Acorde {
    const notaBase = nota.replace(/[0-9]/g, '')
    const todasNotas = [
      notaBase,
      ...otrasnotas.map((n) => n.replace(/[0-9]/g, '')),
    ]

    const nroNotas = todasNotas.map((n) => this.notas.indexOf(n))
    const nroBase = nroNotas[0]

    // Intervalos relativos al bajo
    const intervalos = nroNotas
      .map((n) => (n - nroBase + 12) % 12)
      .sort((a, b) => a - b)

    const acordes: { tipo: string; estructura: number[] }[] = [
      { tipo: 'add9', estructura: [0, 4, 7, 2] }, // C + E + G + D
      { tipo: 'add11', estructura: [0, 4, 7, 5] }, // C + E + G + F
      { tipo: '6', estructura: [0, 4, 7, 9] }, // C + E + G + A
      { tipo: 'maj7', estructura: [0, 4, 7, 11] },
      { tipo: '7', estructura: [0, 4, 7, 10] },
      { tipo: 'm7', estructura: [0, 3, 7, 10] },
      { tipo: 'm', estructura: [0, 3, 7] },
      { tipo: '', estructura: [0, 4, 7] },
      { tipo: 'dim', estructura: [0, 3, 6] },
      { tipo: 'aug', estructura: [0, 4, 8] },
      { tipo: 'sus2', estructura: [0, 2, 7] },
      { tipo: 'sus4', estructura: [0, 5, 7] },
      { tipo: '5', estructura: [0, 7] },
    ]

    for (const { tipo, estructura } of acordes) {
      const estructuraReducida = estructura
        .map((i) => i % 12)
        .sort((a, b) => a - b)
      const coincide = estructuraReducida.every((i) => intervalos.includes(i))
      if (coincide) {
        return {
          nombre: notaBase + tipo,
          fundamental: notaBase,
          bajo: todasNotas[0],
          intervalos,
          tipo,
          notas: todasNotas,
        }
      }
    }

    return {
      nombre: notaBase,
      fundamental: notaBase,
      bajo: todasNotas[0],
      intervalos,
      tipo: 'desconocido',
      notas: todasNotas,
    }
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

  public LimpiarAcordes(aco1: string): string {
    // Remove numbers and "m" from the chord
    return aco1.replace(/[0-9m]/g, '')
  }
  public DistanciaAcordes(aco1: string, aco2: string): number {
    const limpio1 = this.LimpiarAcordes(aco1)
    const limpio2 = this.LimpiarAcordes(aco2)
    const index1 = this.notas.indexOf(limpio1)
    const index2 = this.notas.indexOf(limpio2)
    if (index1 === -1 || index2 === -1) {
      return 0
    }
    return index2 - index1
  }

  public NotaMasDiferencial(nota: string, diferencial: number): string {
    const notaSola = nota.substring(0, nota.length - 1)
    let octava = parseInt(nota.substring(nota.length - 1))
    let index = this.notas.indexOf(notaSola) + diferencial
    if (index < 0) {
      octava--
      index = this.notas.length + index
    }
    if (index > this.notas.length - 1) {
      octava++
      index = index - this.notas.length
    }
    return this.notas[index] + octava
  }

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
    const index = this.notas.indexOf(nota)
    if (index !== -1) return index

    // Si no se encuentra, buscar equivalencia enarmónica
    const equivalenciasBemolSostenido: { [key: string]: string } = {
      Db: 'C#',
      Eb: 'D#',
      Gb: 'F#',
      Ab: 'G#',
      Bb: 'A#',
    }

    const equivalente = equivalenciasBemolSostenido[nota]
    if (equivalente) {
      return this.notas.indexOf(equivalente)
    }

    return -1
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
    if (notaInd < 0) {
      return []
    }
    const modoSusecion: number[] = this.modos[modoEscala]
    const acordes = [this.notas[notaInd]]
    for (let i = 0; i < modoSusecion.length; i++) {
      notaInd += modoSusecion[i]
      acordes.push(this.notas[notaInd % this.notas.length])
    }
    return acordes
  }

  // Prepara a un acorde para ser usado en una escala, quitandole numeros y dim
  GetEscalaDelAcorde(acorde: string) {
    let acordeBase = acorde
    // Remove slash notation if present

    if (acorde.includes(' ')) {
      acordeBase = acorde.split(' ')[0]
    }

    if (acorde.includes('/')) {
      acordeBase = acorde.split('/')[0]
    }

    // Remove all numbers from the chord
    acordeBase = acordeBase.replace(/[0-9]/g, '')

    return this.GetNotasdeescala(acordeBase)
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

    return corregirBemoles(acordes)
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
  GetNotasdeacorde(acorde: string, octava: number): string[] {
    const toRet: string[] = []
    let acordeBase = acorde
    let tiene5 = false
    let tiene6 = false
    let tiene7 = false
    let tiene4 = false
    let tiene9 = false
    if (acorde.includes('/')) {
      acordeBase = acorde.split('/')[0]
    }

    if (acorde.includes('4')) {
      acordeBase = acordeBase.replace('4', '')
      tiene4 = true
    }
    if (acorde.includes('9')) {
      acordeBase = acordeBase.replace('9', '')
      tiene9 = true
    }
    if (acorde.includes('5')) {
      acordeBase = acordeBase.replace('5', '')
      tiene5 = true
    }

    if (acorde.includes('6')) {
      acordeBase = acordeBase.replace('6', '')
      tiene6 = true
    }
    if (acorde.includes('7')) {
      acordeBase = acordeBase.replace('7', '')
      tiene7 = true
    }
    const notas = this.GetNotasdeescala(acordeBase)
    if (notas.length == 0) return toRet
    const nronota = this.notas.indexOf(notas[0])
    let octavaActual = octava.toString()
    toRet.push(notas[0] + octavaActual)

    if (!tiene5) {
      if (this.notas.indexOf(notas[2]) < nronota) {
        octavaActual = (octava + 1).toString()
      }
      toRet.push(notas[2] + octavaActual)
    }
    if (tiene4) {
      if (this.notas.indexOf(notas[3]) < nronota) {
        octavaActual = (octava + 1).toString()
      }
      toRet.push(notas[3] + octavaActual)
    }
    if (this.notas.indexOf(notas[4]) < nronota) {
      octavaActual = (octava + 1).toString()
    }
    toRet.push(notas[4] + octavaActual)

    if (tiene6) {
      if (this.notas.indexOf(notas[5]) < nronota) {
        octavaActual = (octava + 1).toString()
      }
      toRet.push(notas[5] + octavaActual)
    }

    if (tiene7) {
      if (this.notas.indexOf(notas[6]) < nronota) {
        octavaActual = (octava + 1).toString()
      }
      toRet.push(notas[6] + octavaActual)
    }

    if (tiene9) {
      if (this.notas.indexOf(notas[1]) < nronota) {
        octavaActual = (octava + 2).toString()
      } else {
        octavaActual = (octava + 1).toString()
      }
      toRet.push(notas[1] + octavaActual)
    }
    return toRet
  }
}

function corregirBemoles(acordes: string[]): string[] {
  // Mapeo de equivalencias enarmónicas sostenido -> bemol
  const equivalencias: { [key: string]: string } = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
  }

  // Solo escalas que TRADICIONALMENTE usan bemoles en notación musical estándar
  // Incluimos tanto la notación de bemoles como sus equivalencias enarmónicas
  const escalasBemoles = [
    'F',
    'Bb',
    'Eb',
    'Ab',
    'Db',
    'Gb',
    'D#',
    'G#',
    'C#',
    'A#',
  ]

  // También escalas menores que corresponden a escalas mayores de bemoles
  const escalasMenuoresBemoles = ['Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm']

  const primerAcorde = acordes[0] || ''
  const primeraNota = primerAcorde.replace(/[^A-G#b]/g, '') // Quitar sufijos como 'm', 'dim', etc.

  // Solo convertir si es una escala tradicional de bemoles o ya contiene bemoles
  if (
    escalasBemoles.includes(primeraNota) ||
    escalasMenuoresBemoles.includes(primerAcorde) ||
    primeraNota.includes('b')
  ) {
    return acordes.map((acorde) => {
      let resultado = acorde
      for (const [sostenido, bemol] of Object.entries(equivalencias)) {
        resultado = resultado.replace(sostenido, bemol)
      }
      return resultado
    })
  }

  return acordes
}
