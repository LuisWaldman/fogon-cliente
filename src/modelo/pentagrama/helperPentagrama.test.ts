import { describe, it } from 'vitest'
import { Acordes, Parte } from '../cancion/acordes'
import { Letra } from '../cancion/letra'
import { Cancion } from '../cancion/cancion'
import { Pentagrama } from '../cancion/pentagrama'

describe('Helper Pentagrama', () => {
  it('Cancion simple de 5 acordes', () => {
    const acordes = new Acordes([new Parte('Intro', ['C'])], [0])
    const letras = new Letra([['dán  recha'], ['Lalala']])
    const cancion = new Cancion('Mi Canción', 'Mi Banda', acordes, letras)
    cancion.pentagramas[0] = Pentagrama.GetPentagramaDefault(1)
    cancion.escala = 'C'
  })
})
