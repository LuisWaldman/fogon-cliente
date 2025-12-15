import type { textoResumen } from '../textoResumen'
import { AnalizadorSonteto } from './AnalizadorSonteto'

export class AnalizadorTipoTexto {
  static GetTipo(texto: textoResumen): string {
    // Lógica para determinar el tipo de texto basado en el resumen
    const esSoneto = AnalizadorSonteto.GetTipo(texto)
    if (esSoneto !== '') {
      return esSoneto
    }
    return texto.rimas
  }
}
