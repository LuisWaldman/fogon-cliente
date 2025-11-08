import { describe, expect, it } from 'vitest'
import { HelperDisplayEditTexto } from './helperDisplayEditTexto'

describe('Pruebo HelperDisplayEditTexto - CalcularDiferenciaSilabas', () => {
  const helper = new HelperDisplayEditTexto()

  it('Devuelve array vacío cuando silabas está vacío', () => {
    const resultado = helper.CalcularDiferenciaSilabas([])
    expect(resultado).toEqual([])
  })

  it('Devuelve un grupo cuando todos los versos tienen sílabas similares', () => {
    const resultado = helper.CalcularDiferenciaSilabas([8, 8, 8, 8])
    expect(resultado).toHaveLength(1)
    expect(resultado[0].base).toBe(8)
    expect(resultado[0].diferencia).toBe(0)
  })

  it('Devuelve un grupo con sílabas en rango 2', () => {
    const resultado = helper.CalcularDiferenciaSilabas([8, 8, 9, 7, 8, 10])
    expect(resultado).toHaveLength(1)
    expect(resultado[0].base).toBe(8)
    expect(resultado[0].diferencia).toBe(3)
  })

  it('Devuelve dos grupos cuando hay dos patrones distintos', () => {
    const resultado = helper.CalcularDiferenciaSilabas([8, 8, 8, 5, 5, 5])
    expect(resultado).toHaveLength(2)
    expect(resultado[0].base).toBe(8)
    expect(resultado[0].diferencia).toBe(0)
    expect(resultado[1].base).toBe(5)
    expect(resultado[1].diferencia).toBe(0)
  })

  it('Devuelve array vacío cuando no todos los versos están incluidos en los grupos', () => {
    // Versos con valores muy dispersos que no pueden agruparse en 2
    const resultado = helper.CalcularDiferenciaSilabas([8, 8, 5, 5, 2])
    expect(resultado).toEqual([])
  })

  it('Devuelve array vacío cuando hay un verso aislado fuera de los grupos', () => {
    const resultado = helper.CalcularDiferenciaSilabas([8, 8, 8, 5, 5, 20])
    expect(resultado).toEqual([])
  })

  it('Devuelve un grupo cuando versos varían dentro del rango 2 de la base más frecuente', () => {
    const resultado = helper.CalcularDiferenciaSilabas([10, 10, 10, 11, 9, 8])
    expect(resultado).toHaveLength(1)
    expect(resultado[0].base).toBe(10)
    expect(resultado[0].diferencia).toBe(3)
  })
})
