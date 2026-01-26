import { useAppStore } from '../../stores/appStore'
import { datosLogin } from '../datosLogin'
import { Logger } from '../logger'
import { CancionManager } from '../cancion/CancionManager'
import type { ConexionManager } from './ConexionManager'

export class AutenticacionManager {
  private datosUsuarioLogeado: datosLogin | null = null
  private conexionManager: ConexionManager

  constructor(conexionManager: ConexionManager) {
    this.conexionManager = conexionManager
  }

  setupHandlers(): void {
    const cliente = this.conexionManager.getCliente()
    if (!cliente) return

    cliente.setLoginSuccessHandler(async () => {
      this.handleLoginSuccess()
    })

    cliente.setLoginFailedHandler((error: string) => {
      this.handleLoginFailed(error)
    })
  }

  private handleLoginSuccess(): void {
    const appStore = useAppStore()
    appStore.estado = 'logueado'
    appStore.estadosApp.estadoLogin = 'logueado'
    appStore.perfil.usuario = this.datosUsuarioLogeado?.usuario || ''
    Logger.log('Login exitoso')

    CancionManager.getInstance()
      .listasServerManager?.GetListas()
      .then((listas) => {
        appStore.listasEnServer = listas
        Logger.log('Listas en server cargadas:', listas)
      })
      .catch((error) => {
        Logger.logError('Error al cargar listas', error.message)
      })
  }

  private handleLoginFailed(error: string): void {
    const appStore = useAppStore()
    appStore.estadosApp.estadoLogin = 'error'
    Logger.logError('Login', error)
  }

  login(datos: datosLogin): boolean {
    const cliente = this.conexionManager.getCliente()
    if (!cliente) {
      Logger.logError('Login', 'Cliente no conectado')
      return false
    }

    this.datosUsuarioLogeado = datos
    const appStore = useAppStore()
    appStore.estadosApp.estadoLogin = 'init-login'
    cliente.login(datos)
    return true
  }

  logout(): boolean {
    const cliente = this.conexionManager.getCliente()
    if (!cliente) {
      Logger.logError('Logout', 'Cliente no conectado')
      return false
    }

    const appStore = useAppStore()
    appStore.estadosApp.estadoLogin = 'desconectado'
    this.datosUsuarioLogeado = null
    cliente.Logout()
    return true
  }

  getDatosUsuarioLogeado(): datosLogin | null {
    return this.datosUsuarioLogeado
  }
}
