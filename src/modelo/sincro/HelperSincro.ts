import { SincroCancion } from './SincroCancion'
import { EstadoSincroCancion } from './EstadoSincroCancion'
import type { ClienteSocket } from '../conexion/ClienteSocket'

export class HelperSincro {
  private cliente: ClienteSocket | null = null

  private momentoEnviado: Date | null = null
  private momentoRecibido: Date | null = null

  setCliente(cliente: ClienteSocket) {
    this.cliente = cliente
    this.cliente.setTimeHandler((hora: Date) => {
      if (this.momentoEnviado == null) {
        return
      }
      console.log(`Momento recibido: ${hora.toISOString()}`)
      this.momentoRecibido = new Date(Date.now())
      const tardo =
        this.momentoRecibido.getTime() - this.momentoEnviado.getTime()
      const timeServerReal = new Date(hora.getTime() + tardo / 2)
      this.delayReloj = Date.now() - timeServerReal.getTime()
      console.log(`Tardo: ${tardo} ms,  DELAY ${this.delayReloj}`)
    })
  }

  private static instance: HelperSincro
  delayReloj: number = 0

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

  ActualizarDelayReloj() {
    if (!this.cliente) {
      return
    }
    this.momentoEnviado = new Date(Date.now())
    this.cliente.gettime()
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
      compas = sincro.desdeCompas + Math.floor(golpe / sincro.golpesxcompas)
      golpeDelCompas = golpe % sincro.golpesxcompas
    } else {
      estadoReproduccion = 'Iniciando'
      compas = sincro.desdeCompas
      const diferencia = sincro.timeInicio.getTime() - momento.getTime()
      const golpe = Math.floor(diferencia / sincro.duracionGolpe)
      delay = diferencia - golpe * sincro.duracionGolpe
      golpeDelCompas = sincro.golpesxcompas - (golpe + 1)
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
