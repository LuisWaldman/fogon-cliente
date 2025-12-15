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
    this.CalcularDistanciaSilabas(resumen)
    // Calculo la letra de la rima
    this.CalcularLetraRima(resumen)
    this.ResumirRimas(resumen)
    return resumen
  }

  ResumirRimas(resumen: textoResumen) {
    const rimas: string[] = []
    let consonantesCount = 0
    let asonantesCount = 0
    for (const renglon of resumen.renglones) {
      if (renglon.tipoRima === 'consonante') {
        consonantesCount++
      } else if (renglon.tipoRima === 'asonante') {
        asonantesCount++
      }
      if (renglon.LetraRima) {
        if (!rimas.includes(renglon.LetraRima)) {
          rimas.push(renglon.LetraRima)
          renglon.LetraRima = String.fromCharCode(97 + rimas.length - 1) // 'a' = 97 en ASCII
        } else {
          renglon.LetraRima = String.fromCharCode(
            97 + rimas.indexOf(renglon.LetraRima),
          ) // 'a' = 97 en ASCII
        }
      }
    }
    if (resumen.versos * 0.7 < consonantesCount + asonantesCount) {
      if (consonantesCount >= asonantesCount) {
        resumen.rimas = 'consonante'
      } else {
        resumen.rimas = 'asonante'
      }
    } else {
      // Si menos del 80% de los versos tienen rima, se considera que no hay rima
      resumen.rimas = 'sin rima'
    }
  }

  CalcularDistanciaSilabas(resumen: textoResumen) {
    if (resumen.silabas.length === 0) return
    for (const renglon of resumen.renglones) {
      if (renglon.silabas > 0) {
        let distanciaMinima = Number.MAX_SAFE_INTEGER
        for (const silabaPrincipal of resumen.silabas) {
          const distancia = Math.abs(renglon.silabas - silabaPrincipal.base)
          if (distancia < distanciaMinima) {
            distanciaMinima = distancia
          }
        }
        renglon.diferenciaSilabas = distanciaMinima
      } else {
        renglon.diferenciaSilabas = -1
      }
    }
  }

  TextoAsonante(stringA: string): string {
    return stringA
      .toLowerCase()
      .replace(/[^aáeéiíoóuú]/g, '')
      .replace(/á/g, 'a')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u')
  }

  RimaAsonante(stringA: string, stringB: string): boolean {
    const rimaA = this.TextoAsonante(stringA)
    const rimaB = this.TextoAsonante(stringB)
    return rimaA === rimaB && rimaA.length > 0
  }

  CalcularLetraRima(resumen: textoResumen) {
    const rimas = []
    // Recorro los renglones y asigno rimas CONSONANTES
    for (let renglon = 0; renglon < resumen.renglones.length; renglon++) {
      const renglonObject = resumen.renglones[renglon]
      if (renglonObject.silabas > 0 && renglonObject.Rima) {
        for (
          let otroRenglon = renglon + 1;
          otroRenglon < resumen.renglones.length && otroRenglon < renglon + 4;
          otroRenglon++
        ) {
          const otroRenglonObject = resumen.renglones[otroRenglon]
          if (otroRenglonObject.Rima === renglonObject.Rima) {
            renglonObject.LetraRima = String.fromCharCode(65 + rimas.length) // 'A' = 65 en ASCII
            otroRenglonObject.LetraRima = String.fromCharCode(65 + rimas.length) // 'A' = 65 en ASCII
            renglonObject.tipoRima = 'consonante' // suponer consonante para simplificar
            otroRenglonObject.tipoRima = 'consonante' // suponer consonante para simplificar

            rimas.push(otroRenglonObject.Rima) // 'A' = 65 en ASCII
            break
          }
        }
      }
    }
    // Recorro los renglones y asigno rimas ASONANTES
    for (let renglon = 0; renglon < resumen.renglones.length; renglon++) {
      const renglonObject = resumen.renglones[renglon]
      if (
        renglonObject.silabas > 0 &&
        renglonObject.Rima &&
        !renglonObject.LetraRima
      ) {
        for (
          let otroRenglon = renglon + 1;
          otroRenglon < resumen.renglones.length && otroRenglon < renglon + 4;
          otroRenglon++
        ) {
          const otroRenglonObject = resumen.renglones[otroRenglon]
          if (
            otroRenglonObject.Rima &&
            this.RimaAsonante(renglonObject.Rima, otroRenglonObject.Rima)
          ) {
            renglonObject.LetraRima = String.fromCharCode(97 + rimas.length) // 'a' = 97 en ASCII
            otroRenglonObject.LetraRima = String.fromCharCode(97 + rimas.length) // 'a' = 97 en ASCII
            renglonObject.tipoRima = 'asonante'
            otroRenglonObject.tipoRima = 'asonante'

            rimas.push(otroRenglonObject.Rima) // 'a' = 97 en ASCII
            break
          }
        }
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

  public CalcularResumenVerso(contenido: string): RenglonTexto {
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
