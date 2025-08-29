import { describe, expect, it } from 'vitest'
import { Pentagrama } from '../../cancion/pentagrama'
import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import type { EditCompasPentagrama } from './editCompasPentagrama'
import { HelperEditPentagrama } from './helperEditCompasPentagrama'
import { EditAcordePentagrama } from './editAcordePentagrama'

describe('Helper Pentagrama', () => {
  it('Cancion de una sola nota', () => {
    const penta = new Pentagrama()
    penta.clave = 'treble'
    const acorde1: PentagramaNotas[] = []
    acorde1.push(new PentagramaNotas('C3', '4'))
    const compas = new PentagramaCompas([])
    compas.notas.push(acorde1)
    const helper = new HelperEditPentagrama()
    const retEdit: EditCompasPentagrama = helper.getDisplayEditCompas(
      compas,
      'C',
    )
    expect(retEdit.acorde.octava).toBe(3)
    expect(retEdit.ritmo.length).toBe(1)
    expect(retEdit.ritmo[0]).toBe(4)
    expect(retEdit.acorde.acorde).toBe('C')
    expect(retEdit.acordespatron.length).toBe(1)
    expect(retEdit.acordespatron[0].patrones.length).toBe(3)
    expect(retEdit.acordespatron[0].patrones[0]).toBe('o')
    expect(retEdit.acordespatron[0].patrones[1]).toBe('x')
    expect(retEdit.acordespatron[0].patrones[2]).toBe('x')
  })

  it('Cancion de una sola nota ida y vuelta', () => {
    const penta = new Pentagrama()
    penta.clave = 'treble'
    const acorde1: PentagramaNotas[] = []
    acorde1.push(new PentagramaNotas('C3', '4'))
    const compas = new PentagramaCompas([])
    compas.notas.push(acorde1)
    const helper = new HelperEditPentagrama()
    const retEdit: EditCompasPentagrama = helper.getDisplayEditCompas(
      compas,
      'C',
    )
    const compas2 = helper.getCompas(retEdit)
    expect(compas2.notas.length).toBe(compas.notas.length)
    expect(compas2.notas[0].length).toBe(compas.notas[0].length)
  })

  it('Crea acorde edit', () => {
    let acorde = new EditAcordePentagrama('C')
    expect(acorde.notas.length).toBe(3)
    expect(acorde.notas[0]).toBe('C4')
    expect(acorde.notas[1]).toBe('E4')
    expect(acorde.notas[2]).toBe('G4')
    acorde = new EditAcordePentagrama('A')
    expect(acorde.notas.length).toBe(3)
    expect(acorde.notas[0]).toBe('A4')
    expect(acorde.notas[1]).toBe('C#5')
    expect(acorde.notas[2]).toBe('E5')
    acorde = new EditAcordePentagrama('Em')
    expect(acorde.notas.length).toBe(3)
    expect(acorde.notas[0]).toBe('E4')
    expect(acorde.notas[1]).toBe('G4')
    expect(acorde.notas[2]).toBe('B4')
    acorde = new EditAcordePentagrama('A#')
    expect(acorde.notas.length).toBe(3)
    expect(acorde.notas[0]).toBe('A#4')
    expect(acorde.notas[1]).toBe('D5')
    expect(acorde.notas[2]).toBe('F5')
  })

  it('Acordes con 7, 9, 11', () => {
    const acorde = new EditAcordePentagrama('C7')
    expect(acorde.notas.length).toBe(4)
    expect(acorde.notas[0]).toBe('C4')
    expect(acorde.notas[1]).toBe('E4')
    expect(acorde.notas[2]).toBe('G4')
    expect(acorde.addNota).toBe('B4')
  })

  it('Acordes de 5', () => {
    const acorde = new EditAcordePentagrama('C5')
    expect(acorde.notas.length).toBe(3)
    expect(acorde.notas[0]).toBe('C4')
    expect(acorde.notas[1]).toBe('E4')
    expect(acorde.notas[2]).toBe('G4')
    expect(acorde.tiene3).toBe(false)
  })
})
