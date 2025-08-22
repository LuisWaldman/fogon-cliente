import { describe, it, expect } from 'vitest'
import { Acordes, Parte } from '../cancion/acordes'
import { Cancion } from '../cancion/cancion'
import { Letra } from '../cancion/letra'
import { HelperPentagramas } from './helperPentagramas'

describe('Helper Pentagrama', () => {
  it('Cancion simple de 5 acordes', () => {
    const helper = new HelperPentagramas()
    const acordes = new Acordes(
      [new Parte('Intro', ['C', 'G']), new Parte('Verso', ['Am', 'F', 'G'])],
      [0, 1],
    )
    const letras = new Letra([['dán  recha'], ['Lalala']])
    const cancion = new Cancion('Mi Canción', 'Mi Banda', acordes, letras)
    cancion.pentagramas.push(helper.creaPentagrama(cancion))
    const display = helper.creaDisplayPentagrama(cancion)
    let totalAcordes = 0
    display.renglones.forEach((renglon) => {
      totalAcordes += renglon.pentagramas[0].compases.length
    })

    expect(totalAcordes).toBe(5)
  })
})
