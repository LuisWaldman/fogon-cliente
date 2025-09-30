import { describe, it, expect } from 'vitest'
import { MidiHelper } from './MidiHelper'
import { ResumenNotaMidi } from './ResumenNotaMidi'
import { PentagramaNotas } from '../cancion/pentagramanotas'

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

  it('Suma de MIDIS', () => {
    const helper = new MidiHelper()
    expect(helper.SumarMidisDuracion('2n.', '4n')).toBe('1n')
    expect(helper.SumarMidisDuracion('2n.', '4n')).toBe('1n') // 3 + 1 = 4 negras → redonda
    expect(helper.SumarMidisDuracion('4n.', '8n')).toBe('2n') // 1.5 + 0.5 = 2 negras → blanca
    expect(helper.SumarMidisDuracion('8n.', '16n')).toBe('4n') // 0.75 + 0.25 = 1 negra → negra
    expect(helper.SumarMidisDuracion('16n.', '16n')).toBe('8n') // 0.375 + 0.25 = 0.625 → redondea a corchea
    expect(helper.SumarMidisDuracion('2n', '2n')).toBe('1n') // 2 + 2 = 4 negras → redonda
    expect(helper.SumarMidisDuracion('4n', '4n')).toBe('2n') // 1 + 1 = 2 negras → blanca
    expect(helper.SumarMidisDuracion('8n', '8n')).toBe('4n') // 0.5 + 0.5 = 1 negra → negra
    expect(helper.SumarMidisDuracion('16n', '16n')).toBe('8n') // 0.25 + 0.25 = 0.5 → corcheas

    /*
    2n. + 4n 
    
    '1': '1n', // redonda
    '2': '2n', // blanca
    '4': '4n', // negra
    q: '4n', // negra
    '8': '8n', // corchea
    '16': '16n', // semicorchea
    '32': '32n', // fusa
    '64': '64n', // semifusa
    '128': '128n', // garrapatea
    '4d': '4n.', // negra con puntillo
    '2d': '2n.', // blanca con puntillo
    qd: '4n.', // negra con puntillo
    '8d': '8n.', // corchea con puntillo
    '16d': '16n.', // semicorchea con puntillo
    */
  })

  it('Tiempo de la nota', () => {
    const helper = new MidiHelper()
    helper.parteCompas = 0
    expect(helper.GetTiempoMidi(0)).toBe('0:0:0')
    expect(helper.GetTiempoMidi(1)).toBe('1:0:0')
    helper.parteCompas = 0.25
    expect(helper.GetTiempoMidi(0)).toBe('0:1:0')
    expect(helper.GetTiempoMidi(1)).toBe('1:1:0')
    helper.parteCompas = 0.5
    expect(helper.GetTiempoMidi(0)).toBe('0:2:0')
    expect(helper.GetTiempoMidi(1)).toBe('1:2:0')
    helper.parteCompas = 0.75
    expect(helper.GetTiempoMidi(0)).toBe('0:3:0')
    expect(helper.GetTiempoMidi(1)).toBe('1:3:0')

    helper.parteCompas = 0.375
    expect(helper.GetTiempoMidi(0)).toBe('0:1:2') // si usás divisorCuarto = 4
  })

  it('ActualizarTiempos suma la duración mínima a parteCompas', () => {
    let helper = new MidiHelper()

    helper.parteCompas = 0
    helper.ActualizarTiempos([])
    expect(helper.parteCompas).toBe(0)

    helper = new MidiHelper()
    helper.parteCompas = 0
    helper.ActualizarTiempos([new PentagramaNotas('C4', '4')]) // negra = 1/4
    expect(helper.parteCompas).toBeCloseTo(0.25)

    helper = new MidiHelper()
    helper.parteCompas = 0.25
    helper.ActualizarTiempos([
      new PentagramaNotas('C4', '2'), // blanca = 1/2
      new PentagramaNotas('D4', '8'), // corchea = 1/8
    ])
    expect(helper.parteCompas).toBeCloseTo(0.375) // 0.25 + 0.125

    helper = new MidiHelper()
    helper.parteCompas = 0.375
    helper.ActualizarTiempos([
      new PentagramaNotas('C4', '16'), // semicorchea = 1/16
      new PentagramaNotas('D4', '4'), // negra = 1/4
    ])
    expect(helper.parteCompas).toBeCloseTo(0.4375) // 0.375 + 0.0625

    helper = new MidiHelper()
    helper.parteCompas = 0.4375
    helper.ActualizarTiempos([
      new PentagramaNotas('C4', '4.'),
      new PentagramaNotas('D4', '2'),
    ])
    expect(helper.parteCompas).toBeCloseTo(0.6875) // 0.4375 + 0.25 * 1.5
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
