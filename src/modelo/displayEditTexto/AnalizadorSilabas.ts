import type { RenglonTexto } from './renglonResumen'
import { silabasPrincipal } from './textoResumen'
import { CONFIGURACION_ANALISIS } from './constantes'

export class AnalizadorSilabas {
  /**
   * Calcula la distribución principal de sílabas en un conjunto de versos
   * Agrupa versos por cantidad de sílabas similares (±2) y retorna hasta 2 grupos principales
   */
  public calcularDistribucionSilabas(silabas: number[]): silabasPrincipal[] {
    if (silabas.length === 0) {
      return []
    }

    const conteo = this.contarOcurrenciasSilabas(silabas)
    const grupos = this.agruparSilabasSimilares(conteo)

    // Validar que todos los versos están incluidos en los grupos
    if (!this.todosLosVersosEstanIncluidos(grupos, silabas.length)) {
      return []
    }

    return this.construirResultadoDistribucion(grupos, conteo)
  }

  /**
   * Calcula la distancia de cada renglón respecto a las sílabas principales
   */
  public calcularDistanciaSilabas(
    renglones: RenglonTexto[],
    distribucionSilabas: silabasPrincipal[],
  ): void {
    if (distribucionSilabas.length === 0) {
      return
    }

    for (const renglon of renglones) {
      if (renglon.silabas > 0) {
        renglon.diferenciaSilabas = this.calcularDistanciaMinima(
          renglon.silabas,
          distribucionSilabas,
        )
      } else {
        renglon.diferenciaSilabas = -1
      }
    }
  }

  private contarOcurrenciasSilabas(silabas: number[]): Map<number, number> {
    const conteo = new Map<number, number>()

    for (const s of silabas) {
      conteo.set(s, (conteo.get(s) || 0) + 1)
    }

    return conteo
  }

  private agruparSilabasSimilares(
    conteo: Map<number, number>,
  ): Array<{ base: number; total: number }> {
    const cantidades = Array.from(conteo.entries()).sort((a, b) => b[1] - a[1]) // ordenado por frecuencia descendente

    const grupos: Array<{ base: number; total: number }> = []
    const procesadas = new Set<number>()

    for (const [base] of cantidades) {
      if (procesadas.has(base)) continue

      const total = this.calcularTotalEnRango(base, conteo, procesadas)
      grupos.push({ base, total })

      if (grupos.length === CONFIGURACION_ANALISIS.MAX_GRUPOS_SILABAS) {
        break
      }
    }

    return grupos
  }

  private calcularTotalEnRango(
    base: number,
    conteo: Map<number, number>,
    procesadas: Set<number>,
  ): number {
    let total = 0
    const rango = CONFIGURACION_ANALISIS.RANGO_TOLERANCIA_SILABAS

    for (let delta = -rango; delta <= rango; delta++) {
      const valor = base + delta
      const count = conteo.get(valor) || 0

      if (count > 0) {
        total += count
        procesadas.add(valor)
      }
    }

    return total
  }

  private todosLosVersosEstanIncluidos(
    grupos: Array<{ base: number; total: number }>,
    totalVersos: number,
  ): boolean {
    const totalVersosEnGrupos = grupos.reduce((sum, g) => sum + g.total, 0)
    return totalVersosEnGrupos === totalVersos
  }

  private construirResultadoDistribucion(
    grupos: Array<{ base: number; total: number }>,
    conteo: Map<number, number>,
  ): silabasPrincipal[] {
    return grupos.map((grupo) => {
      const item = new silabasPrincipal()
      item.base = grupo.base
      item.diferencia = this.calcularDiferenciaMaximaEnGrupo(grupo.base, conteo)
      return item
    })
  }

  private calcularDiferenciaMaximaEnGrupo(
    base: number,
    conteo: Map<number, number>,
  ): number {
    let minSilabas = base
    let maxSilabas = base
    const rango = CONFIGURACION_ANALISIS.RANGO_TOLERANCIA_SILABAS

    for (let delta = -rango; delta <= rango; delta++) {
      const valor = base + delta
      const count = conteo.get(valor) || 0

      if (count > 0) {
        minSilabas = Math.min(minSilabas, valor)
        maxSilabas = Math.max(maxSilabas, valor)
      }
    }

    return maxSilabas - minSilabas
  }

  private calcularDistanciaMinima(
    silabas: number,
    distribucionSilabas: silabasPrincipal[],
  ): number {
    let distanciaMinima = Number.MAX_SAFE_INTEGER

    for (const silabaPrincipal of distribucionSilabas) {
      const distancia = Math.abs(silabas - silabaPrincipal.base)
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia
      }
    }

    return distanciaMinima
  }
}
