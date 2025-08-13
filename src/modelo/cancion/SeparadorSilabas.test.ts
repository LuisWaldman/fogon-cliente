import { describe, it, expect } from 'vitest'
import { SeparadorSilabas } from './SeparadorSilabas'

describe('Metricas Test', () => {
  it('Separar silabas palabra', () => {
    const separador = new SeparadorSilabas()
    const resultadoCancion = separador.getSilabas('canción')
    expect(resultadoCancion.silabas.map((s) => s.silaba)).toEqual([
      'can',
      'ción',
    ])
    expect(resultadoCancion.silabas.length).toBe(2)
    const resultadoResultado = separador.getSilabas('resultado')
    expect(resultadoResultado.silabas.map((s) => s.silaba)).toEqual([
      're',
      'sul',
      'ta',
      'do',
    ])
    expect(resultadoResultado.silabas.length).toBe(4)
  })
})
