import type { Cancion } from '../cancion/cancion'
import { MusicaHelper } from '../cancion/MusicaHelper'
import { DisplayCompasPentagrama } from './DisplayCompasPentagrama'
import { DisplayPentagrama } from './DisplayPentagrama'
import { DisplayNotaPentagrama } from './DisplayNotapentagrama'
import { DisplayClavePentagrama } from './DisplayClavePentagrama'
import { DisplayRenglonPentagrama } from './DisplayRenglonPentagrama'
import { Pentagrama } from '../cancion/pentagrama'
import { PentagramaCompas } from '../cancion/pentagramacompas'
import { PentagramaNotas } from '../cancion/pentagramanotas'

export class HelperPentagramas {
  private musica = new MusicaHelper()
  public creaPentagrama(cancion: Cancion): Pentagrama {
    const pentagrama = new Pentagrama()
    const acordes = cancion.acordes.GetTodosLosAcordes()
    for (const acorde of acordes) {
      const nuevoCompas = new PentagramaCompas()

      let acoPost = acorde
      if (acorde.includes(' ')) {
        acoPost = acorde.split(' ')[0]
      }
      const notas = this.musica.GetNotasdeacorde(acoPost).map((nota) => {
        return nota + '4'
      })
      nuevoCompas.acordes.push(new PentagramaNotas(notas, 1))

      pentagrama.compases.push(nuevoCompas)
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
    let nuevorenglon = new DisplayRenglonPentagrama()
    nuevorenglon.pentagramas.push(new DisplayClavePentagrama())
    for (let i = 0; i < pentagrama.compases.length; i++) {
      const compPenta = this.creaCompasPentagrama(pentagrama.compases[i])
      nuevorenglon.pentagramas[0].compases.push(compPenta)

      if (i > 0 && i % 3 === 0) {
        display.renglones.push(nuevorenglon)
        nuevorenglon = new DisplayRenglonPentagrama()
        nuevorenglon.pentagramas.push(new DisplayClavePentagrama())
      }
    }

    //display.renglones.push(nuevorenglon)
    return display
  }

  public creaCompasPentagrama(
    pentagramaCompas: PentagramaCompas,
  ): DisplayCompasPentagrama {
    const compas = new DisplayCompasPentagrama()
    for (let i = 0; i < pentagramaCompas.acordes.length; i++) {
      for (const nota of pentagramaCompas.acordes[i].notas) {
        let notaOk = nota
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
