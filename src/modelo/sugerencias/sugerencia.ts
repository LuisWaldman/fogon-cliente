import type { Cancion } from '../cancion/cancion'

export class Sugerencia {
  public descripcion: string = ''

  aplicarSugerencia(cancion: Cancion): void {
    // Implementación de la sugerencia
    console.log(`Sugerencia aplicada a la canción: ${cancion.cancion}`)
  }
  static recomendarSugerencias(_cancion: Cancion): Sugerencia[] {
    return []
  }
}
