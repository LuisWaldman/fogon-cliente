import { describe, expect, it } from 'vitest'
import { InstrumentoLineasCompasBuildHelperBajo } from './InstrumentoLineasCompasBuildHelperBajo'

describe('InstrumentoLineasCompasBuildHelperBajo', () => {
  describe('getAcorde', () => {
    it('debe crear un compás con el acorde C correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('C', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      expect(compas.valorGolpePorLinea[2][0]).toBe('3') // A (3er traste) = C
    })

    it('debe crear un compás con el acorde D correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('D', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      // D al aire en la cuerda D
    })

    it('debe crear un compás con el acorde E correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('E', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      expect(compas.valorGolpePorLinea[1][0]).toBe('2') // D (2do traste) = E
    })

    it('debe crear un compás con el acorde A correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('A', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      // A al aire
    })

    it('debe crear un compás con el acorde G correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('G', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      // G al aire
    })

    it('debe crear un compás con el acorde Em correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('Em', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      expect(compas.valorGolpePorLinea[1][0]).toBe('2')
    })

    it('debe crear un compás con el acorde Am correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('Am', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      // A al aire
    })

    it('debe crear un compás con el acorde Dm correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('Dm', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      // D al aire
    })

    it('debe crear un compás con el acorde F correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('F', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      expect(compas.valorGolpePorLinea[3][0]).toBe('1') // E (1er traste) = F
    })

    it('debe crear un compás con el acorde Bm correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('Bm', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      expect(compas.valorGolpePorLinea[2][0]).toBe('2') // A (2do traste) = B
    })

    it('debe crear un compás con el acorde E7 correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('E7', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      // E al aire
    })

    it('debe crear un compás con el acorde A7 correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('A7', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      // A al aire
    })

    it('debe crear un compás con la cantidad de compases especificada', () => {
      const compas2 = InstrumentoLineasCompasBuildHelperBajo.getAcorde('C', 2)
      const compas8 = InstrumentoLineasCompasBuildHelperBajo.getAcorde('D', 8)

      expect(compas2.valorGolpePorLinea[0].length).toBe(2)
      expect(compas8.valorGolpePorLinea[0].length).toBe(8)
    })

    it('debe manejar acordes desconocidos sin errores', () => {
      const compas = InstrumentoLineasCompasBuildHelperBajo.getAcorde('X', 4)

      expect(compas.valorGolpePorLinea.length).toBe(4)
      expect(compas.valorGolpePorLinea[0].length).toBe(4)
    })
  })
})
