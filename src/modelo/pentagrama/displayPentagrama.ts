import { Pentagrama } from '../cancion/pentagrama'
import { PentagramaCompas } from '../cancion/pentagramacompas'
import { DisplayAcordesPentagrama } from './DisplayAcordesPentagrama'
import { DisplayCompasPentagrama } from './DisplayCompasPentagrama'
import { DisplayInstrumentoPentagrama } from './DisplayInstrumentoPentagrama'
import { DisplayNotaPentagrama } from './DisplayNotapentagrama'
import { DisplaySistemaPentagrama } from './DisplaySistemaPentagrama'

export class DisplayPentagrama {
  public renglones: DisplaySistemaPentagrama[] = []
  public creaCompasPentagrama(
    pentagramaCompas: PentagramaCompas,
  ): DisplayCompasPentagrama {
    const compas = new DisplayCompasPentagrama()
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

  GetSistema(idsistema: number): DisplaySistemaPentagrama {
    if (this.renglones.length <= idsistema) {
      this.renglones.push(new DisplaySistemaPentagrama())
    }
    return this.renglones[idsistema]
  }

  AgregarPartitura(pentagrama: Pentagrama) {
    let sistema = 0
    let renglon = this.GetSistema(sistema)
    let nInstru = new DisplayInstrumentoPentagrama([], pentagrama.clave)
    renglon.pentagramas.push(nInstru)

    for (let i = 0; i < pentagrama.compases.length; i++) {
      const compPenta = this.creaCompasPentagrama(pentagrama.compases[i])
      nInstru.compases.push(compPenta)

      if (i > 0 && (i + 1) % 4 === 0) {
        sistema++
        renglon = this.GetSistema(sistema)
        renglon.pentagramas.push(nInstru)
        nInstru = new DisplayInstrumentoPentagrama([], pentagrama.clave)
      }
    }
    if (nInstru.compases.length > 0) {
      sistema++
      renglon = this.GetSistema(sistema)
      renglon.pentagramas.push(nInstru)
    }
  }
}
