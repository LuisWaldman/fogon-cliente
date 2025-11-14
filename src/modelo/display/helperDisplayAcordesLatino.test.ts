import { describe, expect, it, beforeEach } from 'vitest'
import { HelperDisplayAcordesLatino } from './helperDisplayAcordesLatino'

describe('Pruebo HelperDisplayAcordesLatino', () => {
  let helper: HelperDisplayAcordesLatino

  beforeEach(() => {
    // Resetear la instancia singleton antes de cada prueba
    helper = HelperDisplayAcordesLatino.getInstance()
    helper.latino = true
  })

  describe('GetAcorde - Conversión de americano a latino', () => {
    it('Convierte notas básicas de americano a latino', () => {
      expect(helper.GetAcorde('C')).toBe('Do')
      expect(helper.GetAcorde('D')).toBe('Re')
      expect(helper.GetAcorde('E')).toBe('Mi')
      expect(helper.GetAcorde('F')).toBe('Fa')
      expect(helper.GetAcorde('G')).toBe('Sol')
      expect(helper.GetAcorde('A')).toBe('La')
      expect(helper.GetAcorde('B')).toBe('Si')
    })

    it('Convierte notas con sostenidos', () => {
      expect(helper.GetAcorde('C#')).toBe('Do#')
      expect(helper.GetAcorde('D#')).toBe('Re#')
      expect(helper.GetAcorde('F#')).toBe('Fa#')
      expect(helper.GetAcorde('G#')).toBe('Sol#')
      expect(helper.GetAcorde('A#')).toBe('La#')
    })

    it('Convierte notas con bemoles', () => {
      expect(helper.GetAcorde('Bb')).toBe('Sib')
      expect(helper.GetAcorde('Db')).toBe('Reb')
      expect(helper.GetAcorde('Eb')).toBe('Mib')
      expect(helper.GetAcorde('Gb')).toBe('Solb')
      expect(helper.GetAcorde('Ab')).toBe('Lab')
    })

    it('Convierte acordes con sufijos (mayores, menores, séptimos, etc)', () => {
      expect(helper.GetAcorde('Am')).toBe('Lam')
      expect(helper.GetAcorde('A5')).toBe('La5')
      expect(helper.GetAcorde('A#5')).toBe('La#5')
      expect(helper.GetAcorde('A6')).toBe('La6')
      expect(helper.GetAcorde('A7')).toBe('La7')
      expect(helper.GetAcorde('Adim7')).toBe('Ladim7')
    })

    it('Convierte múltiples acordes separados por espacios', () => {
      expect(helper.GetAcorde('C D')).toBe('Do Re')
      expect(helper.GetAcorde('A A7')).toBe('La La7')
      expect(helper.GetAcorde('C Am G')).toBe('Do Lam Sol')
    })

    it('Respeta la opción latino = false', () => {
      helper.latino = false
      expect(helper.GetAcorde('C')).toBe('C')
      expect(helper.GetAcorde('Am')).toBe('Am')
    })
  })

  describe('GetAcordeAmericano - Conversión de latino a americano', () => {
    it('Convierte notas básicas de latino a americano', () => {
      expect(helper.GetAcordeAmericano('Do')).toBe('C')
      expect(helper.GetAcordeAmericano('Re')).toBe('D')
      expect(helper.GetAcordeAmericano('Mi')).toBe('E')
      expect(helper.GetAcordeAmericano('Fa')).toBe('F')
      expect(helper.GetAcordeAmericano('Sol')).toBe('G')
      expect(helper.GetAcordeAmericano('La')).toBe('A')
      expect(helper.GetAcordeAmericano('Si')).toBe('B')
    })

    it('Convierte notas con sostenidos', () => {
      expect(helper.GetAcordeAmericano('Do#')).toBe('C#')
      expect(helper.GetAcordeAmericano('Re#')).toBe('D#')
      expect(helper.GetAcordeAmericano('Fa#')).toBe('F#')
      expect(helper.GetAcordeAmericano('Sol#')).toBe('G#')
      expect(helper.GetAcordeAmericano('La#')).toBe('A#')
    })

    it('Convierte notas con bemoles', () => {
      expect(helper.GetAcordeAmericano('Sib')).toBe('Bb')
      expect(helper.GetAcordeAmericano('Reb')).toBe('Db')
      expect(helper.GetAcordeAmericano('Mib')).toBe('Eb')
      expect(helper.GetAcordeAmericano('Solb')).toBe('Gb')
      expect(helper.GetAcordeAmericano('Lab')).toBe('Ab')
    })

    it('Convierte acordes con sufijos (mayores, menores, séptimos, etc)', () => {
      expect(helper.GetAcordeAmericano('Lam')).toBe('Am')
      expect(helper.GetAcordeAmericano('La5')).toBe('A5')
      expect(helper.GetAcordeAmericano('La#5')).toBe('A#5')
      expect(helper.GetAcordeAmericano('La6')).toBe('A6')
      expect(helper.GetAcordeAmericano('La7')).toBe('A7')
      expect(helper.GetAcordeAmericano('Ladim7')).toBe('Adim7')
    })

    it('Convierte múltiples acordes separados por espacios', () => {
      expect(helper.GetAcordeAmericano('Do Re')).toBe('C D')
      expect(helper.GetAcordeAmericano('La La7')).toBe('A A7')
      expect(helper.GetAcordeAmericano('Do Lam Sol')).toBe('C Am G')
    })

    it('Respeta la opción latino = false', () => {
      helper.latino = false
      expect(helper.GetAcordeAmericano('Do')).toBe('Do')
      expect(helper.GetAcordeAmericano('Lam')).toBe('Lam')
    })
  })

  describe('Pruebas de inversión (GetAcorde y GetAcordeAmericano son inversas)', () => {
    it('GetAcordeAmericano es la inversa de GetAcorde para acordes simples', () => {
      const acordesAmericanos = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
      acordesAmericanos.forEach((acorde) => {
        const latino = helper.GetAcorde(acorde)
        const reverso = helper.GetAcordeAmericano(latino)
        expect(reverso).toBe(acorde)
      })
    })

    it('GetAcordeAmericano es la inversa de GetAcorde para acordes con sostenidos', () => {
      const acordesAmericanos = ['C#', 'D#', 'F#', 'G#', 'A#']
      acordesAmericanos.forEach((acorde) => {
        const latino = helper.GetAcorde(acorde)
        const reverso = helper.GetAcordeAmericano(latino)
        expect(reverso).toBe(acorde)
      })
    })

    it('GetAcordeAmericano es la inversa de GetAcorde para acordes con bemoles', () => {
      const acordesAmericanos = ['Bb', 'Db', 'Eb', 'Gb', 'Ab']
      acordesAmericanos.forEach((acorde) => {
        const latino = helper.GetAcorde(acorde)
        const reverso = helper.GetAcordeAmericano(latino)
        expect(reverso).toBe(acorde)
      })
    })

    it('GetAcordeAmericano es la inversa de GetAcorde para acordes con sufijos', () => {
      const acordesAmericanos = ['Am', 'C7', 'Dm7', 'G#m', 'Bbdim']
      acordesAmericanos.forEach((acorde) => {
        const latino = helper.GetAcorde(acorde)
        const reverso = helper.GetAcordeAmericano(latino)
        expect(reverso).toBe(acorde)
      })
    })
  })
})
