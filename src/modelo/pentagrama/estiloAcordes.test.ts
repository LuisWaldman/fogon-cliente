import { describe, expect, it } from 'vitest'
import { EstiloAcorde } from './estiloAcorde'

describe('Estilo acordes', () => {
  it('Devuelve tiempos Ok', () => {
    const estilo = new EstiloAcorde(1, 1)
    expect(estilo.GetDuracionPentagrama()).toBe('redonda')
  })
})
