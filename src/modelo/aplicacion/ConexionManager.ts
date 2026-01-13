import { useAppStore } from '../../stores/appStore'
import { ClienteSocket } from '../conexion/ClienteSocket'
import { CancionManager } from '../cancion/CancionManager'
import { HelperSincro } from '../sincro/HelperSincro'
import type { Servidor } from '../servidor'
import { Logger } from '../logger'
import type { Perfil } from '../perfil'
import type { ObjetoPosteable } from '../objetoPosteable'

export class ConexionManager {
  private cliente: ClienteSocket | null = null
  private url: string = ''
  token: string = ''

  getCliente(): ClienteSocket | null {
    return this.cliente
  }

  getUrl(): string {
    return this.url
  }

  isConnected(): boolean {
    return this.cliente !== null
  }

  conectar(
    servidor: Servidor,
    onConectadoCallback?: (token: string) => void,
    onStatusCallback?: (status: string) => void,
  ): void {
    this.url = servidor.direccion
    const appStore = useAppStore()
    const helper = HelperSincro.getInstance()

    appStore.estado = 'conectando'
    appStore.estadosApp.estadoconeccion = 'conectando'
    appStore.estadosApp.texto = 'Conectando al servidor...'

    this.cliente = new ClienteSocket(servidor)

    this.cliente.setconexionStatusHandler((status: string) => {
      this.handleConexionStatus(status, helper)
      if (onStatusCallback) {
        onStatusCallback(status)
      }
    })

    this.cliente.setConectadoHandler((token: string) => {
      this.handleConectado(token)
      if (onConectadoCallback) {
        onConectadoCallback(token)
      }
    })

    this.cliente.connectar()
  }

  private handleConexionStatus(status: string, helper: HelperSincro): void {
    const appStore = useAppStore()
    if (status === 'conectado') {
      if (this.cliente) {
        helper.setCliente(this.cliente)
        helper.ActualizarDelayReloj()
        appStore.estado = 'conectado'
        appStore.estadosApp.estadoconeccion = 'conectado'
        appStore.estadosApp.texto = 'Conectado al servidor'
      }
    } else if (status === 'desconectado') {
      appStore.estado = 'desconectado'
      appStore.estadosApp.estadoconeccion = 'desconectado'
      appStore.estadosApp.estadoSesion = 'desconectado'
      appStore.estadosApp.estadoLogin = 'desconectado'
      appStore.estadosApp.texto = 'Desconectado del servidor'
    } else if (status === 'error') {
      appStore.estadosApp.estadoconeccion = 'error'
    }
  }

  private handleConectado(token: string): void {
    const appStore = useAppStore()
    this.token = token
    appStore.estadosApp.nombreServidor = this.cliente?.GetServerNombre() || ''
    if (this.cliente) {
      CancionManager.getInstance().setCliente(this.cliente)
    }
  }

  enviarPerfil(perfil: Perfil): void {
    this.HTTPPost('perfil', perfil)
      .then((response: unknown) => {
        const appStore = useAppStore()
        appStore.perfil = perfil
        Logger.log('Profile updated successfully:', response)
      })
      .catch((error: Error) => {
        Logger.logError('Profile update', error.message)
      })
  }

  async HTTPGet(urlGet: string): Promise<Response> {
    if (!this.cliente) {
      throw new Error('Cliente no conectado')
    }
    return this.cliente.HTTPGET(urlGet)
  }

  async HTTPPost(urlPost: string, body: ObjetoPosteable): Promise<Response> {
    if (!this.cliente) {
      throw new Error('Cliente no conectado')
    }
    return this.cliente.HTTPPost(urlPost, body)
  }

  setSesionesActualizadasHandler(callback: () => void): void {
    this.cliente?.setSesionesActualizadasHandler(callback)
  }

  setMensajesesionHandler(callback: (mensaje: string) => void): void {
    this.cliente?.setMensajesesionHandler(callback)
  }

  setActualizarUsuariosHandler(callback: () => void): void {
    this.cliente?.setActualizarUsuariosHandler(callback)
  }
}
