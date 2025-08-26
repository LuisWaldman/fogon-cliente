import { describe, it, expect } from 'vitest'
import { helperEditarAcorde } from './helperEditarAcorde'

describe('helperEditarAcorde', () => {
  it('Clase helperEditarAcorde devuelve nota simple correcta', () => {
    expect(helperEditarAcorde.CorregirAcorde('c')).toBe('C')
    expect(helperEditarAcorde.CorregirAcorde('Cc')).toBe('Cc')
    expect(helperEditarAcorde.CorregirAcorde('BB')).toBe('Bb')
    expect(helperEditarAcorde.CorregirAcorde('bB')).toBe('Bn')
    expect(helperEditarAcorde.CorregirAcorde('fB')).toBe('Fb')
    expect(helperEditarAcorde.CorregirAcorde('gB')).toBe('Gb')
    expect(helperEditarAcorde.CorregirAcorde('bB')).toBe('Bb')
    expect(helperEditarAcorde.CorregirAcorde('F#6')).toBe('F#6')
    expect(helperEditarAcorde.CorregirAcorde('cDIMB7')).toBe('Cdimb7')
    expect(helperEditarAcorde.CorregirAcorde('G#')).toBe('G#')
    expect(helperEditarAcorde.CorregirAcorde('g#')).toBe('G#')
    expect(helperEditarAcorde.CorregirAcorde('gb#')).toBe('Gb#')
    expect(helperEditarAcorde.CorregirAcorde('c')).toBe('C')
    expect(helperEditarAcorde.CorregirAcorde('cDIMB7 gb#')).toBe('Cdimb7 Gb#')
    expect(helperEditarAcorde.CorregirAcorde('c c')).toBe('C C')
  })
})
