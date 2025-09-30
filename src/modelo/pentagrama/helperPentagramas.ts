import type { Cancion } from '../cancion/cancion'
import { DisplayAcordesPentagrama } from './DisplayAcordesPentagrama'
import { DisplayNotaPentagrama } from './DisplayNotapentagrama'
import { Pentagrama } from '../cancion/pentagrama'
import { PentagramaCompas } from '../cancion/pentagramacompas'
import { DisplayPentagrama } from './displayPentagrama'
import { EstiloEditandoCompas } from './EstiloEditandoCompas'
import { DisplayCompasPentagrama } from './DisplayCompasPentagrama'
import { DisplayModoPentagrama } from './displayModoPentagrama'

export class HelperPentagramas {
  public creaPentagrama(
    cancion: Cancion,
    estiloAcorde: EstiloEditandoCompas,
    octava: number,
    esBateria: boolean,
  ): Pentagrama {
    const pentagrama = new Pentagrama()
    pentagrama.instrumento = '1'
    const acordes = cancion.acordes.GetTodosLosAcordes()
    for (const acorde of acordes) {
      pentagrama.compases.push(
        estiloAcorde.GetCompas(acorde, octava, esBateria),
      )
    }
    return pentagrama
  }
  public GetModos(cancion: Cancion): DisplayModoPentagrama[] {
    const modos: DisplayModoPentagrama[] = []
    const instumentos = [
      ...new Set(cancion.pentagramas.map((p) => p.nombre || 'noname')),
    ]
    for (const pentagrama of instumentos) {
      modos.push(new DisplayModoPentagrama(pentagrama, false))
    }
    cancion.pentagramas.map((p) => {
      const modoExistente = modos.find((m) => m.Nombre === p.nombre)
      if (modoExistente) {
        modoExistente.Instrumento = p.instrumento
        modoExistente.Claves.push(p.clave)
      }
    })
    return modos
  }
  public creaDisplayPentagrama(
    cancion: Cancion,
    modos: DisplayModoPentagrama[],
  ): DisplayPentagrama {
    const display = new DisplayPentagrama()
    const pentagramas = cancion.pentagramas
    if (pentagramas.length === 0) {
      return display
    }
    const instOk = modos.filter((m) => m.Ver).map((m) => m.Nombre)
    for (let conPenta = 0; conPenta < cancion.pentagramas.length; conPenta++) {
      if (instOk.includes(cancion.pentagramas[conPenta].nombre)) {
        display.AgregarPartitura(cancion.pentagramas[conPenta], cancion.escala)
      }
    }
    return display
  }

  static notas: string[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  static mapaDuraciones: Record<string, string[]> = {
    C: ['', '', '', '', '', '', '', ''],
    G: ['', '', '', '#', '', '', '', ''],
    D: ['#', '', '', '#', '', '', '', ''],
    A: ['#', '', '', '#', '#', '', '', ''],
    E: ['#', '#', '', '#', '#', '', '', ''],
    B: ['#', '#', '', '#', '#', '#', '', ''],
    'F#': ['#', '#', '', '#', '#', '#', '#', ''],
    'C#': ['#', '#', '#', '#', '#', '#', '#', ''],
    F: ['', '', '', '', '', '', 'b', ''],
    Bb: ['', '', '', '', 'b', '', 'b', ''],
    Eb: ['', '', 'b', '', 'b', '', 'b', ''],
    Ab: ['', 'b', 'b', '', 'b', '', 'b', ''],
    Db: ['b', 'b', 'b', '', 'b', '', 'b', ''],
    Gb: ['b', 'b', 'b', 'b', 'b', '', 'b', ''],
    Cb: ['b', 'b', 'b', 'b', 'b', 'b', 'b', ''],
    Am: ['', '', '', '', '', '', '', ''],
    Em: ['', '', '', '#', '', '', '', ''],
    Bm: ['#', '', '', '#', '', '', '', ''],
    'F#m': ['#', '#', '', '#', '', '', '', ''],
    'C#m': ['#', '#', '', '#', '#', '', '', ''],
    'G#m': ['#', '#', '#', '#', '#', '', '', ''],
    'D#m': ['#', '#', '#', '#', '#', '#', '', ''],
    'A#m': ['#', '#', '#', '#', '#', '#', '#', ''],
    Dm: ['', '', '', '', '', '', 'b', ''],
    Gm: ['', '', '', '', 'b', '', 'b', ''],
    Cm: ['', '', 'b', '', 'b', '', 'b', ''],
    Fm: ['', 'b', 'b', '', 'b', '', 'b', ''],
    Bbm: ['b', 'b', 'b', '', 'b', '', 'b', ''],
    Ebm: ['b', 'b', 'b', 'b', 'b', '', 'b', ''],
    Abm: ['b', 'b', 'b', 'b', 'b', 'b', 'b', ''],
    'A#': ['', '', '', '', 'b', '', 'b', ''],
    'D#': ['', '', 'b', '', 'b', '', 'b', ''],
    'G#': ['', 'b', 'b', '', 'b', '', 'b', ''],
  }

  public creaCompasPentagrama(
    pentagrama: Pentagrama,
    nroCompas: number,
    escala: string,
  ): DisplayCompasPentagrama {
    // Remove any numbers from the escala
    const escalaLimpia = escala.replace(/\d+/g, '').replace('maj', '')
    const pentagramaCompas = pentagrama.compases[nroCompas] as PentagramaCompas

    const mapa = HelperPentagramas.mapaDuraciones[escalaLimpia]
    const compas = new DisplayCompasPentagrama(nroCompas)
    compas.beams = pentagramaCompas.beams
    compas.ligaduras = pentagramaCompas.ligaduras
    for (let i = 0; i < pentagramaCompas.notas.length; i++) {
      const nuevoAcorde = new DisplayAcordesPentagrama()
      for (const nota of pentagramaCompas.notas[i]) {
        let notaOk = nota.nota
        let octava = 4
        nuevoAcorde.duracion = nota.duracion.toString()

        // Check if the note ends with a number
        const match = notaOk.match(/(\D+)(\d+)$/)
        if (match) {
          // Extract the note name and octave
          notaOk = match[1]
          octava = parseInt(match[2])
        }
        const notaDisplay = new DisplayNotaPentagrama(notaOk, octava)
        const notaSola = notaOk.substring(0, 1)
        const modificador = notaOk.substring(1)
        const indice = HelperPentagramas.notas.indexOf(notaSola)
        if (mapa[indice] !== modificador) {
          notaDisplay.modificador = modificador
        }
        nuevoAcorde.Notas.push(notaDisplay)
      }
      compas.acordes.push(nuevoAcorde)
    }
    if (pentagramaCompas.notas.length === 0) {
      const nuevoAcorde = new DisplayAcordesPentagrama()
      nuevoAcorde.duracion = '1r'

      nuevoAcorde.Notas.push(
        new DisplayNotaPentagrama('C', pentagrama.clave === 'bass' ? 3 : 5),
      )
      compas.acordes.push(nuevoAcorde)
    }
    return compas
  }
}
