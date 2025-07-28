import { SincroCancion } from './SincroCancion'
import { useAppStore } from '../../stores/appStore'
import { EstadoSincroCancion } from './EstadoSincroCancion'
import { ClienteSocket } from '../conexion/ClienteSocket'
import { DelayCalculador } from './DelayCalculador'
import { DelaySet } from './DelaySet'

export class HelperSincro {
  private cliente: ClienteSocket | null = null
  private ciclos = 0
  private maxCiclos = 20
  private momentoEnviado: Date | null = null
  private momentoRecibido: Date | null = null

  private delayCalculador: DelayCalculador = new DelayCalculador()
  setCliente(cliente: ClienteSocket) {
    this.cliente = cliente
    this.cliente.setTimeHandler((hora: Date) => {
      if (this.momentoEnviado == null) {
        return
      }
      this.momentoRecibido = new Date(Date.now())
      const tardo =
        this.momentoRecibido.getTime() - this.momentoEnviado.getTime()
      const timeServerReal = new Date(hora.getTime() + tardo / 2)
      const delay = Date.now() - timeServerReal.getTime()
      this.delayCalculador.addDelaySet(new DelaySet(tardo, delay))
      this.delayReloj = this.delayCalculador.getDelay()
      const appStore = useAppStore()
      appStore.delayGetReloj = this.delayCalculador.getError()
      console.log(
        'Momento Recibido:',
        this.momentoRecibido,
        'Tardo:',
        tardo,
        'Delay:',
        delay,
        'Delay reloj:',
        this.delayReloj,
      )
      if (this.ciclos < this.maxCiclos) {
        this.ciclos++
        this.momentoEnviado = new Date(Date.now())
        this.cliente?.gettime()
      }
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
    this.ciclos = 0
    this.delayCalculador = new DelayCalculador()
    this.momentoEnviado = new Date(Date.now())
    this.cliente.gettime()
  }

  ObtenerMomento(): Date {
    const momento = new Date(Date.now() + this.delayReloj)
    return momento
  }

  public GetEstadoSincro(
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
