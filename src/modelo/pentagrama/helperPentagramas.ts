import type { Cancion } from '../cancion/cancion'
import { DisplayCompasPentagrama } from './DisplayCompasPentagrama'
import { DisplayNotaPentagrama } from './DisplayNotapentagrama'
import { DisplayInstrumentoPentagrama } from './DisplayClavePentagrama'
import { DisplaySistemaPentagrama } from './DisplaySistemaPentagrama'
import { Pentagrama } from '../cancion/pentagrama'
import { PentagramaCompas } from '../cancion/pentagramacompas'
import { DisplayPentagrama } from './displayPentagrama'
import { EstiloEditandoCompas } from './EstiloEditandoCompas'

export class HelperPentagramas {
  public creaPentagrama(
    cancion: Cancion,
    estiloAcorde: EstiloEditandoCompas,
  ): Pentagrama {
    const pentagrama = new Pentagrama()
    pentagrama.instrumento = 'Piano-izq'
    const acordes = cancion.acordes.GetTodosLosAcordes()
    for (const acorde of acordes) {
      pentagrama.compases.push(estiloAcorde.GetCompas(acorde))
    }
    return pentagrama
  }
  public creaDisplayPentagrama(cancion: Cancion): DisplayPentagrama {
    const display = new DisplayPentagrama()
    const pentagramas = cancion.pentagramas
    if (pentagramas.length === 0) {
      return display
    }
    const pentagrama = pentagramas[0]
    let nuevorenglon = new DisplaySistemaPentagrama()
    nuevorenglon.pentagramas.push(new DisplayInstrumentoPentagrama())
    for (let i = 0; i < pentagrama.compases.length; i++) {
      const compPenta = this.creaCompasPentagrama(pentagrama.compases[i])
      nuevorenglon.pentagramas[0].compases.push(compPenta)

      if (i > 0 && (i + 1) % 4 === 0) {
        display.renglones.push(nuevorenglon)
        nuevorenglon = new DisplaySistemaPentagrama()
        nuevorenglon.pentagramas.push(new DisplayInstrumentoPentagrama())
      }
    }
    if (nuevorenglon.pentagramas[0].compases.length > 0) {
      display.renglones.push(nuevorenglon)
    }
    return display
  }

  public creaCompasPentagrama(
    pentagramaCompas: PentagramaCompas,
  ): DisplayCompasPentagrama {
    const compas = new DisplayCompasPentagrama()
    compas.duracion = '1' // Default duration
    for (let i = 0; i < pentagramaCompas.notas.length; i++) {
      for (const nota of pentagramaCompas.notas[i]) {
        compas.duracion = nota.duracion // Set duration based on the last note
        console.log('ESTABLECE DURACION:', compas.duracion)
        let notaOk = nota.nota
        let octava = 4

        // Check if the note ends with a number
        const match = notaOk.match(/(\D+)(\d+)$/)
        if (match) {
          // Extract the note name and octave
          notaOk = match[1]
          octava = parseInt(match[2])
        }

        const notaPentagrama = new DisplayNotaPentagrama(notaOk, octava)
        compas.Notas.push(notaPentagrama)
      }
    }
    return compas
  }
}
