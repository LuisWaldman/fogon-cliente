import { SincroCancion } from './SincroCancion'
import { EstadoSincroCancion } from './EstadoSincroCancion'

export class HelperSincro {
  private static instance: HelperSincro
  private compasInicio: number = 0
  delayReloj: number = -120

  private constructor() {}

  public static getInstance(): HelperSincro {
    if (!HelperSincro.instance) {
      HelperSincro.instance = new HelperSincro()
    }
    return HelperSincro.instance
  }

  async HTTPGet(urlGet: string): Promise<Response> {
    return fetch(urlGet + 'ntp', {
      method: 'GET',
    })
  }

  ActualizarDelayReloj(urlGet: string) {
    const momento = new Date(Date.now())
    this.HTTPGet(urlGet)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            const timeServer = new Date(data.hora)
            this.delayReloj = timeServer.getTime() - momento.getTime()
            console.log(`Delay del reloj actualizado: ${this.delayReloj} ms`)
          })
        } else {
          console.error('Error al obtener el delay del reloj')
        }
      })
      .catch((error) => {
        console.error(
          'Error en la solicitud HTTP para obtener el delay del reloj:',
          error,
        )
      })
  }

  ObtenerMomento(): Date {
    console.log(`Obteniendo momento con delay de reloj: ${this.delayReloj} ms`)
    const momento = new Date(Date.now() + this.delayReloj)
    return momento
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
      golpeDelCompas = sincro.golpesxcompas - golpe
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
