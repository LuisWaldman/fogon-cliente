import { useAppStore } from './stores/appStore'
import { Reproductor } from './modelo/reproduccion/reproductor'
import { Configuracion } from './modelo/configuracion'
import { datosLogin } from './modelo/datosLogin'
import { ClienteSocket } from './modelo/conexion/ClienteSocket'
import type { ObjetoPosteable } from './modelo/objetoPosteable'
import { Perfil } from './modelo/perfil'
import { HelperSincro } from './modelo/sincro/HelperSincro'
import { Sesion } from './modelo/sesion'
import { UserSesion } from './modelo/userSesion'
import { CancionManager } from './modelo/cancion/CancionManager'
import { UltimasCanciones } from './modelo/cancion/ultimascanciones'
import type { Servidor } from './modelo/servidor'
import { IndiceHelper } from './modelo/indices/IndiceHelper'
import { Logger } from './modelo/logger'
import type { Router } from 'vue-router'
import type { ItemIndiceCancion } from './modelo/cancion/ItemIndiceCancion'

export default class Aplicacion {
  reproductor: Reproductor = new Reproductor()
  configuracion: Configuracion = Configuracion.getInstance()
  indiceHelper: IndiceHelper = IndiceHelper.getInstance()
  cliente: ClienteSocket | null = null
  router: Router | null = null
  token: string = ''
  creandoSesion: boolean = false
  public setRouter(router: Router) {
    this.router = router
  }

  constructor() {
    CancionManager.getInstance().SetDB()
    const ultimas = new UltimasCanciones()
    ultimas.filtrarSubidas()
  }
  public GetServerDefault(): Servidor | null {
    if (this.configuracion.conectarServerDefault) {
      const servidor = this.configuracion.servidores.find(
        (s) => s.nombre === this.configuracion.conectarServerDefault,
      )
      if (servidor) {
        return servidor
      }
    }

    return null
  }

  onMounted() {
    const appStore = useAppStore()
    appStore.estadosApp.texto = 'Iniciando aplicacion...'

    if (this.configuracion.perfil == null) {
      const numeroAleatorio = Math.floor(Math.random() * 12) + 1
      const imagen = `/img/usuariofantasma${numeroAleatorio}.${numeroAleatorio === 1 ? 'png' : 'jpg'}`
      this.configuracion.perfil = new Perfil(imagen, 'nuevo', '', '', '')
      this.configuracion.guardarEnLocalStorage()
    }
    appStore.perfil = this.configuracion.perfil
    if (navigator.onLine) {
      const servidor = this.GetServerDefault()
      if (servidor) {
        this.conectar(servidor)
      } else {
      }
    } else {
      this.PrepararPaginaInicio()
    }
    this.PrepararPaginaInicio()
  }
  async PrepararPaginaInicio() {
    const appStore = useAppStore()
    appStore.estadosApp.texto = 'Preparando pagina de inicio...'
    appStore.estadosApp.paginaLista = ''
    /* CARGA TODO DE LA PAGINA DE INICIO */
    await this.indiceHelper.CargarIndice()
    appStore.estadosApp.paginaLista = 'inicio'
    appStore.estadosApp.estado = 'ok'
  }

  async ClickTocar(origen: ItemIndiceCancion) {
    this.reproductor.ClickCancion(origen)
    this.router?.push('/tocar')
  }
  async ClickTocarLista(lista: ItemIndiceCancion[]) {
    const appStore = useAppStore()
    appStore.estadosApp.paginaLista = ''
    appStore.estadosApp.estado = 'cargando'
    appStore.estadosApp.texto = 'Cargando lista de reproduccion...'
    await this.reproductor.ClickTocarLista(lista)
    this.router?.push('/tocar')
  }

