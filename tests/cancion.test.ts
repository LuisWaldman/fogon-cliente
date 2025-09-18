import { Cancion } from '../src/modelo/cancion/cancion'
import { Acordes, Parte } from '../src/modelo/cancion/acordes'
import { Letra } from '../src/modelo/cancion/letra'
import { describe, it, expect } from 'vitest'

describe('Cancion', () => {
  it('debería calcular correctamente duracionCompas', () => {
    const acordes = new Acordes([new Parte('Intro', ['C', 'G'])], [0])
    const letras = new Letra([['lalala']])
    const cancion = new Cancion(
      'Mi Canción',
      'Mi Banda',
      acordes,
      letras,
      120,
      1,
      4,
      4,
      'C',
    )
    expect(cancion.duracionCompas).toBeCloseTo(2)
  })

  it('debería calcular correctamente totalCompases', () => {
    const acordes = new Acordes(
      [new Parte('Intro', ['C', 'G']), new Parte('Verso', ['Am', 'F', 'G'])],
      [0, 1],
    )
    const letras = new Letra([['lalala']])
    const cancion = new Cancion('Mi Canción', 'Mi Banda', acordes, letras)
    expect(cancion.totalCompases).toBe(5)
  })

  it('debería calcular correctamente duracionCancion', () => {
    const acordes = new Acordes(
      [new Parte('Intro', ['C', 'G']), new Parte('Verso', ['Am', 'F', 'G'])],
      [0, 1],
    )
    const letras = new Letra([['lalala']])
    const cancion = new Cancion(
      'Mi Canción',
      'Mi Banda',
      acordes,
      letras,
      60,
      1,
      4,
      4,
      'C',
    )
    // duracionCompas = (60/60)*4 = 4, totalCompases = 5, duracionCancion = 20
    expect(cancion.duracionCancion).toBe(20)
  })
})
