import { describe, expect, it } from 'vitest'
import { HelperSonidos } from './helperSonido'

describe('Helper Sonido', () => {
  it('Busca la frencuencia correcta de las notas', () => {
    const notas = HelperSonidos.GetNotas(440, 12, [
      'A',
      'A#',
      'B',
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
    ])
    let notaId = HelperSonidos.GetNotaDesdeFrecuenciaConNotasSonido(440, notas)
    expect(notas[notaId].nota).toBe('A')
    expect(notas[notaId].octava).toBe(4)

    notaId = HelperSonidos.GetNotaDesdeFrecuenciaConNotasSonido(131, notas)
    expect(notas[notaId].nota).toBe('C')
    expect(notas[notaId].octava).toBe(3)
  })
})
