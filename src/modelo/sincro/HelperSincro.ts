import { SincroCancion } from './SincroCancion'
import { EstadoSincroCancion } from './EstadoSincroCancion'

export class HelperSincro {
  private static instance: HelperSincro
  private compasInicio: number = 0

  private constructor() {}

  public static getInstance(): HelperSincro {
    if (!HelperSincro.instance) {
      HelperSincro.instance = new HelperSincro()
    }
    return HelperSincro.instance
  }

  /**
   * Sincroniza el estado de la canción según los parámetros recibidos.
   * @param sincro SincroCancion
   * @returns EstadoSincroCancion
   */
  public sincronizar(
    sincro: SincroCancion,
    momento: Date,
  ): EstadoSincroCancion {
    let estadoReproduccion: 'Reproduciendo' | 'Iniciando'
    let compas: number
    let golpeDelCompas: number
    let delay: number

    if (sincro.timeInicio.getTime() <= momento.getTime()) {
      estadoReproduccion = 'Reproduciendo'
      const diferencia = momento.getTime() - sincro.timeInicio.getTime()
      const golpe = Math.floor(diferencia / sincro.duracionGolpe)
      delay = diferencia - golpe * sincro.duracionGolpe
      delay = sincro.duracionGolpe - delay
      compas = this.compasInicio + Math.floor(golpe / sincro.golpesxcompas)
      golpeDelCompas = golpe % sincro.golpesxcompas
    } else {
      estadoReproduccion = 'Iniciando'
      compas = this.compasInicio
      const diferencia = sincro.timeInicio.getTime() - momento.getTime()
      const golpe = Math.floor(diferencia / sincro.duracionGolpe)
      delay = diferencia - golpe * sincro.duracionGolpe
      golpeDelCompas = golpe
    }

    return new EstadoSincroCancion(
      compas,
      golpeDelCompas,
      estadoReproduccion,
      delay,
    )
  }
}

export function getHelperSincro(): HelperSincro {
  return HelperSincro.getInstance()
}
