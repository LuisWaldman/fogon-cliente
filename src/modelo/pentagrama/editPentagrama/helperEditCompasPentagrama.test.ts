import { describe, expect, it } from 'vitest'
import { Pentagrama } from '../../cancion/pentagrama'
import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import type { EditCompasPentagrama } from './editCompasPentagrama'
import { HelperEditPentagrama } from './helperEditCompasPentagrama'
import { EditAcordePentagrama } from './editAcordePentagrama'

describe('Helper Pentagrama', () => {
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
    expect(acorde.notas[3]).toBe('B4')
  })

  it('Acordes de 5', () => {
    const acorde = new EditAcordePentagrama('C5')
    expect(acorde.notas.length).toBe(2)
    expect(acorde.notas[0]).toBe('C4')
    expect(acorde.notas[1]).toBe('G4')
  })

  it('Acordes de 5', () => {
    const acorde = new EditAcordePentagrama('C5')
    expect(acorde.notas.length).toBe(2)
    expect(acorde.notas[0]).toBe('C4')
    expect(acorde.notas[1]).toBe('G4')
  })

  it('Actualizar ritmo', () => {
    const penta = new Pentagrama()
    penta.clave = 'treble'
    const acorde1: PentagramaNotas[] = []
    acorde1.push(new PentagramaNotas('C3', '4'))
    const compas = new PentagramaCompas([])
    compas.notas.push(acorde1)
    const helper = new HelperEditPentagrama()
    const retEdit: EditCompasPentagrama = helper.getDisplayEditCompas(compas)
    // Compás vacío → se completa con una blanca
    retEdit.ritmo = []
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['1'])

    // Ya tiene una blanca → no se agrega nada
    retEdit.ritmo = ['1']
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['1'])

    // Media blanca → se completa con otra igual
    retEdit.ritmo = ['2']
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['2', '2'])

    // Media blanca → se completa con otra igual
    retEdit.ritmo = ['4', '4', '2']
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['4', '4', '2'])

    // Ya está completo con dos medias
    retEdit.ritmo = ['2', '2']
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['2', '2'])

    // Media + negra → falta 1/4 → se completa con otra negra
    retEdit.ritmo = ['2', '4']
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['2', '4', '4'])

    // Solo una negra → falta 3/4 → se completa con otra negra y una media
    retEdit.ritmo = ['4']
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['4', '2', '4'])

    // Negra con puntillo (6) → falta 1/8 → se completa con corchea
    retEdit.ritmo = ['6']
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['6', '2', '4', '16'])

    // Dos corcheas → falta 3/4 → se completa con blanca
    retEdit.ritmo = ['8', '8']
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['8', '8', '2', '4'])

    // Tres negras → suma 3/4 → se completa con una media
    retEdit.ritmo = ['4', '4', '4']
    retEdit.CompletarRitmo()
    expect(retEdit.ritmo).toEqual(['4', '4', '4', '4'])
  })
})
