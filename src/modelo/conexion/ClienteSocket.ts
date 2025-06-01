import { io, Socket } from 'socket.io-client'
import type { datosLogin } from '../datosLogin'

interface ServerToClientEvents {
  replica: (usuario: string, datos: string[]) => void
  loginSuccess: (data: { token: string }) => void
}

interface ClientToServerEvents {
  hola: (mensaje: string) => void
  login: (modo: string, usuario: string, password: string) => void
  unirme_sesion(sesion: string): void
}

export class ClienteSocket {
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>

  private replicaHandler?: (datos: string[]) => void
  public setreplicaHandler(handler: (datos: string[]) => void): void {
    this.replicaHandler = handler
  }

  private loginSuccessHandler?: (token: string) => void
  public setLoginSuccessHandler(handler: (token: string) => void): void {
    this.loginSuccessHandler = handler
  }

  private conexionStatusHandler?: (status: string) => void
  public setconexionStatusHandler(handler: (status: string) => void): void {
    this.conexionStatusHandler = handler
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

    socket.on('replica', (usuario: string, datos: string[]) => {
      console.log('replica received with usuario and datos:', usuario, datos)
      this.replicaHandler?.(datos)
    })

    socket.on('loginSuccess', (data: { token: string }) => {
      console.log('loginSuccess received with token:', data.token)
      this.loginSuccessHandler?.(data.token)
    })

    this.socket = socket
  }

  public hola(mensaje: string): void {
    this.socket.emit('hola', mensaje)
  }
  public unirmeSesion(sesion: string): void {
    this.socket.emit('unirme_sesion', sesion)
  }

  login(datos: datosLogin) {
    this.socket.emit('login', datos.modo, datos.usuario, datos.password)
  }
}
