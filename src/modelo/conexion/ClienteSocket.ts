import { io, Socket } from 'socket.io-client'

interface ServerToClientEvents {
  replica: (usuario: string, datos: string[]) => void
}

interface ClientToServerEvents {
  hola: (mensaje: string) => void
  unirme_sesion(sesion: string): void
}

export class ClienteSocket {
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>

  private replicaHandler?: (datos: string[]) => void
  public setreplicaHandler(handler: (datos: string[]) => void): void {
    this.replicaHandler = handler
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
    })

    socket.on('replica', (usuario: string, datos: string[]) => {
      console.log('replica received with usuario and datos:', usuario, datos)
      this.replicaHandler?.(datos)
    })

    this.socket = socket
  }

  public hola(mensaje: string): void {
    this.socket.emit('hola', mensaje)
  }
  public unirmeSesion(sesion: string): void {
    this.socket.emit('unirme_sesion', sesion)
  }
}
