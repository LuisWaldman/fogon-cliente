import { describe, it, expect } from 'vitest'
import { SugerenciaAnacrusa } from './sugerenciaAnacrusa'
import { Cancion } from '../cancion/cancion'
import { Acordes, Parte } from '../cancion/acordes'
import { Letra } from '../cancion/letra'

describe('Helper Sinro', () => {
  it('Sugiere si empieza con minusula', () => {
    const acordes = new Acordes(
      [new Parte('Intro', ['C', 'G']), new Parte('Verso', ['Am', 'F', 'G'])],
      [0, 1],
    )
    const letras = new Letra([['dán  recha'], ['Lalala']])
    const cancion = new Cancion('Mi Canción', 'Mi Banda', acordes, letras)
    const ret = SugerenciaAnacrusa.recomendarSugerencias(cancion)
    expect(ret[0].descripcion).toBe('Agregar una anacrusa')
  })

  it('No sugiere si empieza con mayuscula', () => {
    const acordes = new Acordes(
      [new Parte('Intro', ['C', 'G']), new Parte('Verso', ['Am', 'F', 'G'])],
      [0, 1],
    )
    const letras = new Letra([['Lalala']])
    const cancion = new Cancion('Mi Canción', 'Mi Banda', acordes, letras)
    const ret = SugerenciaAnacrusa.recomendarSugerencias(cancion)
    expect(ret.length === 0).toBe(true)
  })
})
