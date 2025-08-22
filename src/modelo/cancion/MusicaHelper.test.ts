import { MusicaHelper } from './MusicaHelper'
import { describe, it, expect } from 'vitest'

describe('MusicaHelper', () => {
  it('Notas de la escala', () => {
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
  it('GetNotasdeescala returns correct notes for different scales', () => {
    const helper = new MusicaHelper()

    expect(helper.GetNotasdeescala('C')).toEqual([
      'C',
      'D',
      'E',
      'F',
      'G',
      'A',
      'B',
    ])
    expect(helper.GetNotasdeescala('G')).toEqual([
      'G',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F#',
    ])
    expect(helper.GetNotasdeescala('Am')).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
    ])
    expect(helper.GetNotasdeescala('Dm')).toEqual([
      'D',
      'E',
      'F',
      'G',
      'A',
      'A#',
      'C',
    ])

    // Edge cases
    expect(helper.GetNotasdeescala('')).toEqual([])
    expect(helper.GetNotasdeescala(undefined)).toEqual([])
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
  it('Acordes de escala', () => {
    const helper = new MusicaHelper()
    expect(
      helper.GetNotaNuevaEscala('C', ['C', 'D', 'E'], ['D', 'E', 'F']),
    ).toEqual('D')

    expect(
      helper.GetNotaNuevaEscala('C7', ['C', 'D', 'E'], ['D', 'E', 'F']),
    ).toEqual('D7')
    expect(
      helper.GetNotaNuevaEscala('C#', ['C', 'D', 'E'], ['D', 'E', 'F']),
    ).toEqual('D#')
  })

  it('Notas del compas', () => {
    const helper = new MusicaHelper()
    expect(helper.GetNotasdeacorde('C', 4)).toEqual(['C4', 'E4', 'G4'])
    expect(helper.GetNotasdeacorde('D', 4)).toEqual(['D4', 'F#4', 'A4'])
    expect(helper.GetNotasdeacorde('Am', 3)).toEqual(['A3', 'C4', 'E4'])
    expect(helper.GetNotasdeacorde('A5', 4)).toEqual(['A4', 'E5'])
    expect(helper.GetNotasdeacorde('D5', 3)).toEqual(['D3', 'A3'])
    expect(helper.GetNotasdeacorde('C7', 3)).toEqual(['C3', 'E3', 'G3', 'B3'])
    expect(helper.GetNotasdeacorde('C6', 3)).toEqual(['C3', 'E3', 'G3', 'A3'])
    expect(helper.GetNotasdeacorde('A6', 4)).toEqual(['A4', 'C#5', 'E5', 'F#5'])
    expect(helper.GetNotasdeacorde('C4', 4)).toEqual(['C4', 'E4', 'F4', 'G4'])
    expect(helper.GetNotasdeacorde('F#4', 4)).toEqual([
      'F#4',
      'A#4',
      'B4',
      'C#5',
    ])
    expect(helper.GetNotasdeacorde('C9', 4)).toEqual(['C4', 'E4', 'G4', 'B5'])
  })
})
