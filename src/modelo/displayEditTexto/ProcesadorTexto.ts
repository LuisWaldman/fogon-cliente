import type { Letra } from '../cancion/letra'
import {
  SeparadorSilabas,
  type SilabasPalabra,
} from '../cancion/SeparadorSilabas'
import { RenglonTexto } from './renglonResumen'

export class ProcesadorTexto {
  private readonly separadorSilabas = new SeparadorSilabas()

  /**
   * Separa el texto de una letra en renglones individuales
   */
  public separarEnRenglones(letra: Letra): string[] {
    if (!letra?.renglones?.length) {
      throw new Error('La letra no contiene renglones válidos')
    }

    const letraRenglones = letra.renglones.flat()
    const renglonRet: string[] = []
    let renglonToAdd = ''

    for (let i = 0; i < letraRenglones.length; i++) {
      const parteLetra = letraRenglones[i]

      if (parteLetra.includes('/n')) {
        const partes = parteLetra.split('/n')

        for (let j = 0; j < partes.length; j++) {
          renglonToAdd += partes[j]

          // Si no es la última parte, agregar el renglón y resetear
          if (j < partes.length - 1) {
            renglonRet.push(renglonToAdd)
            renglonToAdd = ''
          }
        }
      } else {
        renglonToAdd += parteLetra
      }
    }

    renglonRet.push(renglonToAdd)
    return renglonRet
  }

  /**
   * Limpia un texto removiendo signos de puntuación y espacios extra
   */
  public limpiarTexto(texto: string): string {
    let textoLimpio = texto.replace(/[¿?¡!,;:.]/g, ' ')
    textoLimpio = textoLimpio.replace(/\s+/g, ' ').trim()
    return textoLimpio
  }

  /**
   * Calcula el resumen de un verso (sílabas y rima)
   */
  public calcularResumenVerso(contenido: string): RenglonTexto {
    const contenidoLimpio = this.limpiarTexto(contenido)
    const palabras = contenidoLimpio.split(' ')
    const resumen = new RenglonTexto()

    const palabrasConSilabas = this.obtenerPalabrasConSilabas(palabras)

    resumen.Rima = this.separadorSilabas.GetRima(palabrasConSilabas)
    resumen.silabas =
      this.separadorSilabas.GetNroSilabasVerso(palabrasConSilabas)

    return resumen
  }

  private obtenerPalabrasConSilabas(palabras: string[]): SilabasPalabra[] {
    const palabrasConSilabas: SilabasPalabra[] = []

    for (const palabra of palabras) {
      const silabasPalabra = this.separadorSilabas.getSilabas(palabra)

      if (silabasPalabra.silabas.length > 0) {
        palabrasConSilabas.push(silabasPalabra)
      }
    }

    return palabrasConSilabas
  }
}
