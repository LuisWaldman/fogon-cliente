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
    expect(retEdit.notas.length).toBe(1)
    expect(retEdit.notas).toStrictEqual(['C3'])

    const acorde2 = helper.getCompas(retEdit)
    expect(acorde2.notas.length > 0).toBe(true)
    expect(acorde2.notas[0].length).toBe(1)
    expect(acorde2.notas[0][0].duracion).toBe('4')
    expect(acorde2.notas[0][0].nota).toBe('C3')
  })

  it('Un compas con 2 notas y puntillo', () => {
    const penta = new Pentagrama()
    penta.clave = 'treble'
    const acorde1: PentagramaNotas[] = []
    acorde1.push(new PentagramaNotas('C3', '2d'))
    const acorde2: PentagramaNotas[] = []
    acorde2.push(new PentagramaNotas('C3', '4'))
    const compas = new PentagramaCompas([])
    compas.notas.push(acorde1)
    compas.notas.push(acorde2)
    const helper = new HelperEditPentagrama()
    const retEdit: EditCompasPentagrama = helper.getDisplayEditCompas(compas)
    expect(retEdit.notas.length).toBe(1)
    expect(retEdit.notas).toStrictEqual(['C3'])

    const Obtenido = helper.getCompas(retEdit)
    expect(Obtenido.notas.length > 0).toBe(true)
    expect(Obtenido.notas[0].length).toBe(1)
    expect(Obtenido.notas[0][0].duracion).toBe('2d')
    expect(Obtenido.notas[0][0].nota).toBe('C3')
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
    expect(retEdit.notas.length).toEqual(1)
    expect(retEdit.ritmo[0]).toEqual('4')
    expect(retEdit.notas[0]).toEqual('D3')
  })
})
