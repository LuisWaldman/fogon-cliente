import { describe, expect, it } from 'vitest'
import { HelperDisplayEditTexto } from './helperDisplayEditTexto'
import { Letra } from '../cancion/letra'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Función que convierte el contenido de un archivo de texto en un objeto Letra
 * @param filePath - Ruta al archivo de texto
 * @returns Objeto Letra con el contenido procesado
 */
function archivoToLetra(filePath: string): Letra {
  // Cargar el contenido del archivo
  const fileContent = readFileSync(filePath, 'utf-8')

  // Convertir el contenido en el formato esperado por Letra
  // Filtrar líneas vacías para obtener solo las líneas con texto
  const lineasTexto = fileContent
    .trim()
    .split('\n')
    .filter((linea) => linea.trim() !== '') // Filtrar líneas vacías

  // Crear un solo string con separadores /n para que HelperDisplayEditTexto lo procese correctamente
  const textoConSeparadores = lineasTexto.join('/n')
  const lineas = [[textoConSeparadores]]

  return new Letra(lineas)
}

describe('Pruebo HelperDisplayEditTexto - Con archivos', () => {
  const helper = new HelperDisplayEditTexto()

  it('Cuenta silabas sonetodelvino', () => {
    // Usar la función archivoToLetra para cargar y procesar el archivo
    const filePath = join(__dirname, 'sonetodelvino.txt')
    const letra = archivoToLetra(filePath)

    const resumen = helper.getResumen(letra)

    // Verificar que la función archivoToLetra funciona correctamente
    expect(resumen.renglones.length).toBe(14) // Un soneto tiene 14 versos
    expect(resumen.versos).toBe(14) // Verificar que tiene 14 versos
    expect(resumen.renglones[0].LetraRima).toBe('A') // El algoritmo detecta rimas consonantes
    expect(resumen.rimas).toBe('soneto') // El algoritmo detecta rimas consonantes

  })

  it('Función archivoToLetra reutilizable', () => {
    // Demostrar que la función archivoToLetra puede ser reutilizada fácilmente
    const filePath = join(__dirname, 'sonetodelvino.txt')
    const letra1 = archivoToLetra(filePath)
    const letra2 = archivoToLetra(filePath)

    // Ambos objetos deben tener la misma estructura
    expect(letra1.renglones).toEqual(letra2.renglones)

    // Verificar que el objeto Letra se crea correctamente
    expect(letra1).toBeInstanceOf(Letra)
    expect(letra1.renglones).toBeDefined()
    expect(letra1.renglones.length).toBe(1) // Una sola entrada con todo el texto
    expect(letra1.renglones[0]).toBeDefined()
    expect(letra1.renglones[0][0]).toContain('¿En qué reino') // Debe contener el inicio del soneto
  })
})
