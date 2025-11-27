import { describe, expect, it } from 'vitest'
import { InstrumentoLineasCompasBuildHelperUkelele } from './InstrumentoLineasCompasBuildHelperHukelele'

describe('InstrumentoLineasCompasBuildHelperUkelele', () => {
  it('debería tener 4 líneas para ukelele estándar', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('C', 1)
    expect(compas.valorGolpePorLinea.length).toBe(4)
  })

  it('debería crear acorde de C correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('C', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('0')
    expect(compas.valorGolpePorLinea[1][0]).toBe('0')
    expect(compas.valorGolpePorLinea[2][0]).toBe('0')
    expect(compas.valorGolpePorLinea[3][0]).toBe('3')
  })

  it('debería crear acorde de E correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('E', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('2')
    expect(compas.valorGolpePorLinea[1][0]).toBe('4')
    expect(compas.valorGolpePorLinea[2][0]).toBe('4')
    expect(compas.valorGolpePorLinea[3][0]).toBe('4')
  })

  it('debería crear acorde de A correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('A', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('2')
    expect(compas.valorGolpePorLinea[1][0]).toBe('1')
    expect(compas.valorGolpePorLinea[2][0]).toBe('0')
    expect(compas.valorGolpePorLinea[3][0]).toBe('0')
  })

  it('debería crear acorde de G correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('G', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('0')
    expect(compas.valorGolpePorLinea[1][0]).toBe('2')
    expect(compas.valorGolpePorLinea[2][0]).toBe('3')
    expect(compas.valorGolpePorLinea[3][0]).toBe('0')
  })

  it('debería crear acorde de D correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('D', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('2')
    expect(compas.valorGolpePorLinea[1][0]).toBe('2')
    expect(compas.valorGolpePorLinea[2][0]).toBe('2')
    expect(compas.valorGolpePorLinea[3][0]).toBe('0')
  })

  it('debería crear acorde de Em correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('Em', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('0')
    expect(compas.valorGolpePorLinea[1][0]).toBe('4')
    expect(compas.valorGolpePorLinea[2][0]).toBe('3')
    expect(compas.valorGolpePorLinea[3][0]).toBe('2')
  })

  it('debería crear acorde de Am correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('Am', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('0')
    expect(compas.valorGolpePorLinea[1][0]).toBe('0')
    expect(compas.valorGolpePorLinea[2][0]).toBe('0')
    expect(compas.valorGolpePorLinea[3][0]).toBe('2')
  })

  it('debería crear acorde de Dm correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('Dm', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('1')
    expect(compas.valorGolpePorLinea[1][0]).toBe('2')
    expect(compas.valorGolpePorLinea[2][0]).toBe('2')
    expect(compas.valorGolpePorLinea[3][0]).toBe('0')
  })

  it('debería crear acorde de F correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('F', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('1')
    expect(compas.valorGolpePorLinea[1][0]).toBe('0')
    expect(compas.valorGolpePorLinea[2][0]).toBe('0')
    expect(compas.valorGolpePorLinea[3][0]).toBe('2')
  })

  it('debería crear acorde de Bm correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('Bm', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('0')
    expect(compas.valorGolpePorLinea[1][0]).toBe('2')
    expect(compas.valorGolpePorLinea[2][0]).toBe('3')
    expect(compas.valorGolpePorLinea[3][0]).toBe('4')
  })

  it('debería crear acorde de E7 correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('E7', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('2')
    expect(compas.valorGolpePorLinea[1][0]).toBe('1')
    expect(compas.valorGolpePorLinea[2][0]).toBe('2')
    expect(compas.valorGolpePorLinea[3][0]).toBe('0')
  })

  it('debería crear acorde de A7 correctamente', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('A7', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('0')
    expect(compas.valorGolpePorLinea[1][0]).toBe('1')
    expect(compas.valorGolpePorLinea[2][0]).toBe('0')
    expect(compas.valorGolpePorLinea[3][0]).toBe('0')
  })

  it('debería manejar acordes desconocidos con cuerdas al aire', () => {
    const compas = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('X', 1)
    expect(compas.valorGolpePorLinea[0][0]).toBe('0')
    expect(compas.valorGolpePorLinea[1][0]).toBe('0')
    expect(compas.valorGolpePorLinea[2][0]).toBe('0')
    expect(compas.valorGolpePorLinea[3][0]).toBe('0')
  })

  it('debería crear compases con cantidad variable', () => {
    const compas1 = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('C', 1)
    expect(compas1.valorGolpePorLinea[0].length).toBe(1)

    const compas4 = InstrumentoLineasCompasBuildHelperUkelele.getAcorde('C', 4)
    expect(compas4.valorGolpePorLinea[0].length).toBe(4)
  })
})
