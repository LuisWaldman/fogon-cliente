import { io, Socket } from 'socket.io-client'
import type { datosLogin } from '../datosLogin'

interface ServerToClientEvents {
  replica: (usuario: string, datos: string[]) => void
  loginSuccess: (data: { token: string }) => void
  loginFailed: (error: string) => void
  ensesion: (sesion: string) => void
  sesionFailed: (error: string) => void
  mensajesesion: (mensaje: string) => void
  rolSesion: (mensaje: string) => void
  cancionActualizada: (cancion: string) => void
}

interface ClientToServerEvents {
  actualizarCancion: (cancion: string) => void
  hola: (mensaje: string) => void
  login: (modo: string, usuario: string, password: string) => void
  unirmesesion(sesion: string): void
  crearsesion(sesion: string, latitud: number, longitud: number): void
  mensajeasesion: (mensaje: string) => void
  salirsesion: () => void
  logout: () => void
}

export class ClienteSocket {
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>

  private loginSuccessHandler?: (token: string) => void
  public setLoginSuccessHandler(handler: (token: string) => void): void {
    this.loginSuccessHandler = handler
  }

  private cancionActualizadaHandler?: (cancion: string) => void
  public setCancionActualizadaHandler(
    handler: (cancion: string) => void,
  ): void {
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

  private urlserver: string

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

    socket.on('cancionActualizada', (cancion: string) => {
      console.log('cancionActualizada received with cancion:', cancion)
      this.cancionActualizadaHandler?.(cancion)
    })

    socket.on('mensajesesion', (msj: string) => {
      console.log('mensajesesion received with mensaje:', msj)
      this.mensajesesionHandler?.(msj)
    })
    socket.on('rolSesion', (mensaje: string) => {
      console.log('rolSesion received with mensaje:', mensaje)
      this.rolSesionHandler?.(mensaje)
    })

    socket.on('loginSuccess', (data: { token: string }) => {
      console.log('loginSuccess received with token:', data.token)
      this.loginSuccessHandler?.(data.token)
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

  public actualizarCancion(cancion: string): void {
    this.socket.emit('actualizarCancion', cancion)
  }
}
