import { HelperSincro } from './HelperSincro'
import { describe, it, expect } from 'vitest'
import { SincroCancion } from './SincroCancion'

describe('Helper Sinro', () => {
  it('Cancion por iniciar', () => {
    const tiempoinicio = 0 // 0 milisegundos
    const tiempo = tiempoinicio
    const sincro = new SincroCancion(
      100,
      0, // tiempo de inicio
      4, // golpesxcompas
      0, // desde compas
    )

    const helper = HelperSincro.getInstance()
    const est = helper.GetEstadoSincro(sincro, tiempo)

    expect(est.estado).toBe('Reproduciendo')
    expect(est.compas).toBe(0)
    expect(est.golpeEnCompas).toBe(-0)
    expect(est.delay).toBe(100)
  })

  it('Empezo hace un micro segundo', () => {
    const tiempoinicio = 1000 // 1 segundo
    const tiempo = tiempoinicio + 1 // Un micro segundo después
    const sincro = new SincroCancion(
      100,
      tiempoinicio,
      4, // golpesxcompas
      0, // desde compas
    )

    const helper = HelperSincro.getInstance()
    const est = helper.GetEstadoSincro(sincro, tiempo)

    expect(est.estado).toBe('Reproduciendo')
    expect(est.compas).toBe(0)
    expect(est.golpeEnCompas).toBe(0)
    expect(est.delay).toBe(99)
  })

  it('Falta un micro segundo', () => {
    const tiempoinicio = 1000 // 1 segundo
    const tiempo = tiempoinicio - 1 // Un micro segundo antes
    const sincro = new SincroCancion(
      100,
      tiempoinicio,
      4, // golpesxcompas
      0, // desde compas
    )

    const helper = HelperSincro.getInstance()
    const est = helper.GetEstadoSincro(sincro, tiempo)

    expect(est.estado).toBe('Iniciando')
    expect(est.compas).toBe(0)
    expect(est.golpeEnCompas).toBe(3)
    expect(est.delay).toBe(1)
  })
})
