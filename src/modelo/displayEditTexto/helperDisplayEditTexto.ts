import type { Letra } from '../cancion/letra'
import { RenglonTexto } from './renglonResumen'
import { textoResumen, silabasPrincipal } from './textoResumen'
import { AnalizadorSilabas } from './AnalizadorSilabas'
import { AnalizadorRimas } from './AnalizadorRimas'
import { ProcesadorTexto } from './ProcesadorTexto'
import { AnalizadorTipoTexto } from './analizadoresTexto/AnalizadorTipoTexto'

export class HelperDisplayEditTexto {
  private readonly analizadorSilabas: AnalizadorSilabas
  private readonly analizadorRimas: AnalizadorRimas
  private readonly procesadorTexto: ProcesadorTexto

  constructor(
    analizadorSilabas?: AnalizadorSilabas,
    analizadorRimas?: AnalizadorRimas,
    procesadorTexto?: ProcesadorTexto,
  ) {
    this.analizadorSilabas = analizadorSilabas || new AnalizadorSilabas()
    this.analizadorRimas = analizadorRimas || new AnalizadorRimas()
    this.procesadorTexto = procesadorTexto || new ProcesadorTexto()
  }

  public getResumen(letra: Letra): textoResumen {
    if (!letra?.renglones?.length) {
      throw new Error('Letra inválida o vacía')
    }

    const renglones = this.procesadorTexto.separarEnRenglones(letra)
    const resumenRenglones = renglones.map((renglon) =>
      this.procesadorTexto.calcularResumenVerso(renglon),
    )

    // Asignar números de renglón a los versos válidos
    let contVersos = 0
    for (const resumenVerso of resumenRenglones) {
      if (resumenVerso.silabas > 0) {
        contVersos += 1
        resumenVerso.nroRenglon = contVersos
      }
    }

    const versosConSilabas = resumenRenglones.filter((r) => r.silabas > 0)
    const silabas = versosConSilabas.map((r) => r.silabas)

    const distribucionSilabas =
      this.analizadorSilabas.calcularDistribucionSilabas(silabas)
    this.analizadorSilabas.calcularDistanciaSilabas(
      resumenRenglones,
      distribucionSilabas,
    )

    const tipoRimaPredominante =
      this.analizadorRimas.analizarRimas(resumenRenglones)

    const resumen = new textoResumen()
    resumen.versos = contVersos
    resumen.renglones = resumenRenglones
    resumen.silabas = distribucionSilabas
    resumen.rimas = tipoRimaPredominante
    resumen.rimas = AnalizadorTipoTexto.GetTipo(resumen)

    return resumen
  }

  // Métodos mantenidos para compatibilidad con tests existentes
  public CalcularDiferenciaSilabas(silabas: number[]): silabasPrincipal[] {
    return this.analizadorSilabas.calcularDistribucionSilabas(silabas)
  }

  public CalcularResumenVerso(contenido: string): RenglonTexto {
    return this.procesadorTexto.calcularResumenVerso(contenido)
  }

  public TextoAsonante(texto: string): string {
    return this.analizadorRimas.textoAsonante(texto)
  }

  public RimaAsonante(textoA: string, textoB: string): boolean {
    return this.analizadorRimas.rimaAsonante(textoA, textoB)
  }

  public CalcularLetraRima(resumen: textoResumen): void {
    // Usar solo la parte de cálculo de letras, sin reasignación
    const analizador = new AnalizadorRimas()
    analizador.calcularLetraRimaSinReasignar(resumen.renglones)
  }

  public CalcularDistanciaSilabas(resumen: textoResumen): void {
    this.analizadorSilabas.calcularDistanciaSilabas(
      resumen.renglones,
      resumen.silabas,
    )
  }

  public ResumirRimas(resumen: textoResumen): void {
    const tipoRima = this.analizadorRimas.analizarRimas(resumen.renglones)
    resumen.rimas = tipoRima
  }
}
