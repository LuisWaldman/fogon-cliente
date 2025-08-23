import { describe, expect, it } from 'vitest'
import { EstiloAcorde } from './estiloAcorde'

describe('Estilo acordes', () => {
  it('Devuelve tiempos Ok', () => {
    const estilo1 = new EstiloAcorde(1, 1)
    expect(estilo1.GetDuracionPentagrama()).toBe('h')
    const estilo2 = new EstiloAcorde(2, 1)
    expect(estilo2.GetDuracionPentagrama()).toBe('q')
    const estilo3 = new EstiloAcorde(3, 1)
    expect(estilo3.GetDuracionPentagrama()).toBe('8')
    const estilo4 = new EstiloAcorde(4, 1)
    expect(estilo4.GetDuracionPentagrama()).toBe('16')
  })
})
