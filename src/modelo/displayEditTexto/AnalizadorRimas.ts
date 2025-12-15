import type { RenglonTexto } from './renglonResumen'
import { TipoRima, CONFIGURACION_ANALISIS } from './constantes'

export class AnalizadorRimas {
  private rimasRegistradas: string[] = []

  /**
   * Analiza las rimas en un conjunto de renglones y determina el tipo predominante
   * Implementación que replica exactamente el comportamiento original
   */
  public analizarRimas(renglones: RenglonTexto[]): TipoRima {
    this.rimasRegistradas = []

    // Implementación original exacta
    this.calcularLetraRimaOriginal(renglones)
    this.resumirRimasOriginal(renglones)

    return this.determinarTipoRimaPredominante(renglones)
  }

  /**
   * Solo calcula las letras de rima sin reasignación final (para compatibilidad con tests)
   */
  public calcularLetraRimaSinReasignar(renglones: RenglonTexto[]): void {
    this.rimasRegistradas = []
    this.calcularLetraRimaOriginal(renglones)
    // No llamar a resumirRimasOriginal para mantener las letras originales
  }

  /**
   * Implementación que asigna letras de rima a todos los versos válidos
   */
  private calcularLetraRimaOriginal(renglones: RenglonTexto[]): void {
    const rimas: string[] = []

    // Recorro los renglones y asigno rimas CONSONANTES
    for (let renglon = 0; renglon < renglones.length; renglon++) {
      const renglonObject = renglones[renglon]
      if (renglonObject.silabas > 0 && renglonObject.Rima) {
        for (
          let otroRenglon = renglon + 1;
          otroRenglon < renglones.length &&
          otroRenglon < renglon + CONFIGURACION_ANALISIS.VENTANA_BUSQUEDA_RIMA;
          otroRenglon++
        ) {
          const otroRenglonObject = renglones[otroRenglon]
          if (otroRenglonObject.Rima === renglonObject.Rima) {
            renglonObject.LetraRima = String.fromCharCode(
              CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA + rimas.length,
            )
            otroRenglonObject.LetraRima = String.fromCharCode(
              CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA + rimas.length,
            )
            renglonObject.tipoRima = TipoRima.CONSONANTE
            otroRenglonObject.tipoRima = TipoRima.CONSONANTE

            rimas.push(otroRenglonObject.Rima)
            break
          }
        }
      }
    }

    // Recorro los renglones y asigno rimas ASONANTES
    for (let renglon = 0; renglon < renglones.length; renglon++) {
      const renglonObject = renglones[renglon]
      if (
        renglonObject.silabas > 0 &&
        renglonObject.Rima &&
        !renglonObject.LetraRima
      ) {
        for (
          let otroRenglon = renglon + 1;
          otroRenglon < renglones.length &&
          otroRenglon < renglon + CONFIGURACION_ANALISIS.VENTANA_BUSQUEDA_RIMA;
          otroRenglon++
        ) {
          const otroRenglonObject = renglones[otroRenglon]
          if (
            otroRenglonObject.Rima &&
            this.rimaAsonante(renglonObject.Rima, otroRenglonObject.Rima)
          ) {
            renglonObject.LetraRima = String.fromCharCode(
              CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA + rimas.length,
            )
            otroRenglonObject.LetraRima = String.fromCharCode(
              CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA + rimas.length,
            )
            renglonObject.tipoRima = TipoRima.ASONANTE
            otroRenglonObject.tipoRima = TipoRima.ASONANTE

            rimas.push(otroRenglonObject.Rima)
            break
          }
        }
      }
    }

    // Asignar letras a TODOS los versos que tienen sílabas > 0 y no tienen letra asignada
    // Incluso si no riman con nada, PERO solo si tienen texto de rima (no vacío)
    for (const renglonObject of renglones) {
      if (
        renglonObject.silabas > 0 &&
        renglonObject.Rima &&
        renglonObject.Rima.trim() !== '' &&
        !renglonObject.LetraRima
      ) {
        renglonObject.LetraRima = String.fromCharCode(
          CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA + rimas.length,
        )
        rimas.push(`verso_${rimas.length}`) // Identificador único para versos sin rima
      }
    }
  }

  /**
   * Implementación exacta del algoritmo original ResumirRimas
   */
  private resumirRimasOriginal(renglones: RenglonTexto[]): void {
    const rimas: string[] = []
    for (const renglon of renglones) {
      if (renglon.LetraRima) {
        if (!rimas.includes(renglon.LetraRima)) {
          rimas.push(renglon.LetraRima)
          renglon.LetraRima = String.fromCharCode(
            CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA + rimas.length - 1,
          )
        } else {
          renglon.LetraRima = String.fromCharCode(
            CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA +
              rimas.indexOf(renglon.LetraRima),
          )
        }
      }
    }
  }

  /**
   * Convierte texto a formato asonante (solo vocales sin acentos)
   */
  public textoAsonante(texto: string): string {
    return texto
      .toLowerCase()
      .replace(/[^aáeéiíoóuú]/g, '')
      .replace(/á/g, 'a')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u')
  }

  /**
   * Verifica si dos textos tienen rima asonante
   */
  public rimaAsonante(textoA: string, textoB: string): boolean {
    const rimaA = this.textoAsonante(textoA)
    const rimaB = this.textoAsonante(textoB)
    return rimaA === rimaB && rimaA.length > 0
  }

