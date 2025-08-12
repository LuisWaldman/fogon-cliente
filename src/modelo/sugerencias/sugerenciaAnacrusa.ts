import { Parte } from '../cancion/acordes'
import type { Cancion } from '../cancion/cancion'
import { Sugerencia } from './sugerencia'

export class SugerenciaAnacrusa extends Sugerencia {
  constructor() {
    super()
    this.descripcion = 'Agregar una anacrusa'
  }

  override aplicarSugerencia(cancion: Cancion): void {
    const lenParte = cancion.acordes.partes.length
    const parte = new Parte('anacrusa', ['.'])
    cancion.acordes.partes.push(parte)
    cancion.acordes.ordenPartes.push(lenParte)
    const nuevoOrden = [lenParte]
    nuevoOrden.push(...cancion.acordes.ordenPartes)
    cancion.acordes.ordenPartes = nuevoOrden
    if (cancion.letras.renglones.length > 0) {
      cancion.letras.renglones[0].push('...')
    } else {
      cancion.letras.renglones.push(['...'])
    }
  }

  static override recomendarSugerencias(cancion: Cancion): Sugerencia[] {
    const sugerencias: Sugerencia[] = []
    if (cancion.letras.renglones[0]) {
      if (
        cancion.letras.renglones[0].length > 0 &&
        cancion.letras.renglones[0][0].replace('.', '').trim() !== '' &&
        cancion.letras.renglones[0][0][0].toLowerCase() ===
          cancion.letras.renglones[0][0][0]
      ) {
        sugerencias.push(new SugerenciaAnacrusa())
        return sugerencias
      }
    }
    return sugerencias
  }
}
