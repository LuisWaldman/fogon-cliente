import { describe, expect, it } from 'vitest'
import { AcordesUkeleleHelper } from './AcordesUkeleleHelper'

describe('Pruebo Los acordes de ukelele', () => {
  describe('GetAcorde - Devuelve acordes de ukelele', () => {
    it('debe devolver el acorde C correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('C')
      expect(acorde.acorde).toBe('C')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('0')
      expect(acorde.cuerda[2]).toBe('0')
      expect(acorde.cuerda[3]).toBe('3')
    })

    it('debe devolver el acorde E correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('E')
      expect(acorde.acorde).toBe('E')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('2')
      expect(acorde.cuerda[1]).toBe('4')
      expect(acorde.cuerda[2]).toBe('4')
      expect(acorde.cuerda[3]).toBe('4')
    })

    it('debe devolver el acorde A correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('A')
      expect(acorde.acorde).toBe('A')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('2')
      expect(acorde.cuerda[1]).toBe('1')
      expect(acorde.cuerda[2]).toBe('0')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde Em correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Em')
      expect(acorde.acorde).toBe('Em')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('4')
      expect(acorde.cuerda[2]).toBe('3')
      expect(acorde.cuerda[3]).toBe('2')
    })

    it('debe devolver el acorde Am correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Am')
      expect(acorde.acorde).toBe('Am')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('0')
      expect(acorde.cuerda[2]).toBe('0')
      expect(acorde.cuerda[3]).toBe('2')
    })

    it('debe devolver el acorde Bm correctamente con cejilla', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Bm')
      expect(acorde.acorde).toBe('Bm')
      expect(acorde.cejilla).toBe(2)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('3')
      expect(acorde.cuerda[3]).toBe('4')
    })

    it('debe devolver un acorde con todas las cuerdas en 0 para un acorde desconocido', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('X')
      expect(acorde.acorde).toBe('X')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda).toEqual(['0', '0', '0', '0'])
    })

    it('debe devolver el acorde D correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('D')
      expect(acorde.acorde).toBe('D')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('2')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde G correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('G')
      expect(acorde.acorde).toBe('G')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('3')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde Dm correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Dm')
      expect(acorde.acorde).toBe('Dm')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('1')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde F correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('F')
      expect(acorde.acorde).toBe('F')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('1')
      expect(acorde.cuerda[1]).toBe('0')
      expect(acorde.cuerda[2]).toBe('0')
      expect(acorde.cuerda[3]).toBe('2')
    })

    it('debe devolver el acorde B7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('B7')
      expect(acorde.acorde).toBe('B7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('2')
      expect(acorde.cuerda[1]).toBe('3')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde C7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('C7')
      expect(acorde.acorde).toBe('C7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('0')
      expect(acorde.cuerda[2]).toBe('1')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde D7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('D7')
      expect(acorde.acorde).toBe('D7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('2')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('3')
    })

    it('debe devolver el acorde E7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('E7')
      expect(acorde.acorde).toBe('E7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('2')
      expect(acorde.cuerda[1]).toBe('1')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde A7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('A7')
      expect(acorde.acorde).toBe('A7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('1')
      expect(acorde.cuerda[2]).toBe('0')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde G7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('G7')
      expect(acorde.acorde).toBe('G7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('1')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde Cmaj7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Cmaj7')
      expect(acorde.acorde).toBe('Cmaj7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('0')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde Dm7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Dm7')
      expect(acorde.acorde).toBe('Dm7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('1')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('1')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde F#m7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('F#m7')
      expect(acorde.acorde).toBe('F#m7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('2')
      expect(acorde.cuerda[1]).toBe('1')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('2')
    })

    it('debe devolver el acorde Fa#m7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Fa#m7')
      expect(acorde.acorde).toBe('Fa#m7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('2')
      expect(acorde.cuerda[1]).toBe('1')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('2')
    })

    it('debe devolver el acorde Bm7 correctamente con cejilla', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Bm7')
      expect(acorde.acorde).toBe('Bm7')
      expect(acorde.cejilla).toBe(2)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('2')
    })

    it('debe devolver el acorde Sim7 correctamente con cejilla', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Sim7')
      expect(acorde.acorde).toBe('Sim7')
      expect(acorde.cejilla).toBe(2)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('2')
      expect(acorde.cuerda[3]).toBe('2')
    })

    it('debe devolver el acorde Em7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Em7')
      expect(acorde.acorde).toBe('Em7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('0')
      expect(acorde.cuerda[3]).toBe('2')
    })

    it('debe devolver el acorde Am7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Am7')
      expect(acorde.acorde).toBe('Am7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('0')
      expect(acorde.cuerda[1]).toBe('2')
      expect(acorde.cuerda[2]).toBe('0')
      expect(acorde.cuerda[3]).toBe('0')
    })

    it('debe devolver el acorde Gm7 correctamente', () => {
      const acorde = AcordesUkeleleHelper.getAcorde('Gm7')
      expect(acorde.acorde).toBe('Gm7')
      expect(acorde.cejilla).toBe(0)
      expect(acorde.cuerda[0]).toBe('1')
      expect(acorde.cuerda[1]).toBe('3')
      expect(acorde.cuerda[2]).toBe('1')
      expect(acorde.cuerda[3]).toBe('1')
    })
  })
})
