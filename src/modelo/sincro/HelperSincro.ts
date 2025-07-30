import { SincroCancion } from './SincroCancion'
import { useAppStore } from '../../stores/appStore'
import { EstadoSincroCancion } from './EstadoSincroCancion'
import { ClienteSocket } from '../conexion/ClienteSocket'
import { DelayCalculador } from './DelayCalculador'
import { DelaySet } from './DelaySet'

export class HelperSincro {
  private cliente: ClienteSocket | null = null
  private ciclos = 0
  private maxCiclos = 1
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
  public MomentoSincro(): number {
    const momento = this.MomentoLocal() - this.delayReloj
    if (momento < 0) {
      return momento + 3600000
    }
    return momento % 3600000
  }

  public MomentoLocal(): number {
    const now = Date.now()
    return now % 3600000 // Return milliseconds within the current minute (0-59999)
  }

  public Diferencia(time1: number, time2: number): number {
    if (time2 < 10000 && time1 > 50000) {
      return 60000 + time1 - time2
    }
    return time1 - time2
  }

  public GetEstadoSincro(
    sincro: SincroCancion,
    momento: number,
  ): EstadoSincroCancion {
    let estadoReproduccion: 'Reproduciendo' | 'Iniciando'
    let compas: number
    let golpeDelCompas: number
    let delay: number

    const diferencia = this.Diferencia(sincro.timeInicio, momento)
    if (diferencia <= 0) {
      estadoReproduccion = 'Reproduciendo'
      const golpe = Math.floor(diferencia / sincro.duracionGolpe)
      delay = diferencia - golpe * sincro.duracionGolpe
      delay = sincro.duracionGolpe - delay
      compas = sincro.desdeCompas + Math.floor(golpe / sincro.golpesxcompas)
      golpeDelCompas = golpe % sincro.golpesxcompas
    } else {
      estadoReproduccion = 'Iniciando'
      compas = sincro.desdeCompas
      const diferencia = sincro.timeInicio - momento
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