  async ClickCancionNro(nro: number) {
    const appStore = useAppStore()
    appStore.estadosApp.paginaLista = ''
    appStore.estadosApp.estado = 'cargando'
    appStore.estadosApp.texto = 'Cargando cancion...'
    this.reproductor.ClickCancionNro(nro)
    this.router?.push('/tocar')
  }

  async ClickAgregarAListaReproduccion(item: ItemIndiceCancion) {
    this.reproductor.AgregarAListaReproduccion(item)
  }

  updateCompas(compas: number) {
    this.reproductor.updateCompas(compas)
  }

  play() {
    this.reproductor.iniciarReproduccion()
  }

  async sincronizar() {
    await this.reproductor.sincronizar()
  }
  next() {
    const appStore = useAppStore()
    appStore.estadosApp.paginaLista = ''
    appStore.estadosApp.estado = 'cargando'
    appStore.estadosApp.texto = 'Cargando cancion...'
    this.reproductor.Next()
  }

  pause() {
    this.reproductor.detenerReproduccion()
  }

  stop() {
    this.reproductor.detenerReproduccion()
    this.reproductor.updateCompas(0)
  }

  url = ''
  conectar(servidor: Servidor) {
    const config = Configuracion.getInstance()
    this.url = servidor.direccion
    const appStore = useAppStore()
    appStore.estado = 'conectando'
    appStore.estadosApp.estadoconeccion = 'conectando'
    appStore.estadosApp.estadoSesion = 'desconectado'
    appStore.estadosApp.estadoLogin = 'desconectado'
    appStore.estadosApp.texto = 'Conectando al servidor...'
    const helper = HelperSincro.getInstance()
    this.cliente = new ClienteSocket(servidor)
    this.cliente.setconexionStatusHandler((status: string) => {
      if (status === 'conectado') {
        if (this.cliente) {
          helper.setCliente(this.cliente)
          helper.ActualizarDelayReloj()
          appStore.estado = 'conectado'
          appStore.estadosApp.estadoconeccion = 'conectado'
          appStore.estadosApp.texto = 'Conectado al servidor'
        }
      }
      if (status === 'desconectado') {
        appStore.estado = 'desconectado'
        appStore.estadosApp.estadoconeccion = 'desconectado'
        appStore.estadosApp.texto = 'Desconectado del servidor'
        this.reproductor.desconectar()
        this.reproductor.detenerReproduccion()
        // this.cliente = null
      }
      if (status === 'error') {
        appStore.estadosApp.estadoconeccion = 'error'
      }
    })
    this.cliente.setConectadoHandler((token: string) => {
      this.token = token
      appStore.estadosApp.nombreServidor = this.cliente?.GetServerNombre() || ''
      if (this.cliente) {
        CancionManager.getInstance().setCliente(this.cliente)
      }
      if (this.configuracion && this.configuracion.perfil) {
        this.enviarPerfil(this.configuracion.perfil)
      }
      this.cargarSesiones()
      const urlParams = new URLSearchParams(window.location.search)
      const sesionurl = urlParams.get('sesion')
      if (config.loginDefault?.mantenerseLogeado) {
        this.login(config.loginDefault)
      }
      if (sesionurl) {
        this.UnirmeSesion(sesionurl.replace(/_/g, ' '))
      }
    })
    this.cliente.setSesionesActualizadasHandler(() => {
      this.cargarSesiones()
    })

    this.cliente.connectar()
    this.cliente.setEnsesionHandler((sesionCreada: string) => {
      const appStore = useAppStore()
      appStore.estadosApp.estadoSesion = 'conectado'
      appStore.sesion.nombre = sesionCreada
      helper.ActualizarDelayRelojRTC()
      if (this.cliente != null) {
        this.reproductor.detenerReproduccion()
        this.reproductor.conectar(this.cliente, this.token, this.creandoSesion)
        this.creandoSesion = false
      }
    })
    this.cliente.setSesionFailedHandler((error: string) => {
      console.error(`Error al crear sesión: ${error}`)
      const appStore = useAppStore()
      appStore.estadosApp.estadoSesion = 'error'
      Logger.logError('Inicio sesion', error)
    })
    this.cliente.setRolSesionHandler((mensaje: string) => {
      const appStore = useAppStore()
      appStore.rolSesion = mensaje
    })
    this.cliente.setLoginSuccessHandler(async () => {
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
    })
    this.cliente.setLoginFailedHandler((error: string) => {
      const appStore = useAppStore()
      appStore.estadosApp.estadoLogin = 'error'
      Logger.logError('Login', error)
    })

    this.cliente.setMensajesesionHandler((msj: string) => {
      const appStore = useAppStore()
      appStore.mensajes.push(msj)
    })

    this.cliente.setActualizarUsuariosHandler(() => {
      Logger.log('Usuarios actualizados')
      this.CargarUsuariosSesion()
    })
  }
  enviarPerfil(perfil: Perfil) {
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

  CargarUsuariosSesion() {
    this.HTTPGet('usersesion')
      .then((response) => response.json())
      .then((data) => {
        Logger.log('Perfiles obtenidos:', data)
        const appStore = useAppStore()
        appStore.usuariosSesion = []
        data.forEach(
          (item: {
            ID: string
            Usuario: string
            RolSesion: string
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

  cargarSesiones() {
    this.HTTPGet('sesiones')
      .then((response) => response.json())
      .then((data) => {
        const appStore = useAppStore()
        Logger.log('Sesiones obtenidas:', data)
        appStore.sesiones = []
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
          },
        )
      })
      .catch((error) => {
        Logger.logError('Sesiones del usuario', error.message)
      })
  }

  async HTTPGet(urlGet: string): Promise<Response> {
    return this.cliente?.HTTPGET(urlGet) as Promise<Response>
  }
  CambioEstadoMedio(estado: number) {
    if (estado == 1) this.reproductor.iniciarReproduccion()
    else if (estado == 2) this.reproductor.detenerReproduccion()
  }
  async HTTPPost(urlPost: string, body: ObjetoPosteable): Promise<Response> {
    return this.cliente?.HTTPPost(urlPost, body) as Promise<Response>
  }
  datosUsuarioLogeado: datosLogin | null = null
  login(datos: datosLogin): boolean {
    this.datosUsuarioLogeado = datos
    const appStore = useAppStore()
    appStore.estadosApp.estadoLogin = 'init-login'
    if (!this.cliente) {
      return false
    }
    this.cliente.login(datos)
    return true
  }

  logout(): boolean {
    const appStore = useAppStore()
    appStore.estadosApp.estadoLogin = 'desconectado'
    if (!this.cliente) {
      return false
    }
    this.cliente.Logout()
    return true
  }

  CrearSesion(nombre: string): void {
    if (!this.cliente) {
      return
    }
    const appStore = useAppStore()
    appStore.rolSesion = 'director'
    appStore.estadosApp.estado = ''
    appStore.estadosApp.texto = 'Creando sesión...'
    this.creandoSesion = true
    this.cliente.CrearSesion(nombre)
  }

  UnirmeSesion(nombre: string): void {
    const appStore = useAppStore()
    appStore.rolSesion = 'default'
    if (!this.cliente) {
      return
    }
    this.cliente.UnirmeSesion(nombre)
  }

  SalirSesion(): void {
    if (!this.cliente) {
      Logger.logError(
        'SalirSesion',
        'Cliente no conectado. No se puede salir de la sesión.',
      )
      return
    }
    const appStore = useAppStore()
    appStore.rolSesion = 'default'
    appStore.estadosApp.estadoSesion = 'desconectado'
    this.reproductor.desconectar()
    this.reproductor.detenerReproduccion()
    this.cliente.SalirSesion()
  }

  MensajeASesion(msj: string): void {
    if (!this.cliente) {
      return
    }
    this.cliente.MensajeASesion(msj)
  }
}
