import { useAppStore } from '../../stores/appStore'
import { Logger } from '../logger'
import { Sesion } from '../sesion'
import { UserSesion, type RolesSesion } from '../userSesion'
import { Perfil } from '../perfil'
import { HelperSincro } from '../sincro/HelperSincro'
import type { Reproductor } from '../reproduccion/reproductor'
import type { Router } from 'vue-router'
import type { ConexionManager } from './ConexionManager'

export class SesionManager {
  private creandoSesion: boolean = false
  private router: Router | null = null
  private conexionManager: ConexionManager
  private reproductor: Reproductor

  constructor(conexionManager: ConexionManager, reproductor: Reproductor) {
    this.conexionManager = conexionManager
    this.reproductor = reproductor
  }

  setRouter(router: Router): void {
    this.router = router
  }

  setupHandlers(nombreSesionAuto?: string): void {
    const cliente = this.conexionManager.getCliente()
    if (!cliente) return

    const helper = HelperSincro.getInstance()

    cliente.setEnsesionHandler((sesionCreada: string, rol: RolesSesion) => {
      this.handleEnSesion(sesionCreada, rol, helper)
    })

    cliente.setSesionFailedHandler((error: string) => {
      this.handleSesionFailed(error)
    })

    cliente.setRolSesionHandler((mensaje: RolesSesion) => {
      const appStore = useAppStore()
      appStore.rolSesion = mensaje
    })

    if (nombreSesionAuto) {
      this.cargarSesiones(nombreSesionAuto)
    } else {
      this.cargarSesiones()
    }
  }

  private handleEnSesion(
    sesionCreada: string,
    rol: RolesSesion,
    helper: HelperSincro,
  ): void {
    const appStore = useAppStore()
    const cliente = this.conexionManager.getCliente()

    appStore.estadosApp.estadoSesion = 'conectado'
    appStore.rolSesion = rol
    appStore.sesion.nombre = sesionCreada
    helper.ActualizarDelayRelojRTC()

    if (cliente) {
      this.reproductor.detenerReproduccion()
      this.reproductor.conectar(
        cliente,
        this.conexionManager.token,
        this.creandoSesion,
      )
      this.creandoSesion = false

      // Redirigir si es necesario (esto debería ser configurable)
      if (
        sesionCreada === 'Fogon de Luis' &&
        appStore.rolSesion === 'visitante'
      ) {
        this.router?.push('/tocar')
      }
    }
  }

  private handleSesionFailed(error: string): void {
    Logger.logError('Error al crear sesión:', error)
    const appStore = useAppStore()
    appStore.estadosApp.estadoSesion = 'error'
    Logger.logError('Inicio sesion', error)
  }

  crearSesion(nombreSesion: string, defaultEnSesion: RolesSesion): void {
    const cliente = this.conexionManager.getCliente()
    if (!cliente) {
      Logger.logError('CrearSesion', 'Cliente no conectado')
      return
    }

    const appStore = useAppStore()
    appStore.rolSesion = 'director'
    appStore.estadosApp.texto = 'Creando sesión...'
    this.creandoSesion = true

    cliente.CrearSesion(nombreSesion, defaultEnSesion)
  }

  unirmeSesion(nombre: string): void {
    const cliente = this.conexionManager.getCliente()
    if (!cliente) {
      Logger.logError('UnirmeSesion', 'Cliente no conectado')
      return
    }

    const appStore = useAppStore()
    appStore.rolSesion = 'admin'
    cliente.UnirmeSesion(nombre)
  }

  salirSesion(): void {
    const cliente = this.conexionManager.getCliente()
    if (!cliente) {
      Logger.logError(
        'SalirSesion',
        'Cliente no conectado. No se puede salir de la sesión.',
      )
      return
    }

    const appStore = useAppStore()
    appStore.rolSesion = 'admin'
    appStore.estadosApp.estadoSesion = 'desconectado'
    this.reproductor.desconectar()
    this.reproductor.detenerReproduccion()
    cliente.SalirSesion()
  }

  mensajeASesion(msj: string): void {
    const cliente = this.conexionManager.getCliente()
    if (!cliente) {
      Logger.logError('MensajeASesion', 'Cliente no conectado')
      return
    }
    cliente.MensajeASesion(msj)
  }

  darRolAUsuario(idUsuario: number, rol: RolesSesion): void {
    const cliente = this.conexionManager.getCliente()
    if (!cliente) {
      Logger.logError('DarRolAUsuario', 'Cliente no conectado')
      return
    }
    cliente.DarRolAUsuario(idUsuario, rol)
  }

  cargarUsuariosSesion(): void {
    this.conexionManager
      .HTTPGet('usersesion')
      .then((response) => response.json())
      .then((data) => {
        Logger.log('Perfiles obtenidos:', data)
        const appStore = useAppStore()
        appStore.usuariosSesion = []
        data.forEach(
          (item: {
            ID: string
            Usuario: string
            RolSesion: RolesSesion
            Perfil: {
              Usuario: string
              Imagen: string
              Nombre: string
              Descripcion: string
              Instrumento: string
            }
          }) => {
            appStore.usuariosSesion.push(
              new UserSesion(
                item.ID,
                item.Usuario,
                new Perfil(
                  item.Perfil.Imagen,
                  item.Perfil.Usuario,
                  item.Perfil.Nombre,
                  item.Perfil.Descripcion,
                  item.Perfil.Instrumento,
                ),
                item.RolSesion,
              ),
            )
          },
        )
      })
      .catch((error) => {
        Logger.logError('Usuarios de la sesion', error.message)
      })
  }

  cargarSesiones(nombreSesionAuto?: string): void {
    this.conexionManager
      .HTTPGet('sesiones')
      .then((response) => response.json())
      .then((data) => {
        const appStore = useAppStore()
        Logger.log('Sesiones obtenidas:', data)
        appStore.sesiones = []
        let iniciarSesionAuto = false

        data.forEach(
          (item: {
            Nombre: string
            Usuarios: number
            Estado: string
            Latitud: number
            Longitud: number
          }) => {
            appStore.sesiones.push(
              new Sesion(
                item.Nombre,
                item.Usuarios,
                item.Estado,
                item.Latitud,
                item.Longitud,
              ),
            )
            if (nombreSesionAuto && item.Nombre === nombreSesionAuto) {
              iniciarSesionAuto = true
            }
          },
        )

        if (iniciarSesionAuto && appStore.rolSesion === 'noasignado') {
          this.unirmeSesion(nombreSesionAuto!)
        }
      })
      .catch((error) => {
        Logger.logError('Sesiones del usuario', error.message)
      })
  }
}
