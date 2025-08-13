import type { Cancion } from '../cancion/cancion'
import type { Sugerencia } from './sugerencia'
import { SugerenciaAgregarParte } from './sugerenciaAgregarParte'
import { SugerenciaAnacrusa } from './sugerenciaAnacrusa'

export class BuilderSugerencias {
  public static generarSugerencias(cancion: Cancion): Sugerencia[] {
    const sugerencias: Sugerencia[] = []
    sugerencias.push(...SugerenciaAgregarParte.recomendarSugerencias(cancion))
    sugerencias.push(...SugerenciaAnacrusa.recomendarSugerencias(cancion))

    return sugerencias
  }
}
