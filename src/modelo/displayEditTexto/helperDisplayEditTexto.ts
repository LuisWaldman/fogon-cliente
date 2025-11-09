import type { Letra } from '../cancion/letra'
import {
  SeparadorSilabas,
  type SilabasPalabra,
} from '../cancion/SeparadorSilabas'
import { RenglonTexto } from './renglonResumen'
import { textoResumen, silabasPrincipal } from './textoResumen'

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
    resumen.silabas = this.CalcularDiferenciaSilabas(silabas)
    // Calculo la letra de la rima
    this.CalcularLetraRima(resumen)
    return resumen
  }
  CalcularLetraRima(resumen: textoResumen) {
    for (const renglon of resumen.renglones) {
      if (renglon.silabas > 0 && renglon.Rima) {
      }
    }
  }

  CalcularDiferenciaSilabas(silabas: number[]): silabasPrincipal[] {
    if (silabas.length === 0) return []

    const conteo = new Map<number, number>()

    // Contar ocurrencias de cada cantidad de sílabas
    for (const s of silabas) {
      conteo.set(s, (conteo.get(s) || 0) + 1)
    }

    const cantidades = Array.from(conteo.entries()).sort((a, b) => b[1] - a[1]) // ordenado por frecuencia descendente

    const grupos: { base: number; total: number }[] = []
    const procesadas = new Set<number>()

    for (const [base] of cantidades) {
      if (procesadas.has(base)) continue

      // sumar cuántos versos están en el rango base ±2
      let total = 0
      for (let delta = -2; delta <= 2; delta++) {
        const count = conteo.get(base + delta) || 0
        if (count > 0) {
          total += count
          procesadas.add(base + delta)
        }
      }

      grupos.push({ base, total })
      if (grupos.length === 2) break // solo queremos hasta 2 grupos
    }

    // Validar que todos los versos están incluidos en los grupos encontrados
    let totalVersos = 0
    for (const g of grupos) {
      totalVersos += g.total
    }

    if (totalVersos !== silabas.length) {
      // Si no todos los versos están en los grupos, retornar array vacío (indica 0 o irregular)
      return []
    }

    const resultado: silabasPrincipal[] = grupos.map((g) => {
      const item = new silabasPrincipal()
      item.base = g.base

      // Calcular la diferencia máxima en este grupo
      let minSilabas = g.base
      let maxSilabas = g.base
      for (let delta = -2; delta <= 2; delta++) {
        const count = conteo.get(g.base + delta) || 0
        if (count > 0) {
          minSilabas = Math.min(minSilabas, g.base + delta)
          maxSilabas = Math.max(maxSilabas, g.base + delta)
        }
      }
      item.diferencia = maxSilabas - minSilabas

      return item
    })

    return resultado
  }

  private CalcularResumenVerso(contenido: string): RenglonTexto {
    let contenidoReal = contenido.replace(/[¿?¡!,;:.]/g, ' ')
    contenidoReal = contenidoReal.replace(/\s+/g, ' ').trim()
    const palabras = contenidoReal.split(' ')
    const resumen = new RenglonTexto()
    const sepSilabas = new SeparadorSilabas()
    const palabrasConSilabas: SilabasPalabra[] = []
    for (let i = 0; i < palabras.length; i++) {
      const silabasPalabra = sepSilabas.getSilabas(palabras[i])
      if (silabasPalabra.silabas.length > 0) {
        palabrasConSilabas.push(silabasPalabra)
      }
    }
    resumen.Rima = sepSilabas.GetRima(palabrasConSilabas)
    resumen.silabas = sepSilabas.GetNroSilabasVerso(palabrasConSilabas)
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
        // Procesar todas las partes separadas por /n
        for (let j = 0; j < partes.length; j++) {
          rengonToAdd += partes[j]
          // Si no es la última parte, agregar el renglón y resetear
          if (j < partes.length - 1) {
            renglonRet.push(rengonToAdd)
            rengonToAdd = ''
          }
        }
      } else {
        rengonToAdd += parteletra
      }
    }
    renglonRet.push(rengonToAdd)
    return renglonRet
  }
}
