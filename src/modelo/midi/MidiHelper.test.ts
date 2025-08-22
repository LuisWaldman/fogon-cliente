import { describe, it, expect } from 'vitest'
import { MidiHelper } from './MidiHelper'
import { ResumenNotaMidi } from './ResumenNotaMidi'

describe('Helper Midi', () => {
  it('Build Pentagrama Compas', () => {
    const helper = new MidiHelper()
    const notas: ResumenNotaMidi[] = []
    notas.push(new ResumenNotaMidi('C4', 0, 1))
    const compas = helper.GetPentagramaCompas(0, notas)
    expect(compas).toBeDefined()
    expect(compas.notas.length).toBe(1)
    expect(compas.notas[0].length).toBe(1)
    expect(compas.notas[0][0].nota).toBe('C4')
    expect(compas.notas[0][0].duracion).toBe('4')
  })

  it('DuracionCuartosToDuracionNota', () => {
    const helper = new MidiHelper()
    expect(helper.DuracionCuartosToDuracionNota(4)).toBe('1') // Redonda
    expect(helper.DuracionCuartosToDuracionNota(6)).toBe('1d') // Redonda con puntilla

    expect(helper.DuracionCuartosToDuracionNota(2)).toBe('2') // Blanca
    expect(helper.DuracionCuartosToDuracionNota(3)).toBe('2d') // Blanca con puntilla

    expect(helper.DuracionCuartosToDuracionNota(1)).toBe('4') // Negra
    expect(helper.DuracionCuartosToDuracionNota(1.5)).toBe('4d') // Negra con puntilla

    expect(helper.DuracionCuartosToDuracionNota(0.5)).toBe('8') // Corchea
    expect(helper.DuracionCuartosToDuracionNota(0.75)).toBe('8d') // Corchea con puntilla

    expect(helper.DuracionCuartosToDuracionNota(0.25)).toBe('16') // Semicorchea
    expect(helper.DuracionCuartosToDuracionNota(0.375)).toBe('16d') // Semicorchea con puntilla

    expect(helper.DuracionCuartosToDuracionNota(0.125)).toBe('32') // Fusa
    expect(helper.DuracionCuartosToDuracionNota(0.1875)).toBe('32d') // Fusa con puntilla

    expect(helper.DuracionCuartosToDuracionNota(0.0625)).toBe('64') // Semifusa
    expect(helper.DuracionCuartosToDuracionNota(0.09375)).toBe('64d') // Semifusa con puntilla
  })
})
