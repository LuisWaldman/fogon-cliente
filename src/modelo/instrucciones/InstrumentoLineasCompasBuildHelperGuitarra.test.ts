import { describe, expect, it } from 'vitest'
import { InstrumentoLineasCompasBuildHelperGuitarra } from './InstrumentoLineasCompasBuildHelperGuitarra'

describe('InstrumentoLineasCompasBuildHelperGuitarra', () => {
  describe('getAcorde', () => {
    it('debe crear un compás con el acorde C correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('C', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[1][0]).toBe('1')
      expect(compas.valorGolpePorLinea[2][0]).toBe('2')
      expect(compas.valorGolpePorLinea[4][0]).toBe('3')
    })

    it('debe crear un compás con el acorde D correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('D', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[0][0]).toBe('2')
      expect(compas.valorGolpePorLinea[1][0]).toBe('3')
      expect(compas.valorGolpePorLinea[2][0]).toBe('2')
    })

    it('debe crear un compás con el acorde E correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('E', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[2][0]).toBe('1')
      expect(compas.valorGolpePorLinea[3][0]).toBe('2')
      expect(compas.valorGolpePorLinea[4][0]).toBe('2')
    })

    it('debe crear un compás con el acorde A correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('A', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[1][0]).toBe('2')
      expect(compas.valorGolpePorLinea[2][0]).toBe('2')
      expect(compas.valorGolpePorLinea[3][0]).toBe('2')
    })

    it('debe crear un compás con el acorde G correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('G', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[0][0]).toBe('3')
      expect(compas.valorGolpePorLinea[4][0]).toBe('2')
      expect(compas.valorGolpePorLinea[5][0]).toBe('3')
    })

    it('debe crear un compás con el acorde Em correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('Em', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[3][0]).toBe('2')
      expect(compas.valorGolpePorLinea[4][0]).toBe('2')
    })

    it('debe crear un compás con el acorde Am correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('Am', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[1][0]).toBe('1')
      expect(compas.valorGolpePorLinea[2][0]).toBe('2')
      expect(compas.valorGolpePorLinea[3][0]).toBe('2')
    })

    it('debe crear un compás con el acorde Dm correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('Dm', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[0][0]).toBe('1')
      expect(compas.valorGolpePorLinea[1][0]).toBe('3')
      expect(compas.valorGolpePorLinea[2][0]).toBe('2')
    })

    it('debe crear un compás con el acorde F correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('F', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[2][0]).toBe('2')
      expect(compas.valorGolpePorLinea[3][0]).toBe('3')
    })

    it('debe crear un compás con el acorde Bm correctamente', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('Bm', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[1][0]).toBe('2')
      expect(compas.valorGolpePorLinea[2][0]).toBe('3')
      expect(compas.valorGolpePorLinea[3][0]).toBe('3')
    })

    it('debe crear un compás con la cantidad de compases especificada', () => {
      const compas2 = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('C', 2)
      const compas8 = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('D', 8)

      expect(compas2.valorGolpePorLinea[0].length).toBe(2)
      expect(compas8.valorGolpePorLinea[0].length).toBe(8)
    })

    it('debe manejar acordes desconocidos sin errores', () => {
      const compas = InstrumentoLineasCompasBuildHelperGuitarra.getAcorde('X', 4)

      expect(compas.valorGolpePorLinea.length).toBe(6)
      expect(compas.valorGolpePorLinea[0].length).toBe(4)
    })
  })
})
