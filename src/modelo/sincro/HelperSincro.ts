import { SincroCancion } from './SincroCancion'
import { EstadoSincroCancion } from './EstadoSincroCancion'
import { ClienteSocket } from '../conexion/ClienteSocket'
import { DelayCalculador } from './DelayCalculador'
import { DelaySet } from './DelaySet'

export class HelperSincro {
  GetDetalleCalculo(): DelaySet[] {
    return this.delayCalculador.getDetalleCalculo()
  }
  private cliente: ClienteSocket | null = null
  private ciclos = 0
  private maxCiclos = 12
  private momentoEnviado: number = 0
  private momentoRecibido: number = 0

  private delayCalculador: DelayCalculador = new DelayCalculador()
  ErrorReloj: number = 0
  setCliente(cliente: ClienteSocket) {
    this.cliente = cliente
    this.cliente.setTimeHandler((hora: number) => {
      if (this.momentoEnviado == null) {
        return
      }
      this.momentoRecibido = this.MomentoLocal()
      const tardo = HelperSincro.Diferencia(
        this.momentoEnviado,
        this.momentoRecibido,
      )
      const timeServerReal = hora + tardo / 2
      const delay = this.momentoRecibido - timeServerReal
      this.delayCalculador.addDelaySet(new DelaySet(tardo * -1, delay))
      this.delayReloj = this.delayCalculador.getDelay()
      this.ErrorReloj = this.delayCalculador.getError()
      if (this.ciclos < this.maxCiclos) {
        this.ciclos++
        this.momentoEnviado = this.MomentoLocal()
        this.cliente?.gettime()
      }
    })
  }

  private static instance: HelperSincro
  public delayReloj: number = 0

  public static getInstance(): HelperSincro {
    if (!HelperSincro.instance) {
      HelperSincro.instance = new HelperSincro()
    }
    return HelperSincro.instance
  }

  ActualizarDelayReloj() {
    if (!this.cliente) {
      return
    }
    this.ciclos = 0
    this.delayCalculador = new DelayCalculador()
    this.momentoEnviado = this.MomentoLocal()
    this.cliente.gettime()
  }
  public MomentoSincro(): number {
    // delay = this.momentoRecibido - timeServerReal
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

  public static Diferencia(time1: number, time2: number): number {
    const milisegundosenHora = 3600000 // 1 hora in milliseconds
    const deltaAceptado = 1000 * 60 * 4 // 4 minutes in milliseconds
    if (time1 > milisegundosenHora - deltaAceptado && time2 < deltaAceptado) {
      // If time1 is close to the end of the hour and time2 is close to the start of the hour
      return time1 - (time2 + milisegundosenHora)
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
    let deltaGolpe: number

    let diferencia = HelperSincro.Diferencia(sincro.timeInicio, momento)
    console.log(`Diferencia: ${diferencia}, Momento: ${momento}, Time Inicio: ${sincro.timeInicio}`)
    if (diferencia <= 0) {
      diferencia = diferencia * -1
      const golpe = Math.floor(diferencia / sincro.duracionGolpe)
      estadoReproduccion = 'Reproduciendo'
      deltaGolpe = diferencia - golpe * sincro.duracionGolpe
      console.log('Diferencia:', diferencia, 'deltaGolpe:', deltaGolpe)
      deltaGolpe = sincro.duracionGolpe - deltaGolpe
      compas = sincro.desdeCompas + Math.floor(golpe / sincro.golpesxcompas)
      golpeDelCompas = golpe % sincro.golpesxcompas
      console.log(
        'Estado: Reproduciendo',
        diferencia,
        'Compás:',
        compas,
        'Golpe del compás:',
        golpeDelCompas,
        'deltaGolpe:',
        deltaGolpe,
        'Diferencia:',
        diferencia,
        'Golpe:',
        golpe,
        'Duracion golpe:',
        sincro.duracionGolpe,
      )
    } else {
      const golpe = Math.floor(diferencia / sincro.duracionGolpe)
      estadoReproduccion = 'Iniciando'
      compas = sincro.desdeCompas
      deltaGolpe = diferencia - golpe * sincro.duracionGolpe
      golpeDelCompas = sincro.golpesxcompas - (golpe + 1)
    }

    return new EstadoSincroCancion(
      compas,
      golpeDelCompas,
      estadoReproduccion,
      deltaGolpe,
    )
  }
}

export function getHelperSincro(): HelperSincro {
  return HelperSincro.getInstance()
}