  /**
   * Calcula letras de rima sin reasignar (para compatibilidad con tests)
   */
  public calcularLetraRimaSinReasignar(renglones: RenglonTexto[]): void {
    this.rimasRegistradas = []
    this.calcularLetraRimaOriginal(renglones)
    // No llamar a resumirRimasOriginal para mantener las mayúsculas originales
  }

  private detectarRimasConsonantes(renglones: RenglonTexto[]): void {
    for (let i = 0; i < renglones.length; i++) {
      const renglonActual = renglones[i]

      if (!this.esRenglonValidoParaRima(renglonActual)) {
        continue
      }

      const renglonCoincidente = this.buscarCoincidenciaConsonante(renglones, i)

      if (renglonCoincidente) {
        this.marcarComoRimaConsonante(renglonActual, renglonCoincidente)
      }
    }
  }

  private detectarRimasAsonantes(renglones: RenglonTexto[]): void {
    for (let i = 0; i < renglones.length; i++) {
      const renglonActual = renglones[i]

      if (!this.esRenglonValidoParaRimaAsonante(renglonActual)) {
        continue
      }

      const renglonCoincidente = this.buscarCoincidenciaAsonante(renglones, i)

      if (renglonCoincidente && !renglonCoincidente.LetraRima) {
        this.marcarComoRimaAsonante(renglonActual, renglonCoincidente)
      }
    }
  }

  private buscarCoincidenciaConsonante(
    renglones: RenglonTexto[],
    indiceBase: number,
  ): RenglonTexto | null {
    const renglonBase = renglones[indiceBase]
    const inicio = indiceBase + 1
    const fin = Math.min(
      renglones.length,
      indiceBase + CONFIGURACION_ANALISIS.VENTANA_BUSQUEDA_RIMA + 1,
    )

    for (let j = inicio; j < fin; j++) {
      const otroRenglon = renglones[j]
      if (otroRenglon.Rima === renglonBase.Rima) {
        return otroRenglon
      }
    }

    return null
  }

  private buscarCoincidenciaAsonante(
    renglones: RenglonTexto[],
    indiceBase: number,
  ): RenglonTexto | null {
    const renglonBase = renglones[indiceBase]
    const inicio = indiceBase + 1
    const fin = Math.min(
      renglones.length,
      indiceBase + CONFIGURACION_ANALISIS.VENTANA_BUSQUEDA_RIMA + 1,
    )

    for (let j = inicio; j < fin; j++) {
      const otroRenglon = renglones[j]
      if (
        otroRenglon.Rima &&
        this.rimaAsonante(renglonBase.Rima, otroRenglon.Rima)
      ) {
        return otroRenglon
      }
    }

    return null
  }

  private marcarComoRimaConsonante(
    renglon1: RenglonTexto,
    renglon2: RenglonTexto,
  ): void {
    const letraRima = String.fromCharCode(
      CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA +
        this.rimasRegistradas.length,
    )

    renglon1.LetraRima = letraRima
    renglon2.LetraRima = letraRima
    renglon1.tipoRima = TipoRima.CONSONANTE
    renglon2.tipoRima = TipoRima.CONSONANTE

    this.rimasRegistradas.push(renglon2.Rima)
  }

  private marcarComoRimaAsonante(
    renglon1: RenglonTexto,
    renglon2: RenglonTexto,
  ): void {
    const letraRima = String.fromCharCode(
      CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MINUSCULA +
        this.rimasRegistradas.length,
    )

    renglon1.LetraRima = letraRima
    renglon2.LetraRima = letraRima
    renglon1.tipoRima = TipoRima.ASONANTE
    renglon2.tipoRima = TipoRima.ASONANTE

    this.rimasRegistradas.push(renglon2.Rima)
  }

  private asignarLetrasRima(renglones: RenglonTexto[]): void {
    const rimasUnicas: string[] = []

    for (const renglon of renglones) {
      if (!renglon.LetraRima) {
        continue
      }

      if (!rimasUnicas.includes(renglon.LetraRima)) {
        rimasUnicas.push(renglon.LetraRima)
        const nuevaLetra = String.fromCharCode(
          CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA +
            rimasUnicas.length -
            1,
        )
        renglon.LetraRima = nuevaLetra
      } else {
        const indice = rimasUnicas.indexOf(renglon.LetraRima)
        renglon.LetraRima = String.fromCharCode(
          CONFIGURACION_ANALISIS.CODIGO_ASCII_A_MAYUSCULA + indice,
        )
      }
    }
  }

  private determinarTipoRimaPredominante(renglones: RenglonTexto[]): TipoRima {
    const versosConRima = renglones.filter((r) => r.silabas > 0)
    const consonantesCount = renglones.filter(
      (r) => r.tipoRima === TipoRima.CONSONANTE,
    ).length
    const asonantesCount = renglones.filter(
      (r) => r.tipoRima === TipoRima.ASONANTE,
    ).length
    const totalConRima = consonantesCount + asonantesCount

    const umbral =
      versosConRima.length * CONFIGURACION_ANALISIS.UMBRAL_RIMA_PREDOMINANTE

    if (totalConRima < umbral) {
      return TipoRima.SIN_RIMA
    }

    return consonantesCount >= asonantesCount
      ? TipoRima.CONSONANTE
      : TipoRima.ASONANTE
  }

  private esRenglonValidoParaRima(renglon: RenglonTexto): boolean {
    return renglon.silabas > 0 && !!renglon.Rima
  }

  private esRenglonValidoParaRimaAsonante(renglon: RenglonTexto): boolean {
    return renglon.silabas > 0 && !!renglon.Rima && !renglon.LetraRima
  }
}
