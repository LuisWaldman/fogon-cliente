import { io, Socket } from 'socket.io-client'
import type { datosLogin } from '../datosLogin'
import type { ObjetoPosteable } from '../objetoPosteable'
import type { Servidor } from '../servidor'
import { Logger } from '../logger'

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
  listacambiada: () => void
  nrocambiado: () => void
  cancionIniciada: (compas: number, desde: number) => void
  cancionSincronizada: (compas: number, desde: number) => void
  cancionDetenida: () => void
  compasActualizado: (compas: number) => void
  sesionesActualizadas: () => void
  actualizarusuarios: () => void
  time: (hora: number) => void
  sincronizarRTC: (usuario: number) => void
  answerRTC: (SDP: string) => void
  sincronizar(compas: number, delayms: number): void
}

interface ClientToServerEvents {
  iniciarReproduccion(compas: number, delayms: number): void
  sincronizarReproduccion(compas: number, delayms: number): void
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
  private enSesionHandler?: (sesion: string) => void
  public setEnsesionHandler(handler: (sesion: string) => void): void {
    this.enSesionHandler = handler
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

  private cancionSincronizadaHandler?: (compas: number, desde: number) => void
  public setCancionSincronizadaHandler(
    handler: (compas: number, desde: number) => void,
  ): void {
    this.cancionSincronizadaHandler = handler
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

  private listacambiadaHandler?: () => void
  public setListacambiadaHandler(handler: () => void): void {
    this.listacambiadaHandler = handler
  }

  private nrocambiadoHandler?: () => void
  public setNrocambiadoHandler(handler: () => void): void {
    this.nrocambiadoHandler = handler
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

  public async HTTPDELETE(action: string): Promise<Response> {
    return fetch(this.UrlServer + action, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
  }

  public async HTTPPUT(
    urlPut: string,
    body: ObjetoPosteable,
  ): Promise<Response> {
    return fetch(this.UrlServer + urlPut, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(body),
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
      Logger.log('socket disconnected manually')
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
      Logger.log('socket connected')
      this.intentosRealizados = 0 // Resetear en conexión exitosa
      this.reconectando = false
      this.conexionStatusHandler?.('conectado')
    })

    socket.on('connect_error', (error) => {
      this.intentosRealizados++
      Logger.logError('Conectando', error.message)
      if (this.intentosRealizados >= this.maxIntentos) {
        Logger.log('Máximo número de intentos alcanzado, desconectando...')
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
      Logger.log('mensajesesion received with mensaje:', msj)
      this.mensajesesionHandler?.(msj)
    })
    socket.on('rolSesion', (mensaje: string) => {
      Logger.log('rolSesion received with mensaje:', mensaje)
      this.rolSesionHandler?.(mensaje)
    })
    socket.on('sesionesActualizadas', () => {
      Logger.log('sesionesActualizadas received')
      this.sesionesActualizadasHandler?.()
    })

    socket.on('loginSuccess', () => {
      Logger.log('loginSuccess received')
      this.loginSuccessHandler?.()
    })

    socket.on('loginFailed', (error: string) => {
      console.error('loginFailed received with error:', error)
      this.loginFailedHandler?.(error)
    })
    socket.on('ensesion', (sesion: string) => {
      Logger.log('ensesion received with sesion:', sesion)
      this.enSesionHandler?.(sesion)
    })
    socket.on('sesionFailed', (error: string) => {
      console.error('sesionFailed received with error:', error)
      this.sesionFailedHandler?.(error)
    })

    socket.on('cancionIniciada', (compas: number, desde: number) => {
      this.cancionIniciadaHandler?.(compas, desde)
    })
    socket.on('cancionSincronizada', (compas: number, desde: number) => {
      this.cancionSincronizadaHandler?.(compas, desde)
    })
    socket.on('cancionDetenida', () => {
      Logger.log('cancionDetenida received')
      this.cancionDetenidaHandler?.()
    })
    socket.on('sincronizarRTC', (usuario: number) => {
      Logger.log('sincronizarRTC received with usuario:', usuario)
      this.sincronizarRTCHandler?.(usuario)
    })
    socket.on('compasActualizado', (compas: number) => {
      Logger.log('compasActualizado received with compas:', compas)
      this.compasActualizadoHandler?.(compas)
    })
    socket.on('sincronizar', (compas: number, delayms: number) => {
      console.log(
        `sincronizar received with compas: ${compas}, delayms: ${delayms}`,
      )
      this.cancionSincronizadaHandler?.(compas, delayms)
    })
    socket.on('answerRTC', (SDP: string) => {
      Logger.log('answerRTC received with SDP:', SDP)
      this.answerRTCHandler?.(SDP)
    })
    socket.on('time', (hora: number) => {
      this.timeHandler?.(hora)
    })

    socket.on('actualizarusuarios', () => {
      Logger.log('actualizarUsuarios received')
      this.actualizarUsuariosHandler?.()
    })

    socket.on('listacambiada', () => {
      Logger.log('listacambiada received')
      this.listacambiadaHandler?.()
    })

    socket.on('nrocambiado', () => {
      Logger.log('nrocambiado received')
      this.nrocambiadoHandler?.()
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
    this.socket.emit('iniciarReproduccion', compas, delayms)
  }

  public sincronizarReproduccion(compas: number, delayms: number): void {
    this.socket.emit('sincronizarReproduccion', compas, delayms)
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
