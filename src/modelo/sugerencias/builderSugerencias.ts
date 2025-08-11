import type { Cancion } from '../cancion/cancion'
import type { Sugerencia } from './sugerencia'
import { SugerenciaAgregarParte } from './sugerenciaAgregarParte'

export class BuilderSugerencias {
  private static SugerenciasVacia(cancion: Cancion): Sugerencia[] {
    const sugerencias: Sugerencia[] = []
    sugerencias.push(new SugerenciaAgregarParte(cancion, [1, 4, 5, 1]))
    return sugerencias
  }

  public static generarSugerencias(cancion: Cancion): Sugerencia[] {
    const sugerencias: Sugerencia[] = []
    sugerencias.push(...this.SugerenciasVacia(cancion))

    return sugerencias
  }
}
