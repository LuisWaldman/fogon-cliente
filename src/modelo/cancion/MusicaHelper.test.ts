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
      'Am',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
    ])
    expect(helper.GetNotasdeescala('Dm')).toEqual([
      'Dm',
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
    expect(helper.GetNotasdeacorde('C')).toEqual(['C', 'E', 'G'])
    expect(helper.GetNotasdeacorde('D')).toEqual(['D', 'F#', 'A'])
    expect(helper.GetNotasdeacorde('Am')).toEqual(['A', 'C', 'E'])
    expect(helper.GetNotasdeacorde('A5')).toEqual(['A', 'E'])
    expect(helper.GetNotasdeacorde('D5')).toEqual(['D', 'A'])
    expect(helper.GetNotasdeacorde('C7')).toEqual(['C', 'E', 'G', 'B'])
    expect(helper.GetNotasdeacorde('C6')).toEqual(['C', 'E', 'G', 'A'])
    expect(helper.GetNotasdeacorde('A6')).toEqual(['A', 'C#', 'E', 'F#'])
    expect(helper.GetNotasdeacorde('C4')).toEqual(['C', 'E', 'F', 'G'])
    expect(helper.GetNotasdeacorde('F#4')).toEqual(['F#', 'A#', 'B', 'C#'])

  })
})
