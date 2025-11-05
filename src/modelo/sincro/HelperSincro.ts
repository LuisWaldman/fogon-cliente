import { SincroCancion } from './SincroCancion'
import { EstadoSincroCancion } from './EstadoSincroCancion'
import { ClienteSocket } from '../conexion/ClienteSocket'
import { DelayCalculador } from './DelayCalculador'
import { DelaySet } from './DelaySet'
import { ClienteWebRTC } from '../conexion/ClienteWebRTC'
import type { SDPStruct } from '../conexion/SDPStruct'

export class HelperSincro {
  GetDetalleCalculo(): DelaySet[] {
    return this.delayCalculador.getDetalleCalculo()
  }
  GetDetalleCalculoRTC(): DelaySet[] {
    return this.delayCalculadorRTC.getDetalleCalculo()
  }

  private cliente: ClienteSocket | null = null
  private clienteRTC: ClienteWebRTC | null = null
  private ciclos = 0
  private maxCiclos = 12
  private momentoEnviado: number = 0
  private momentoRecibido: number = 0

  private delayCalculador: DelayCalculador = new DelayCalculador()
  private delayCalculadorRTC: DelayCalculador = new DelayCalculador()
  public ErrorReloj: number = 0
  public delayReloj: number = 0
  public delay: number = 0
  public SincronizadoRTC: boolean = false
  public ErrorRelojRTC: number = 0
  public delayRelojRTC: number = 0

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
      this.delay = this.delayReloj
      this.ErrorReloj = this.delayCalculador.getError()
      if (this.ciclos < this.maxCiclos) {
        this.ciclos++
        this.momentoEnviado = this.MomentoLocal()
        this.cliente?.gettime()
      }
    })
  }

  private static instance: HelperSincro
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
  sincronizandoRTC: boolean = false
  async SincronizarConClienteRTC(cliente: number) {
    this.sincronizandoRTC = true
    const response = await this.cliente?.HTTPGET(`webrtc?usuarioid=${cliente}`)
    const sdp: SDPStruct = await response?.json()
    await this.clienteRTC?.SetRemoteOffer(sdp.sdp)
    const answer = await this.clienteRTC?.CreateAnswerSDP()
    console.log('SDP de respuesta generado, enviando al servidor...', answer)
    this.cliente?.HTTPPost('answerrtc', { sdp: answer, usuarioid: cliente })
  }
  async IniciarActualizacionRTC(sdp: string) {
    await this.clienteRTC?.SetRemoteSDP(sdp)
  }
  ActualizarDelayRelojRTC() {
    if (!this.cliente) {
      return
    }
    this.clienteRTC = new ClienteWebRTC()
    this.cliente.setSincronizarRTCHandler((n: number) => {
      this.SincronizarConClienteRTC(n)
    })
    this.cliente.setAnswerRTCHandler((sdp: string) => {
      this.IniciarActualizacionRTC(sdp)
    })
    this.clienteRTC.GetSDP().then((sdp) => {
      console.log('SDP generado, enviando al servidor...', sdp)
      this.cliente?.HTTPPost('webrtc', { sdp: sdp })
    })
    this.SetClienteRTC()
  }

  public SetClienteRTC() {
    this.clienteRTC?.setOnConnOpenedHandler(() => {
      if (this.sincronizandoRTC) {
        this.ciclos = 0
        this.delayCalculadorRTC = new DelayCalculador()
        this.momentoEnviado = this.MomentoLocal()
        this.clienteRTC?.SendGetTime()
      }
      this.sincronizandoRTC = false
    })
    this.clienteRTC?.setOnMensajeHandler((msg: string) => {
      if (msg === 'gettime') {
        this.clienteRTC?.SendTime(this.MomentoSincro())
        return
      } else {
        if (this.momentoEnviado == null) {
          return
        }
        this.momentoRecibido = this.MomentoLocal()
        const tardo = HelperSincro.Diferencia(
          this.momentoEnviado,
          this.momentoRecibido,
        )
        const hora = parseInt(msg)
        const timeServerReal = hora + tardo / 2
        const delay = this.momentoRecibido - timeServerReal
        this.delayCalculadorRTC.addDelaySet(new DelaySet(tardo * -1, delay))
        this.delayRelojRTC = this.delayCalculadorRTC.getDelay()
        this.ErrorRelojRTC = this.delayCalculadorRTC.getError()
        console.log(
          'Ajustando, delayReloj:',
          this.delayReloj,
          'ErrorReloj:',
          this.ErrorReloj,
        )
        if (this.ciclos < this.maxCiclos) {
          this.ciclos++
          this.momentoEnviado = this.MomentoLocal()
          this.clienteRTC?.SendGetTime()
        } else {
          this.SincronizadoRTC = true
          this.delay = this.delayRelojRTC
          this.clienteRTC?.closeConn()
        }
      }
    })
    this.clienteRTC?.setOnReiniciarHandler(() => {
      this.clienteRTC = new ClienteWebRTC()
      this.clienteRTC.GetSDP().then((sdp) => {
        console.log('SDP generado, enviando al servidor...', sdp)
        this.cliente?.HTTPPost('updatertc', { sdp: sdp })
      })
      this.SetClienteRTC()
    })
  }

  public MomentoSincro(): number {
    // delay = this.momentoRecibido - timeServerReal
    const momento = this.MomentoLocal() - this.delay

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
    if (diferencia <= 0) {
      diferencia = diferencia * -1
      const golpe = Math.floor(diferencia / sincro.duracionGolpe)
      estadoReproduccion = 'Reproduciendo'
      deltaGolpe = diferencia - golpe * sincro.duracionGolpe
      deltaGolpe = sincro.duracionGolpe - deltaGolpe
      compas = sincro.desdeCompas + Math.floor(golpe / sincro.golpesxcompas)
      golpeDelCompas = golpe % sincro.golpesxcompas
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

  public GetSincro(
    estado: EstadoSincroCancion,
    momento: number,
    duracionGolpe: number,
    golpesxcompas: number,
    desdeCompas: number = 0,
  ): SincroCancion {
    // Revert the logic of GetEstadoSincro
    let timeInicio: number
    let recuperadoDesdeCompas: number

    if (estado.estado === 'Reproduciendo') {
      const golpeFromCompas =
        (estado.compas - desdeCompas) * golpesxcompas + estado.golpeEnCompas

      const diferencia =
        golpeFromCompas * duracionGolpe + duracionGolpe - estado.delay
      timeInicio = momento - diferencia
      recuperadoDesdeCompas = desdeCompas
    } else {
      const golpe = golpesxcompas - (estado.golpeEnCompas + 1)
      const diferencia = golpe * duracionGolpe + estado.delay
      timeInicio = momento + diferencia
      recuperadoDesdeCompas = desdeCompas
    }

    // Normalize timeInicio to be within [0, 3600000)
    timeInicio = timeInicio % 3600000
    if (timeInicio < 0) {
      timeInicio += 3600000
    }

    return new SincroCancion(
      duracionGolpe,
      timeInicio,
      golpesxcompas,
      recuperadoDesdeCompas,
    )
  }
}

export function getHelperSincro(): HelperSincro {
  return HelperSincro.getInstance()
}
