import { io, Socket } from 'socket.io-client'
import type { datosLogin } from '../datosLogin'
import type { ObjetoPosteable } from '../objetoPosteable'
import type { Servidor } from '../servidor'

interface ServerToClientEvents {
  replica: (usuario: string, datos: string[]) => void
  loginSuccess: () => void
  conectado: (data: { token: string }) => void
  loginFailed: (error: string) => void
  ensesion: (sesion: string) => void
  sesionFailed: (error: string) => void
  mensajesesion: (mensaje: string) => void
  rolSesion: (mensaje: string) => void
  cancionActualizada: () => void
  cancionIniciada: (compas: number, desde: number) => void
  cancionDetenida: () => void
  compasActualizado: (compas: number) => void
  sesionesActualizadas: () => void
  actualizarusuarios: () => void
  time: (hora: number) => void
  sincronizarRTC: (usuario: number) => void
  answerRTC: (SDP: string) => void
}

interface ClientToServerEvents {
  iniciarReproduccion(compas: number, delayms: number): void
  detenerReproduccion: () => void
  actualizarCompas: (compas: number) => void
  login: (modo: string, usuario: string, password: string) => void
  unirmesesion(sesion: string): void
  crearsesion(sesion: string): void
  mensajeasesion: (mensaje: string) => void
  salirsesion: () => void
  logout: () => void
  gettime: () => void
}

export class ClienteSocket {
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>
  public reintentos: number = 3
  public intentosRealizados: number = 0
  public maxIntentos: number = 3
  private reconectando: boolean = false

  private loginSuccessHandler?: () => void
  token: string = ''
  public setLoginSuccessHandler(handler: () => void): void {
    this.loginSuccessHandler = handler
  }

  private sesionesActualizadasHandler?: () => void
  public setSesionesActualizadasHandler(handler: () => void): void {
    this.sesionesActualizadasHandler = handler
  }
  private sincronizarRTCHandler?: (usuario: number) => void
  public setSincronizarRTCHandler(handler: (usuario: number) => void): void {
    this.sincronizarRTCHandler = handler
  }
  private conectadoHandler?: (token: string) => void
  public setConectadoHandler(handler: (token: string) => void): void {
    this.conectadoHandler = handler
  }
  private answerRTCHandler?: (SDP: string) => void
  public setAnswerRTCHandler(handler: (SDP: string) => void): void {
    this.answerRTCHandler = handler
  }
  private cancionActualizadaHandler?: () => void
  public setCancionActualizadaHandler(handler: () => void): void {
    this.cancionActualizadaHandler = handler
  }

  private conexionStatusHandler?: (status: string) => void
  public setconexionStatusHandler(handler: (status: string) => void): void {
    this.conexionStatusHandler = handler
  }
  private ensesionHandler?: (sesion: string) => void
  public setEnsesionHandler(handler: (sesion: string) => void): void {
    this.ensesionHandler = handler
  }

  private sesionFailedHandler?: (error: string) => void
  public setSesionFailedHandler(handler: (error: string) => void): void {
    this.sesionFailedHandler = handler
  }

  private loginFailedHandler?: (error: string) => void
  public setLoginFailedHandler(handler: (error: string) => void): void {
    this.loginFailedHandler = handler
  }

  private mensajesesionHandler?: (mensaje: string) => void
  public setMensajesesionHandler(handler: (mensaje: string) => void): void {
    this.mensajesesionHandler = handler
  }

  private cancionIniciadaHandler?: (compas: number, desde: number) => void
  public setCancionIniciadaHandler(
    handler: (compas: number, desde: number) => void,
  ): void {
    this.cancionIniciadaHandler = handler
  }

  private cancionDetenidaHandler?: () => void
  public setCancionDetenidaHandler(handler: () => void): void {
    this.cancionDetenidaHandler = handler
  }

  public SalirSesion(): void {
    this.socket.emit('salirsesion')
  }

  public Logout(): void {
    this.socket.emit('logout')
  }

  private rolSesionHandler?: (mensaje: string) => void
  public setRolSesionHandler(handler: (mensaje: string) => void): void {
    this.rolSesionHandler = handler
  }

  private compasActualizadoHandler?: (compas: number) => void
  public setCompasActualizadoHandler(handler: (compas: number) => void): void {
    this.compasActualizadoHandler = handler
  }

  private timeHandler?: (hora: number) => void
  public setTimeHandler(handler: (hora: number) => void): void {
    this.timeHandler = handler
  }

  private actualizarUsuariosHandler?: () => void
  public setActualizarUsuariosHandler(handler: () => void): void {
    this.actualizarUsuariosHandler = handler
  }

  private servidor: Servidor
  public get UrlServer(): string {
    return this.servidor.direccion
  }
  public GetServerNombre(): string {
    return this.servidor.nombre
  }

  public async HTTPGET(action: string): Promise<Response> {
    return fetch(this.UrlServer + action, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
  }

  async HTTPPost(urlPost: string, body: ObjetoPosteable): Promise<Response> {
    return fetch(this.UrlServer + urlPost, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(body),
    })
  }

  constructor(servidor: Servidor) {
    this.servidor = servidor
  }
  public disconnect(): void {
    if (this.socket) {
      this.reconectando = false
      this.intentosRealizados = 0
      this.socket.disconnect()
      console.log('socket disconnected manually')
    }
  }

