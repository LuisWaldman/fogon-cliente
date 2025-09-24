import { describe, expect, it } from 'vitest'
import { HelperDisplayAcordesLatino } from './helperDisplayAcordesLatino'

describe('Pruebo HelperDisplayAcordesLatino', () => {
  it('Devuelve acordes en notación latina', () => {
    const helper = HelperDisplayAcordesLatino.getInstance()
    expect(helper.GetAcorde('C')).toBe('Do')
    expect(helper.GetAcorde('C D')).toBe('Do Re')
    expect(helper.GetAcorde('D#')).toBe('Re#')
    expect(helper.GetAcorde('A')).toBe('La')
    expect(helper.GetAcorde('A5')).toBe('La5')
    expect(helper.GetAcorde('A#5')).toBe('La#5')
    expect(helper.GetAcorde('A6')).toBe('La6')
    expect(helper.GetAcorde('A7')).toBe('La7')
    expect(helper.GetAcorde('A A7')).toBe('La La7')
    expect(helper.GetAcorde('Adim7')).toBe('Ladim7')
    expect(helper.GetAcorde('Bb')).toBe('Sib')
  })
})
