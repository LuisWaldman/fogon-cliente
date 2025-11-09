import { describe, expect, it } from 'vitest'
import { HelperDisplayEditTexto } from './helperDisplayEditTexto'
import { textoResumen } from './textoResumen'
import { RenglonTexto } from './renglonResumen'

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

describe('Pruebo HelperDisplayEditTexto - CalcularLetraRima', () => {
  const helper = new HelperDisplayEditTexto()

  it('Asigna la misma letra a renglones con rima consonante', () => {
    const resumen = new textoResumen()

    const renglon1 = new RenglonTexto()
    renglon1.silabas = 8
    renglon1.Rima = 'amor'

    const renglon2 = new RenglonTexto()
    renglon2.silabas = 8
    renglon2.Rima = 'amor'

    resumen.renglones = [renglon1, renglon2]

    helper.CalcularLetraRima(resumen)

    expect(renglon1.LetraRima).toBe('a')
    expect(renglon2.LetraRima).toBe('a')
    expect(renglon1.tipoRima).toBe('consonante')
    expect(renglon2.tipoRima).toBe('consonante')
  })

  it('Asigna diferentes letras a renglones con diferentes rimas consonantes', () => {
    const resumen = new textoResumen()

    const renglon1 = new RenglonTexto()
    renglon1.silabas = 8
    renglon1.Rima = 'amor'

    const renglon2 = new RenglonTexto()
    renglon2.silabas = 8
    renglon2.Rima = 'amor'

    const renglon3 = new RenglonTexto()
    renglon3.silabas = 8
    renglon3.Rima = 'vida'

    const renglon4 = new RenglonTexto()
    renglon4.silabas = 8
    renglon4.Rima = 'vida'

    resumen.renglones = [renglon1, renglon2, renglon3, renglon4]

    helper.CalcularLetraRima(resumen)

    expect(renglon1.LetraRima).toBe('a')
    expect(renglon2.LetraRima).toBe('a')
    expect(renglon3.LetraRima).toBe('b')
    expect(renglon4.LetraRima).toBe('b')
  })

  it('No asigna rima a renglones sin sílabas', () => {
    const resumen = new textoResumen()

    const renglon1 = new RenglonTexto()
    renglon1.silabas = 0
    renglon1.Rima = 'amor'

    const renglon2 = new RenglonTexto()
    renglon2.silabas = 8
    renglon2.Rima = 'amor'

    resumen.renglones = [renglon1, renglon2]

    helper.CalcularLetraRima(resumen)

    expect(renglon1.LetraRima).toBe('')
    expect(renglon2.LetraRima).toBe('')
  })

  it('Detecta rimas asonantes cuando consonantes no coinciden', () => {
    const resumen = new textoResumen()

    const renglon1 = new RenglonTexto()
    renglon1.silabas = 8
    renglon1.Rima = 'amor'

    const renglon2 = new RenglonTexto()
    renglon2.silabas = 8
    renglon2.Rima = 'olor'

    resumen.renglones = [renglon1, renglon2]

    helper.CalcularLetraRima(resumen)

    // No debe haber coincidencia porque no son consonantes exactas
    // y se busca asonancia solo después de buscar consonancia
    expect(renglon1.LetraRima).toBe('')
    expect(renglon2.LetraRima).toBe('')
  })

  it('Ignora renglones sin Rima', () => {
    const resumen = new textoResumen()

    const renglon1 = new RenglonTexto()
    renglon1.silabas = 8
    renglon1.Rima = 'amor'

    const renglon2 = new RenglonTexto()
    renglon2.silabas = 8
    renglon2.Rima = ''

    const renglon3 = new RenglonTexto()
    renglon3.silabas = 8
    renglon3.Rima = 'amor'

    resumen.renglones = [renglon1, renglon2, renglon3]

    helper.CalcularLetraRima(resumen)

    expect(renglon1.LetraRima).toBe('a')
    expect(renglon2.LetraRima).toBe('')
    expect(renglon3.LetraRima).toBe('a')
  })

  it('Limita la búsqueda de rimas a los próximos 3 renglones', () => {
    const resumen = new textoResumen()

    const renglon1 = new RenglonTexto()
    renglon1.silabas = 8
    renglon1.Rima = 'amor'

    const renglon2 = new RenglonTexto()
    renglon2.silabas = 8
    renglon2.Rima = 'amor'

    const renglon3 = new RenglonTexto()
    renglon3.silabas = 8
    renglon3.Rima = 'dolor'

    const renglon4 = new RenglonTexto()
    renglon4.silabas = 8
    renglon4.Rima = 'nada'

    const renglon5 = new RenglonTexto()
    renglon5.silabas = 8
    renglon5.Rima = 'nada'

    const renglon6 = new RenglonTexto()
    renglon6.silabas = 8
    renglon6.Rima = 'amor'

    resumen.renglones = [
      renglon1,
      renglon2,
      renglon3,
      renglon4,
      renglon5,
      renglon6,
    ]

    helper.CalcularLetraRima(resumen)

    // renglon1 ('amor') coincide con renglon2 dentro de rango: ambos 'a'
    // renglon6 ('amor') está fuera del rango de búsqueda de renglon1 (más de 3 líneas)
    // así que no debe tener LetraRima asignada
    expect(renglon1.LetraRima).toBe('a')
    expect(renglon6.LetraRima).toBe('')
  })

  it('Maneja múltiples patrones de rima en el mismo poema', () => {
    const resumen = new textoResumen()

    const renglon1 = new RenglonTexto()
    renglon1.silabas = 8
    renglon1.Rima = 'rosa'

    const renglon2 = new RenglonTexto()
    renglon2.silabas = 8
    renglon2.Rima = 'rosa'

    const renglon3 = new RenglonTexto()
    renglon3.silabas = 8
    renglon3.Rima = 'mar'

    const renglon4 = new RenglonTexto()
    renglon4.silabas = 8
    renglon4.Rima = 'mar'

    resumen.renglones = [renglon1, renglon2, renglon3, renglon4]

    helper.CalcularLetraRima(resumen)

    // Aunque 'rosa' se procesa primero, después del reordenamiento alfabético,
    // 'mar' (primero alfabéticamente) debe ser 'a' y 'rosa' debe ser 'b'
    expect(renglon1.LetraRima).toBe('b')
    expect(renglon2.LetraRima).toBe('b')
    expect(renglon3.LetraRima).toBe('a')
    expect(renglon4.LetraRima).toBe('a')
  })

  it('Reordena las letras de rima de forma alfabética', () => {
    const resumen = new textoResumen()

    const renglon1 = new RenglonTexto()
    renglon1.silabas = 8
    renglon1.Rima = 'vida'

    const renglon2 = new RenglonTexto()
    renglon2.silabas = 8
    renglon2.Rima = 'vida'

    const renglon3 = new RenglonTexto()
    renglon3.silabas = 8
    renglon3.Rima = 'amor'

    const renglon4 = new RenglonTexto()
    renglon4.silabas = 8
    renglon4.Rima = 'amor'

    resumen.renglones = [renglon1, renglon2, renglon3, renglon4]

    helper.CalcularLetraRima(resumen)

    // Aunque 'vida' se procesa primero, después del reordenamiento alfabético,
    // 'amor' (primero alfabéticamente) debe ser 'a' y 'vida' debe ser 'b'
    expect(renglon3.LetraRima).toBe('a')
    expect(renglon4.LetraRima).toBe('a')
    expect(renglon1.LetraRima).toBe('b')
    expect(renglon2.LetraRima).toBe('b')
  })

  it('Ejemplo: ado, ina, aro, ina da a, b, a, b', () => {
    const resumen = new textoResumen()

    const renglon1 = new RenglonTexto()
    renglon1.silabas = 8
    renglon1.Rima = 'ado'

    const renglon2 = new RenglonTexto()
    renglon2.silabas = 8
    renglon2.Rima = 'ina'

    const renglon3 = new RenglonTexto()
    renglon3.silabas = 8
    renglon3.Rima = 'aro'

    const renglon4 = new RenglonTexto()
    renglon4.silabas = 8
    renglon4.Rima = 'ina'

    resumen.renglones = [renglon1, renglon2, renglon3, renglon4]

    helper.CalcularLetraRima(resumen)

    // Consonantes: ado no encuentra pareja, ina encuentra ina -> ambas se asignan
    // Asonantes: ado y aro riman asonantemente (ambas contienen 'a')
    // Ordenamiento alfabético: ado, aro, ina
    // Las rimas asignadas son: ado=a, aro=a (asonancia con ado), ina=b
    // Después del reordenamiento alfabético: ado<aro<ina
    // Mapeo: ado->a, aro->b, ina->c? No, porque aro está mapeada a 'a' (misma que ado)
    // Espera, cuando una rima se asigna, se asigna a esa misma letra siempre
    // Entonces: ado y aro comparten 'a', ina tiene 'b'
    expect(renglon1.LetraRima).toBe('a')
    expect(renglon2.LetraRima).toBe('b')
    expect(renglon3.LetraRima).toBe('a')
    expect(renglon4.LetraRima).toBe('b')
  })

  it('Las rimas iguales siempre reciben la misma letra, independientemente del tipo', () => {
    const resumen = new textoResumen()

    // Patrón: vida, amor, vida, olor
    // vida y vida consonantes (ambas reciben 'a')
    // amor aparece solo (sin pareja)
    // olor no encontrará pareja dentro del rango
    const r1 = new RenglonTexto()
    r1.silabas = 8
    r1.Rima = 'vida'

    const r2 = new RenglonTexto()
    r2.silabas = 8
    r2.Rima = 'amor'

    const r3 = new RenglonTexto()
    r3.silabas = 8
    r3.Rima = 'vida'

    const r4 = new RenglonTexto()
    r4.silabas = 8
    r4.Rima = 'olor'

    resumen.renglones = [r1, r2, r3, r4]

    helper.CalcularLetraRima(resumen)

    // r1 ('vida') busca en r2, r3, r4 y encuentra r3 ('vida') -> consonante
    // Ambas reciben la primera letra
    // r2 ('amor') no tiene pareja -> no se asigna
    // r4 ('olor') no tiene pareja dentro del rango -> no se asigna
    // Rimas únicas asignadas: solo 'vida'
    // Ordenamiento alfabético: vida
    // Mapeo: vida->a
    expect(r1.LetraRima).toBe('a')
    expect(r2.LetraRima).toBe('')
    expect(r3.LetraRima).toBe('a')
    expect(r4.LetraRima).toBe('')
  })
})
