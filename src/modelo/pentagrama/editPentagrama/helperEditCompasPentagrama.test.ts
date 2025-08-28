import { describe, expect, it } from 'vitest'
import { Pentagrama } from '../../cancion/pentagrama'
import { PentagramaCompas } from '../../cancion/pentagramacompas'
import { PentagramaNotas } from '../../cancion/pentagramanotas'
import { assert } from 'console'
import type { EditCompasPentagrama } from './editCompasPentagrama'
import { HelperEditPentagrama } from './helperEditCompasPentagrama'

describe('Helper Pentagrama', () => {
  it('Cancion de una sola nota', () => {
    const penta = new Pentagrama()
    penta.clave = 'treble'
    const acorde1: PentagramaNotas[] = []
    acorde1.push(new PentagramaNotas('C4', '4'))
    const compas = new PentagramaCompas([])
    compas.notas.push(acorde1)
    const helper = new HelperEditPentagrama()
    const retEdit: EditCompasPentagrama = helper.getDisplay(compas)
    expect(retEdit.ritmo.length).toBe(1)
    expect(retEdit.ritmo[0]).toBe(4)
  })
})
