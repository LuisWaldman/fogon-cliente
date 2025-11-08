import type { Letra } from '../cancion/letra'
import { SeparadorSilabas } from '../cancion/SeparadorSilabas'
import { RenglonTexto } from './renglonResumen'
import { textoResumen } from './textoResumen'

export class HelperDisplayEditTexto {
  public getResumen(letra: Letra): textoResumen {
    const renglones = this.SepararEnRenglones(letra)
    let contVersos: number = 0
    const resumen = new textoResumen()
    const silabas: number[] = []
    for (let i = 0; i < renglones.length; i++) {
      const renglon = renglones[i]
      const resumenVerso = this.CalcularResumenVerso(renglon)
      if (resumenVerso.silabas > 0) {
        silabas.push(resumenVerso.silabas)
        contVersos += 1
        resumenVerso.nroRenglon = contVersos
      }
      resumen.renglones.push(resumenVerso)
    }
    resumen.versos = contVersos

    // Calculo diferencia de sílabas
    return resumen
  }

  private CalcularResumenVerso(contenido: string): RenglonTexto {
    let contenidoReal = contenido.replace(/[¿?¡!,;:.]/g, ' ')
    contenidoReal = contenidoReal.replace(/\s+/g, ' ').trim()
    const palabras = contenidoReal.split(' ')
    const resumen = new RenglonTexto()
    let silabas = 0
    const sepSilabas = new SeparadorSilabas()
    for (let i = 0; i < palabras.length; i++) {
      const silabasPalabra = sepSilabas.getSilabas(palabras[i])
      silabas += silabasPalabra.silabas.length
      if (silabasPalabra.silabas.length > 0) {
        resumen.ultimaSilaba =
          silabasPalabra.silabas[silabasPalabra.silabas.length - 1].silaba
      }
    }
    resumen.silabas = silabas
    return resumen
  }

  private SepararEnRenglones(letra: Letra): string[] {
    const letrarenglones = letra.renglones.flat()
    const renglonRet: string[] = []
    let rengonToAdd = ''
    for (let i = 0; i < letrarenglones.length; i++) {
      const parteletra = letrarenglones[i]
      if (parteletra.includes('/n')) {
        const partes = parteletra.split('/n')
        rengonToAdd += partes[0]
        renglonRet.push(rengonToAdd)
        rengonToAdd = partes[1]
      } else {
        rengonToAdd += parteletra
      }
    }
    renglonRet.push(rengonToAdd)
    return renglonRet
  }
}