  public connectar(): void {
    // Resetear contador de intentos
    this.intentosRealizados = 0
    this.reconectando = false

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      this.servidor.direccion,
      {
        rejectUnauthorized: false,
        transports: ['websocket'],
        reconnectionAttempts: this.reintentos,
        reconnectionDelay: 1000, // Delay entre intentos
        reconnectionDelayMax: 5000, // Máximo delay
        timeout: 10000, // Timeout de conexión
      },
    )

    socket.on('connect', () => {
      console.log('socket connected')
      this.intentosRealizados = 0 // Resetear en conexión exitosa
      this.reconectando = false
      this.conexionStatusHandler?.('conectado')
    })

    socket.on('connect_error', (error) => {
      this.intentosRealizados++
      console.error(
        `Connection error (attempt ${this.intentosRealizados}/${this.maxIntentos}):`,
        error.message,
      )

      if (this.intentosRealizados >= this.maxIntentos) {
        console.log('Máximo número de intentos alcanzado, desconectando...')
        socket.disconnect()
        this.conexionStatusHandler?.('error')
      } else {
        this.conexionStatusHandler?.('error')
      }
    })

    socket.on('disconnect', (reason) => {
      console.log('socket disconnected:', reason)

      // Si fue desconexión manual, no intentar reconectar
      if (reason === 'io client disconnect') {
        this.reconectando = false
      }

      this.conexionStatusHandler?.('desconectado')
    })
    socket.on('conectado', (data: { token: string }) => {
      console.log('conectado received with token:', data.token)
      this.token = data.token
      this.conectadoHandler?.(data.token)
    })

    socket.on('cancionActualizada', () => {
      this.cancionActualizadaHandler?.()
    })

    socket.on('mensajesesion', (msj: string) => {
      console.log('mensajesesion received with mensaje:', msj)
      this.mensajesesionHandler?.(msj)
    })
    socket.on('rolSesion', (mensaje: string) => {
      console.log('rolSesion received with mensaje:', mensaje)
      this.rolSesionHandler?.(mensaje)
    })
    socket.on('sesionesActualizadas', () => {
      console.log('sesionesActualizadas received')
      this.sesionesActualizadasHandler?.()
    })

    socket.on('loginSuccess', () => {
      console.log('loginSuccess received')
      this.loginSuccessHandler?.()
    })

    socket.on('loginFailed', (error: string) => {
      console.error('loginFailed received with error:', error)
      this.loginFailedHandler?.(error)
    })
    socket.on('ensesion', (sesion: string) => {
      console.log('ensesion received with sesion:', sesion)
      this.ensesionHandler?.(sesion)
    })
    socket.on('sesionFailed', (error: string) => {
      console.error('sesionFailed received with error:', error)
      this.sesionFailedHandler?.(error)
    })

    socket.on('cancionIniciada', (compas: number, desde: number) => {
      console.log(
        'cancionIniciada received with compas:',
        compas,
        'desde:',
        desde,
      )
      this.cancionIniciadaHandler?.(compas, desde)
    })
    socket.on('cancionDetenida', () => {
      console.log('cancionDetenida received')
      this.cancionDetenidaHandler?.()
    })
    socket.on('sincronizarRTC', (usuario: number) => {
      console.log('sincronizarRTC received with usuario:', usuario)
      this.sincronizarRTCHandler?.(usuario)
    })
    socket.on('compasActualizado', (compas: number) => {
      console.log('compasActualizado received with compas:', compas)
      this.compasActualizadoHandler?.(compas)
    })
    socket.on('answerRTC', (SDP: string) => {
      console.log('answerRTC received with SDP:', SDP)
      this.answerRTCHandler?.(SDP)
    })
    socket.on('time', (hora: number) => {
      this.timeHandler?.(hora)
    })

    socket.on('actualizarusuarios', () => {
      console.log('actualizarUsuarios received')
      this.actualizarUsuariosHandler?.()
    })

    this.socket = socket
  }

  public MensajeASesion(msj: string): void {
    this.socket.emit('mensajeasesion', msj)
  }
  public CrearSesion(sesion: string): void {
    this.socket.emit('crearsesion', sesion)
  }

  public UnirmeSesion(sesion: string): void {
    this.socket.emit('unirmesesion', sesion)
  }

  login(datos: datosLogin) {
    this.socket.emit('login', datos.modo, datos.usuario, datos.password)
  }

  public iniciarReproduccion(compas: number, delayms: number): void {
    console.log(
      'Iniciando reproducción con compás:',
      compas,
      'y delay:',
      delayms,
    )
    this.socket.emit('iniciarReproduccion', compas, delayms)
  }
  public detenerReproduccion(): void {
    this.socket.emit('detenerReproduccion')
  }
  public actualizarCompas(compas: number): void {
    this.socket.emit('actualizarCompas', compas)
  }

  public gettime(): void {
    this.socket.emit('gettime')
  }

  // Método para verificar si está intentando reconectar
  public isReconnecting(): boolean {
    return this.reconectando
  }

  // Método para obtener el número de intentos realizados
  public getIntentosRealizados(): number {
    return this.intentosRealizados
  }
}
