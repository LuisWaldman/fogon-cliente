import { describe, expect, it } from 'vitest'
import { Pentagrama } from '../../cancion/pentagrama'
import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import { HelperEditPentagrama } from './helperEditCompasPentagrama'
import type { EditCompasPentagrama } from './editCompasPentagrama'

describe('Helper Pentagrama', () => {
  it('Cancion de una sola nota', () => {
    const penta = new Pentagrama()
    penta.clave = 'treble'
    const acorde1: PentagramaNotas[] = []
    acorde1.push(new PentagramaNotas('C3', '4'))
    const compas = new PentagramaCompas([])
    compas.notas.push(acorde1)
    const helper = new HelperEditPentagrama()
    const retEdit: EditCompasPentagrama = helper.getDisplayEditCompas(compas)
    expect(retEdit.notas).toBe(1)
    expect(retEdit.notas).toStrictEqual(['C3'])
    expect(retEdit.patron).toBe([true])

    const acorde2 = helper.getCompas(retEdit)
    expect(acorde2.notas.length > 0).toBe(true)
    expect(acorde2.notas[0].length).toBe(1)
    expect(acorde2.notas[0][0].duracion).toBe('4')
    expect(acorde2.notas[0][0].nota).toBe('C4')
  })

  it('Cancion de una sola nota fuera del acorde', () => {
    const penta = new Pentagrama()
    penta.clave = 'treble'
    const acorde1: PentagramaNotas[] = []
    acorde1.push(new PentagramaNotas('D3', '4'))
    const compas = new PentagramaCompas([])
    compas.notas.push(acorde1)
    const helper = new HelperEditPentagrama()
    const retEdit: EditCompasPentagrama = helper.getDisplayEditCompas(compas)
    expect(retEdit.notas).toBe(1)
    expect(retEdit.ritmo[0]).toBe(4)
    expect(retEdit.notas[0]).toBe('C')
  })
})
