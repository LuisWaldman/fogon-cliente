import { describe, expect, it } from 'vitest'
import { AcordesTecladosHelper } from './AcordesTecladosHelper'

describe('Pruebo Los acordes de piano', () => {
  describe('GetAcorde - Devuelve acordes de piano', () => {
    it('debe devolver el acorde C correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('C')
      expect(acorde.acorde).toBe('C')
      expect(acorde.teclas).toEqual(['C4', 'E4', 'G4'])
    })

    it('debe devolver el acorde E correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('E')
      expect(acorde.acorde).toBe('E')
      expect(acorde.teclas).toEqual(['E4', 'G#4', 'B4'])
    })

    it('debe devolver el acorde A correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('A')
      expect(acorde.acorde).toBe('A')
      expect(acorde.teclas).toEqual(['A4', 'C#5', 'E5'])
    })

    it('debe devolver el acorde Em correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Em')
      expect(acorde.acorde).toBe('Em')
      expect(acorde.teclas).toEqual(['E4', 'G4', 'B4'])
    })

    it('debe devolver el acorde Am correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Am')
      expect(acorde.acorde).toBe('Am')
      expect(acorde.teclas).toEqual(['A4', 'C5', 'E5'])
    })

    it('debe devolver el acorde Bm correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Bm')
      expect(acorde.acorde).toBe('Bm')
      expect(acorde.teclas).toEqual(['B4', 'D5', 'F#5'])
    })

    it('debe devolver el acorde Sim correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Sim')
      expect(acorde.acorde).toBe('Sim')
      expect(acorde.teclas).toEqual(['B4', 'D5', 'F#5'])
    })

    it('debe devolver un acorde vacío para un acorde desconocido', () => {
      const acorde = AcordesTecladosHelper.getAcorde('X')
      expect(acorde.acorde).toBe('X')
      expect(acorde.teclas).toEqual([])
    })

    it('debe devolver el acorde D correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('D')
      expect(acorde.acorde).toBe('D')
      expect(acorde.teclas).toEqual(['D4', 'F#4', 'A4'])
    })

    it('debe devolver el acorde G correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('G')
      expect(acorde.acorde).toBe('G')
      expect(acorde.teclas).toEqual(['G4', 'B4', 'D5'])
    })

    it('debe devolver el acorde Dm correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Dm')
      expect(acorde.acorde).toBe('Dm')
      expect(acorde.teclas).toEqual(['D4', 'F4', 'A4'])
    })

    it('debe devolver el acorde F correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('F')
      expect(acorde.acorde).toBe('F')
      expect(acorde.teclas).toEqual(['F4', 'A4', 'C5'])
    })

    it('debe devolver el acorde B7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('B7')
      expect(acorde.acorde).toBe('B7')
      expect(acorde.teclas).toEqual(['B4', 'D#5', 'F#5', 'A5'])
    })

    it('debe devolver el acorde C7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('C7')
      expect(acorde.acorde).toBe('C7')
      expect(acorde.teclas).toEqual(['C4', 'E4', 'G4', 'Bb4'])
    })

    it('debe devolver el acorde D7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('D7')
      expect(acorde.acorde).toBe('D7')
      expect(acorde.teclas).toEqual(['D4', 'F#4', 'A4', 'C5'])
    })

    it('debe devolver el acorde E7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('E7')
      expect(acorde.acorde).toBe('E7')
      expect(acorde.teclas).toEqual(['E4', 'G#4', 'B4', 'D5'])
    })

    it('debe devolver el acorde A7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('A7')
      expect(acorde.acorde).toBe('A7')
      expect(acorde.teclas).toEqual(['A4', 'C#5', 'E5', 'G5'])
    })

    it('debe devolver el acorde G7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('G7')
      expect(acorde.acorde).toBe('G7')
      expect(acorde.teclas).toEqual(['G4', 'B4', 'D5', 'F5'])
    })

    it('debe devolver el acorde Cmaj7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Cmaj7')
      expect(acorde.acorde).toBe('Cmaj7')
      expect(acorde.teclas).toEqual(['C4', 'E4', 'G4', 'B4'])
    })

    it('debe devolver el acorde Dm7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Dm7')
      expect(acorde.acorde).toBe('Dm7')
      expect(acorde.teclas).toEqual(['D4', 'F4', 'A4', 'C5'])
    })

    it('debe devolver el acorde F#m7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('F#m7')
      expect(acorde.acorde).toBe('F#m7')
      expect(acorde.teclas).toEqual(['F#4', 'A4', 'C#5', 'E5'])
    })

    it('debe devolver el acorde Fa#m7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Fa#m7')
      expect(acorde.acorde).toBe('Fa#m7')
      expect(acorde.teclas).toEqual(['F#4', 'A4', 'C#5', 'E5'])
    })

    it('debe devolver el acorde Bm7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Bm7')
      expect(acorde.acorde).toBe('Bm7')
      expect(acorde.teclas).toEqual(['B4', 'D5', 'F#5', 'A5'])
    })

    it('debe devolver el acorde Sim7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Sim7')
      expect(acorde.acorde).toBe('Sim7')
      expect(acorde.teclas).toEqual(['B4', 'D5', 'F#5', 'A5'])
    })

    it('debe devolver el acorde Em7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Em7')
      expect(acorde.acorde).toBe('Em7')
      expect(acorde.teclas).toEqual(['E4', 'G4', 'B4', 'D5'])
    })

    it('debe devolver el acorde Am7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Am7')
      expect(acorde.acorde).toBe('Am7')
      expect(acorde.teclas).toEqual(['A4', 'C5', 'E5', 'G5'])
    })

    it('debe devolver el acorde Gm7 correctamente', () => {
      const acorde = AcordesTecladosHelper.getAcorde('Gm7')
      expect(acorde.acorde).toBe('Gm7')
      expect(acorde.teclas).toEqual(['G4', 'Bb4', 'D5', 'F5'])
    })
  })
})
