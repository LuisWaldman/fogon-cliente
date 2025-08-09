import { MusicaHelper } from './MusicaHelper'
import { describe, it, expect } from 'vitest'

describe('MusicaHelper', () => {
  it('Si esta vacio devuelve 0', () => {
    const helper = new MusicaHelper()
    expect(helper.GetAcordesdeescala('C')).toEqual([
      'C',
      'Dm',
      'Em',
      'F',
      'G',
      'Am',
      'Bdim',
    ])
    expect(helper.GetAcordesdeescala('G')).toEqual([
      'G',
      'Am',
      'Bm',
      'C',
      'D',
      'Em',
      'F#dim',
    ])
    expect(helper.GetAcordesdeescala('Am')).toEqual([
      'Am',
      'Bdim',
      'C',
      'Dm',
      'Em',
      'F',
      'G',
    ])
  })

  it('Posicion en escala', () => {
    const helper = new MusicaHelper()
    expect(helper.PosicionNotaEnEscala(['A'], 'A')).toEqual(0)
    expect(helper.PosicionNotaEnEscala(['A', 'B'], 'A')).toEqual(0)
    expect(helper.PosicionNotaEnEscala(['A', 'B'], 'B')).toEqual(1)
    expect(helper.PosicionNotaEnEscala(['A', 'B', 'C'], 'C')).toEqual(2)
    expect(helper.PosicionNotaEnEscala(['A', 'B', 'C'], 'X')).toEqual(-1)
    expect(helper.PosicionNotaEnEscala(['A', 'B', 'C'], 'B7')).toEqual(1)
    expect(helper.PosicionNotaEnEscala(['A', 'B', 'C'], 'B7/C')).toEqual(1)
    expect(helper.PosicionNotaEnEscala(['A', 'B', 'C'], 'x7/C')).toEqual(-1)
  })
})
