import { HelperSincro } from './HelperSincro'
import { describe, it, expect } from 'vitest'
import { SincroSesion } from './SincroSesion'

describe('Helper Sinro', () => {
  it('Diferencias', () => {
    const dif1 = HelperSincro.Diferencia(100, 100)
    expect(dif1).toBe(0)
    const dif2 = HelperSincro.Diferencia(100, 200)
    expect(dif2).toBe(-100)
    const dif3 = HelperSincro.Diferencia(200, 100)
    expect(dif3).toBe(100)
    const dif4 = HelperSincro.Diferencia(3600000 - 100, 100)
    expect(dif4).toBe(-200)
  })

  it('Cancion por iniciar', () => {
    const tiempoinicio = 0 // 0 milisegundos
    const tiempo = tiempoinicio
    const sincro = new SincroSesion(
      0, // tiempo de inicio
      0, // desde compas
    )

    const helper = HelperSincro.getInstance()
    const est = helper.GetEstadoSincro(sincro, tiempo, 100, 4)

    expect(est.estado).toBe('Reproduciendo')
    expect(est.compas).toBe(0)
    expect(est.golpeEnCompas).toBe(-0)
    expect(est.delay).toBe(100)
  })

  it('Empezo hace un micro segundo', () => {
    const tiempoinicio = 1000 // 1 segundo
    const tiempo = tiempoinicio + 1 // Un micro segundo después
    const sincro = new SincroSesion(
      tiempoinicio,
      0, // desde compas
    )

    const helper = HelperSincro.getInstance()
    const est = helper.GetEstadoSincro(sincro, tiempo, 100, 4)

    expect(est.estado).toBe('Reproduciendo')
    expect(est.compas).toBe(0)
    expect(est.golpeEnCompas).toBe(0)
    expect(est.delay).toBe(99)
  })

  it('Empezo hace 10 compaces', () => {
    const tiempoinicio = 1000 // 1 segundo
    const duracionGolpe = 250
    const tiempo = tiempoinicio + duracionGolpe * 4 * 10 // 10 compases después
    const sincro = new SincroSesion(
      tiempoinicio,
      0, // desde compas
    )

    const helper = HelperSincro.getInstance()
    const est = helper.GetEstadoSincro(sincro, tiempo, duracionGolpe, 4)

    expect(est.estado).toBe('Reproduciendo')
    expect(est.compas).toBe(10)
    expect(est.golpeEnCompas).toBe(0)
    expect(est.delay).toBe(250)
  })

  it('Empezo hace 10 compaces en el Medio', () => {
    const tiempoinicio = 1000 // 1 segundo
    const duracionGolpe = 250
    const tiempo = tiempoinicio + duracionGolpe * 4 * 10 // 10 compases después
    const sincro = new SincroSesion(
      tiempoinicio,
      0, // desde compas
    )

    const helper = HelperSincro.getInstance()
    const estadoSincro = helper.GetEstadoSincro(
      sincro,
      tiempo,
      duracionGolpe,
      4,
    )
    const est = helper.GetSincro(estadoSincro, tiempo, duracionGolpe, 4, 0)

    expect(est.timeInicio).toBe(tiempoinicio)
  })

  it('Falta un micro segundo', () => {
    const tiempoinicio = 1000 // 1 segundo
    const tiempo = tiempoinicio - 1 // Un micro segundo antes
    const sincro = new SincroSesion(
      tiempoinicio,
      0, // desde compas
    )

    const helper = HelperSincro.getInstance()
    const est = helper.GetEstadoSincro(sincro, tiempo, 100, 4)

    expect(est.estado).toBe('Iniciando')
    expect(est.compas).toBe(0)
    expect(est.golpeEnCompas).toBe(3)
    expect(est.delay).toBe(1)
  })

  it('GetSincro - Iniciando estado', () => {
    const tiempoinicio = 2000
    const tiempo = tiempoinicio - 1
    const duracionGolpe = 100
    const golpesxcompas = 4
    const sincro = new SincroSesion(tiempoinicio, 0)

    const helper = HelperSincro.getInstance()
    const estadoSincro = helper.GetEstadoSincro(
      sincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
    )
    const sincroRecuperado = helper.GetSincro(
      estadoSincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
      0,
    )

    expect(sincroRecuperado.timeInicio).toBe(tiempoinicio)
  })

  it('GetSincro - Reproduciendo en el medio del compás', () => {
    const tiempoinicio = 5000
    const duracionGolpe = 200
    const golpesxcompas = 4
    const desdeCompas = 0
    const tiempo = tiempoinicio + duracionGolpe * 4 * 3 + duracionGolpe * 2 // 3 compases + 2 golpes
    const sincro = new SincroSesion(tiempoinicio, desdeCompas)

    const helper = HelperSincro.getInstance()
    const estadoSincro = helper.GetEstadoSincro(
      sincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
    )
    const sincroRecuperado = helper.GetSincro(
      estadoSincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
      desdeCompas,
    )

    expect(sincroRecuperado.timeInicio).toBe(tiempoinicio)
  })
  //

  it('GetEstadoSincroMedia - Reproduciendo en el golpe 0', () => {
    const duracionGolpe = 100
    const golpesxcompas = 4
    const tiempoinicio = 350

    const helper = HelperSincro.getInstance()
    const estadoSincro = helper.GetEstadoSincroMedia(
      tiempoinicio,
      duracionGolpe,
      golpesxcompas,
    )
    expect(estadoSincro.compas).toBe(0)
    expect(estadoSincro.golpeEnCompas).toBe(3)
    expect(estadoSincro.delay).toBe(50)
    expect(estadoSincro.estado).toBe('Reproduciendo')
  })

  it('GetSincro - Reproduciendo en el golpe 0', () => {
    const tiempoinicio = 1000
    const duracionGolpe = 100
    const golpesxcompas = 4
    const tiempo = tiempoinicio
    const sincro = new SincroSesion(tiempoinicio, 0)

    const helper = HelperSincro.getInstance()
    const estadoSincro = helper.GetEstadoSincro(
      sincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
    )
    const sincroRecuperado = helper.GetSincro(
      estadoSincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
      0,
    )

    expect(sincroRecuperado.timeInicio).toBe(tiempoinicio)
  })

  it('GetSincro - Con desdeCompas diferente de 0', () => {
    const tiempoinicio = 3000
    const duracionGolpe = 150
    const golpesxcompas = 4
    const desdeCompas = 5
    const tiempo = tiempoinicio + duracionGolpe * 4 * 2 // 2 compases después
    const sincro = new SincroSesion(tiempoinicio, desdeCompas)

    const helper = HelperSincro.getInstance()
    const estadoSincro = helper.GetEstadoSincro(
      sincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
    )
    const sincroRecuperado = helper.GetSincro(
      estadoSincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
      desdeCompas,
    )

    expect(sincroRecuperado.timeInicio).toBe(tiempoinicio)
    expect(sincroRecuperado.desdeCompas).toBe(desdeCompas)
  })

  it('GetSincro - Ciclo completo con múltiples compases', () => {
    const tiempoinicio = 500
    const duracionGolpe = 250
    const golpesxcompas = 4
    const desdeCompas = 1
    const tiempo = tiempoinicio + duracionGolpe * 4 * 15 // 15 compases después
    const sincro = new SincroSesion(tiempoinicio, desdeCompas)

    const helper = HelperSincro.getInstance()
    const estadoSincro = helper.GetEstadoSincro(
      sincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
    )
    const sincroRecuperado = helper.GetSincro(
      estadoSincro,
      tiempo,
      duracionGolpe,
      golpesxcompas,
      desdeCompas,
    )

    expect(sincroRecuperado.timeInicio).toBe(tiempoinicio)
    expect(sincroRecuperado.desdeCompas).toBe(desdeCompas)
  })
})
