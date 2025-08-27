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
  ): Pentagrama {
    const pentagrama = new Pentagrama()
    pentagrama.instrumento = '1'
    const acordes = cancion.acordes.GetTodosLosAcordes()
    for (const acorde of acordes) {
      pentagrama.compases.push(estiloAcorde.GetCompas(acorde, octava))
    }
    return pentagrama
  }
  public GetModos(cancion: Cancion): DisplayModoPentagrama[] {
    const modos: DisplayModoPentagrama[] = []
    const instumentos = [
      ...new Set(cancion.pentagramas.map((p) => p.instrumento)),
    ]
    for (const pentagrama of instumentos) {
      modos.push(new DisplayModoPentagrama(pentagrama, true))
    }
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
    const instOk = modos.filter((m) => m.Ver).map((m) => m.Instrumento)
    for (let conPenta = 0; conPenta < cancion.pentagramas.length; conPenta++) {
      if (instOk.includes(cancion.pentagramas[conPenta].instrumento)) {
        display.AgregarPartitura(cancion.pentagramas[conPenta])
      }
    }
    return display
  }

  public creaCompasPentagrama(
    pentagramaCompas: PentagramaCompas,
    nroCompas: number,
  ): DisplayCompasPentagrama {
    const compas = new DisplayCompasPentagrama(nroCompas)
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
        nuevoAcorde.Notas.push(new DisplayNotaPentagrama(notaOk, octava))
      }
      compas.acordes.push(nuevoAcorde)
    }
    return compas
  }
}
