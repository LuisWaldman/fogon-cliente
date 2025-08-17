import type { Cancion } from '../cancion/cancion'
import { Display } from './display'

/**
 * Helper class for creating display objects from song data.
 */
export class HelperDisplay {
  /**
   * Creates a Display object from a Cancion object.
   * @param cancion The song data to convert to a Display.
   * @returns A Display object representing the song.
   */
  public getDisplay(cancion: Cancion, anchoRenglones: number): Display {
    const ret = new Display(anchoRenglones)
    const acordes = cancion.acordes.GetTodosLosAcordes()
    const letra = cancion.letras.renglones
      .flat()
      .filter((acorde) => acorde !== undefined)
    // Initialize display content

    while (acordes.length < letra.length) {
      acordes.push('¿?')
    }
    while (letra.length < acordes.length) {
      letra.push('¿?')
    }
    let renglonLetras: string[] = []
    let renglonAcordes: string[] = []

    const allrenglonLetras: string[][] = []
    const allrenglonAcordes: string[][] = []
    // Agrego espacios si los acordes ocupan mas que la letra
    for (let i = 0; i < letra.length; i++) {
      console.log(`letra[${i}]: ${letra[i]}, acordes[${i}]: ${acordes[i]}`)
      if (acordes[i].length > letra[i].length) {
        if (
          acordes[i] !== '.' &&
          (letra[i].trim() === '' || letra[i] === undefined)
        ) {
          letra[i] = '♪'
        }
        const espacios = acordes[i].length - letra[i].length + 2
        if (espacios > 0) {
          letra[i] = '♪'.repeat(espacios)
        }
      }
    }
    for (let i = 0; i < letra.length; i++) {
      const parteletra = letra[i]
      if (parteletra.includes('/n')) {
        const partes = parteletra.split('/n')
        renglonLetras.push(partes[0])
        renglonAcordes.push(acordes[i])
        allrenglonLetras.push(renglonLetras)
        allrenglonAcordes.push(renglonAcordes)
        renglonAcordes = []
        renglonLetras = []
        renglonLetras.push(partes[1])
        renglonAcordes.push('')
      } else {
        renglonLetras.push(parteletra)
        renglonAcordes.push(acordes[i])
      }
    }
    allrenglonLetras.push(renglonLetras)
    allrenglonAcordes.push(renglonAcordes)
    ret.ArmarDisplay(allrenglonLetras, allrenglonAcordes)

    return ret
  }
}
