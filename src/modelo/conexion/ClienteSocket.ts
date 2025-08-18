import { io, Socket } from 'socket.io-client'
import type { datosLogin } from '../datosLogin'

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
}

interface ClientToServerEvents {
  iniciarReproduccion(compas: number, delayms: number): void
  detenerReproduccion: () => void
  actualizarCompas: (compas: number) => void
  login: (modo: string, usuario: string, password: string) => void
  unirmesesion(sesion: string): void
  crearsesion(sesion: string, latitud: number, longitud: number): void
  mensajeasesion: (mensaje: string) => void
  salirsesion: () => void
  logout: () => void
  gettime: () => void
}

export class ClienteSocket {
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>

  private loginSuccessHandler?: () => void
  public setLoginSuccessHandler(handler: () => void): void {
    this.loginSuccessHandler = handler
  }

  private sesionesActualizadasHandler?: () => void
  public setSesionesActualizadasHandler(handler: () => void): void {
    this.sesionesActualizadasHandler = handler
  }

  private conectadoHandler?: (token: string) => void
  public setConectadoHandler(handler: (token: string) => void): void {
    this.conectadoHandler = handler
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

  private urlserver: string
  public get UrlServer(): string {
    return this.urlserver
  }

  constructor(urlserver: string) {
    this.urlserver = urlserver
  }
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      console.log('socket disconnected manually')
    }
  }

  public connectar(): void {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      this.urlserver,
      {
        autoConnect: true,
        rejectUnauthorized: false,
        transports: ['websocket'],
      },
    )

    socket.on('connect', () => {
      console.log('socket connected')
      this.conexionStatusHandler?.('conectado')
    })

    socket.on('disconnect', (reason) => {
      console.log('socket disconnected:', reason)
      this.conexionStatusHandler?.('desconectado')
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

    socket.on('conectado', (data: { token: string }) => {
      console.log('conectado received with token:', data.token)
      this.conectadoHandler?.(data.token)
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

    socket.on('compasActualizado', (compas: number) => {
      console.log('compasActualizado received with compas:', compas)
      this.compasActualizadoHandler?.(compas)
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
  public CrearSesion(sesion: string, latitud: number, longitud: number): void {
    this.socket.emit('crearsesion', sesion, latitud, longitud)
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
}
