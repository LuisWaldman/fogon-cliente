import { describe, it, expect } from 'vitest'
import { HelperMusica } from './HelperMusica'

describe('Example test', () => {
  it('Clase HelperMusica devuelve nota simple correcta', () => {
    expect(HelperMusica.getNotaSimple('c')).toBe('C')
    expect(HelperMusica.getNotaSimple('C')).toBe('C')
    expect(HelperMusica.getNotaSimple('y')).toBe('?')
    expect(HelperMusica.getNotaSimple('r')).toBe('?')
    expect(HelperMusica.getNotaSimple('e')).toBe('E')
    expect(HelperMusica.getNotaSimple('eM')).toBe('Em')
    expect(HelperMusica.getNotaSimple('EM')).toBe('Em')
    expect(HelperMusica.getNotaSimple('f#m')).toBe('F#m')
    expect(HelperMusica.getNotaSimple('G#M')).toBe('G#m')
    expect(HelperMusica.getNotaSimple('G#')).toBe('G#')
    expect(HelperMusica.getNotaSimple('Gbm')).toBe('Gbm')
    expect(HelperMusica.getNotaSimple('GbM')).toBe('Gbm')
  })

  it('Clase HelperMusica devuelve nota correcta', () => {
    expect(HelperMusica.getNota('c')).toBe('C')
    expect(HelperMusica.getNota('C')).toBe('C')
    expect(HelperMusica.getNota('y')).toBe('?')
    expect(HelperMusica.getNota('r')).toBe('?')
    expect(HelperMusica.getNota('e')).toBe('E')
    expect(HelperMusica.getNota('eM')).toBe('Em')
    expect(HelperMusica.getNota('EM')).toBe('Em')
    expect(HelperMusica.getNota('f#m')).toBe('F#m')
    expect(HelperMusica.getNota('G#M')).toBe('G#m')
    expect(HelperMusica.getNota('G#')).toBe('G#')
    expect(HelperMusica.getNota('G#m')).toBe('G#m')
    expect(HelperMusica.getNota('G#M')).toBe('G#m')
    expect(HelperMusica.getNota('G#M/c')).toBe('G#m/C')
  })
})
