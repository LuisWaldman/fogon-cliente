import { describe, it, expect } from 'vitest'
import { EstadoSincroCancion } from '../src/modelo/sincro/EstadoSincroCancion'
import { SincroCancion } from '../src/modelo/sincro/SincroCancion'
import { HelperSincro } from '../src/modelo/sincro/HelperSincro'

describe('HelperSincro.sicronizar', () => {
  it('Si la fecha es anterior deberia quedar Iniciando', () => {
    const momento = new Date()
    const sincro = new SincroCancion(
      100,
      new Date(momento.getTime() + 1000), // timeInicio
      4, // golpesxcompas
      0, // duracionGolpe
    )

    const est: EstadoSincroCancion = HelperSincro.getInstance().sincronizar(
      sincro,
      momento,
    )

    expect(est.estado).toBe('Iniciando')
  })

  it('Si la fecha es posterior deberia quedar Reproduciendo', () => {
    const momento = new Date()
    const sincro = new SincroCancion(
      100,
      new Date(momento.getTime() - 1000), // timeInicio
      4, // golpesxcompas
      0, // duracionGolpe
    )

    const est: EstadoSincroCancion = HelperSincro.getInstance().sincronizar(
      sincro,
      momento,
    )

    expect(est.estado).toBe('Reproduciendo')
  })

  it('se inicio hace un microsegundo', () => {
    const momento = new Date()
    const golpesxcompas = 4
    const duracionGolpe = 1000 // 1 segundo
    const iniciocompas = 0
    const sincro = new SincroCancion(
      duracionGolpe,
      new Date(momento.getTime() + (golpesxcompas * duracionGolpe) - 1), // timeInicio
      golpesxcompas, // golpesxcompas
      iniciocompas, // desdeCompas
    )

    const est: EstadoSincroCancion = HelperSincro.getInstance().sincronizar(
      sincro,
      momento,
    )

    expect(est.estado).toBe('Iniciando')
    expect(est.compas).toBe(iniciocompas)
    expect(est.golpeEnCompas).toBe(1)
    expect(est.delay).toBe(duracionGolpe - 1) // 1 segundo - 1 microsegundo
  })

  it('se inicio hace 5 compaces y 2 golpes y 30ms', () => {
    const momento = new Date()
    const golpesxcompas = 4
    const duracionGolpe = 1000 // 1 segundo
    const iniciocompas = 0
    const sincro = new SincroCancion(
      duracionGolpe,
      new Date(
        momento.getTime() -
          (duracionGolpe * 2 + golpesxcompas * duracionGolpe * 5 + 30),
      ), // timeInicio
      golpesxcompas, // golpesxcompas
      iniciocompas, // desdeCompas
    )

    const est: EstadoSincroCancion = HelperSincro.getInstance().sincronizar(
      sincro,
      momento,
    )

    expect(est.estado).toBe('Reproduciendo')
    expect(est.compas).toBe(iniciocompas + 5)
    expect(est.golpeEnCompas).toBe(2)
    expect(est.delay).toBe(duracionGolpe - 30) // 1 segundo - 1 microsegundo
  })
})
