import { useAppStore } from './stores/appStore'
import { Reproductor } from './modelo/reproduccion/reproductor'
import { Configuracion } from './modelo/configuracion'
import { datosLogin } from './modelo/datosLogin'
import { ClienteSocket } from './modelo/conexion/ClienteSocket'
import type { ObjetoPosteable } from './modelo/objetoPosteable'
import { Perfil } from './modelo/perfil'
import { ReproductorConectado } from './modelo/reproduccion/reproductorConectado'
import { HelperSincro } from './modelo/sincro/HelperSincro'
import { Sesion } from './modelo/sesion'
import { UserSesion } from './modelo/userSesion'
import { OrigenCancion } from './modelo/cancion/origencancion'
import { CancionManager } from './modelo/cancion/CancionManager'
import { ReproductorMedia } from './modelo/reproduccion/reproductorMedia'
import type { MediaVista } from './modelo/reproduccion/MediaVista'
import { UltimasCanciones } from './modelo/cancion/ultimascanciones'

export default class Aplicacion {
  reproductor: Reproductor = new Reproductor()
  reproductorDesconectado: Reproductor = this.reproductor
  reproductorConectado: ReproductorConectado | null = null
  reproductorMedia: ReproductorMedia | null = null
  configuracion: Configuracion = Configuracion.getInstance()
  cliente: ClienteSocket | null = null
  token: string = ''

  constructor() {
    // Inicialización de la aplicación
    CancionManager.getInstance().SetDB()
    const ultimas = new UltimasCanciones()
    ultimas.filtrarSubidas()
    console.log('Aplicacion inicializada')
    if (this.configuracion.conectarServerDefault) {
      const servidor = this.configuracion.servidores.find(
        (s) => s.nombre === this.configuracion.conectarServerDefault,
      )
      if (servidor) {
        this.conectar(servidor.direccion)
      } else {
        console.warn('Servidor por defecto no encontrado')
      }
    }
  }

  onMounted() {
    console.log('Aplicacion montada')

    const appStore = useAppStore()
    appStore.perfil =
      this.configuracion.perfil || new Perfil('', '', '', '', '')

    const urlParams = new URLSearchParams(window.location.search)
    const cancion = urlParams.get('cancion')
    if (cancion) {
      console.log('cancion', cancion)
      this.SetCancion(new OrigenCancion('sitio', cancion, ''))
    }
  }

  setMediaVista(mediaVista: MediaVista): void {
    if (this.reproductorMedia == null) {
      this.reproductorMedia = new ReproductorMedia()
    }
    this.reproductorMedia.setMediaVista(mediaVista)
    this.reproductor = this.reproductorMedia
  }

  quitarMediaVista(): void {
    this.reproductor = this.reproductorDesconectado
  }

  async SetCancion(origen: OrigenCancion) {
    CancionManager.getInstance()
      .Get(origen)
      .then((cancion) => {
        this.reproductor.SetCancion(origen, cancion)
      })
  }
  updateCompas(compas: number) {
    this.reproductor.updateCompas(compas)
  }

  play() {
    this.reproductor.iniciarReproduccion()
  }

  pause() {
    this.reproductor.detenerReproduccion()
  }

  stop() {
    this.reproductor.detenerReproduccion()
    this.reproductor.updateCompas(0)
  }

  url = ''
  conectar(url: string) {
    const config = Configuracion.getInstance()
    this.url = url
    const appStore = useAppStore()
    appStore.estado = 'conectando'
    this.cliente = new ClienteSocket(url)
    this.cliente.setconexionStatusHandler((status: string) => {
      console.log('status:', status)
      if (status === 'conectado') {
        if (this.cliente) {
          const helper = HelperSincro.getInstance()
          helper.setCliente(this.cliente)
          helper.ActualizarDelayReloj()
          appStore.estado = 'conectado'
        }
      }
      if (status === 'desconectado') {
        appStore.estado = 'desconectado'
        this.reproductor.detenerReproduccion()
        this.reproductor = this.reproductorDesconectado
        this.cliente = null
      }
    })
    this.cliente.setConectadoHandler((token: string) => {
      console.log(`Conectado: ${token}`)
      this.token = token

      if (this.cliente) {
        CancionManager.getInstance().setCliente(this.cliente, token)
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
    console.log(`Conectando al servidor: ${url}`)
    this.cliente.setEnsesionHandler((sesionCreada: string) => {
      console.log(`En sesion: ${sesionCreada}`)
      const appStore = useAppStore()
      appStore.estadoSesion = 'conectado'
      appStore.sesion.nombre = sesionCreada
      if (this.cliente != null) {
        this.reproductorConectado = new ReproductorConectado(
          this.cliente,
          this.token,
        )
        this.reproductorConectado.GetCancionDelFogon()
        this.reproductor.detenerReproduccion()
        this.reproductor = this.reproductorConectado
      }
    })
    this.cliente.setSesionFailedHandler((error: string) => {
      console.error(`Error al crear sesión: ${error}`)
      const appStore = useAppStore()
      appStore.estadoSesion = 'error'
    })
    this.cliente.setRolSesionHandler((mensaje: string) => {
      console.log(`Rol de sesión recibido: ${mensaje}`)
      const appStore = useAppStore()
      appStore.rolSesion = mensaje
    })
    this.cliente.setLoginSuccessHandler(() => {
      const appStore = useAppStore()
      appStore.estado = 'logueado'
      appStore.estadoLogin = 'logueado'
      this.getperfilUsuario()
    })
    this.cliente.setLoginFailedHandler((error: string) => {
      console.error(`Error al iniciar sesión: ${error}`)
      const appStore = useAppStore()
      appStore.estadoLogin = 'error'
    })

    this.cliente.setMensajesesionHandler((msj: string) => {
      console.log(`Mensaje de sesión recibido: ${msj}`)
      const appStore = useAppStore()
      appStore.mensajes.push(msj)
    })

    this.cliente.setActualizarUsuariosHandler(() => {
      console.log('Usuarios actualizados')
      this.CargarUsuariosSesion()
    })
  }
  enviarPerfil(perfil: Perfil) {
    this.HTTPPost('perfil', perfil)
      .then((response: unknown) => {
        const appStore = useAppStore()
        appStore.perfil = perfil
        console.log('Profile updated successfully:', response)
      })
      .catch((error: Error) => {
        console.error('Error updating profile:', error)
      })
  }

  CargarUsuariosSesion() {
    this.HTTPGet('usersesion')
      .then((response) => response.json())
      .then((data) => {
        console.log('Perfiles obtenidos:', data)
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
        console.error('Error al obtener usuarios de la sesion:', error)
      })
  }

  cargarSesiones() {
    this.HTTPGet('sesiones')
      .then((response) => response.json())
      .then((data) => {
        const appStore = useAppStore()
        console.log('Sesiones obtenidas:', data)
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
        console.error('Error al obtener las sesiones del usuario:', error)
      })
  }

  async HTTPGet(urlGet: string): Promise<Response> {
    return fetch(this.url + urlGet, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
  }
  CambioEstadoMedio(estado: number) {
    if (estado == 1) this.reproductor.iniciarReproduccion()
    else if (estado == 2) this.reproductor.detenerReproduccion()
  }
  async HTTPPost(urlPost: string, body: ObjetoPosteable): Promise<Response> {
    console.log('HTTPPost', urlPost, this.token)
    return fetch(this.url + urlPost, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(body),
    })
  }
  getperfilUsuario() {
    this.HTTPGet('perfil')
      .then((response) => response.json())
      .then((data) => {
        const appStore = useAppStore()
        if (data != null) {
          appStore.perfil.imagen = data.Imagen
          appStore.perfil.nombre = data.Nombre
          appStore.perfil.descripcion = data.Descripcion
          appStore.perfil.instrumento = data.Instrumento
        }
      })
      .catch((error) => {
        console.error('Error al obtener el perfil del usuario:', error)
      })
  }
  login(datos: datosLogin): boolean {
    console.log(`Intentando iniciar sesión con usuario: ${datos.usuario}`)
    const appStore = useAppStore()
    appStore.estadoLogin = 'init-login'
    if (!this.cliente) {
      console.error('Cliente no conectado. No se puede iniciar sesión.')
      return false
    }
    this.cliente.login(datos)
    return true
  }

  logout(): boolean {
    const appStore = useAppStore()
    appStore.estadoLogin = ''
    if (!this.cliente) {
      console.error('Cliente no conectado. ')
      return false
    }
    this.cliente.Logout()
    return true
  }

  CrearSesion(nombre: string): void {
    console.log(`Intentando crear sesion: ${nombre}`)
    if (!this.cliente) {
      console.error('Cliente no conectado. No se puede iniciar sesión.')
      return
    }
    const appStore = useAppStore()
    appStore.rolSesion = 'default'
    this.cliente.CrearSesion(nombre, 3.54, 4.34)
  }

  UnirmeSesion(nombre: string): void {
    console.log(`Intentando unirse sesion: ${nombre}`)
    const appStore = useAppStore()
    appStore.rolSesion = 'default'
    if (!this.cliente) {
      console.error('Cliente no conectado. No se puede iniciar sesión.')
      return
    }
    this.cliente.UnirmeSesion(nombre)
  }

  SalirSesion(): void {
    console.log(`Intentando SalirSesion sesion`)
    if (!this.cliente) {
      console.error('Cliente no conectado. No se puede iniciar sesión.')
      return
    }
    const appStore = useAppStore()
    appStore.rolSesion = 'default'
    appStore.estadoSesion = 'desconectado'
    this.reproductor.detenerReproduccion()
    this.reproductor = this.reproductorDesconectado
    this.cliente.SalirSesion()
  }

  MensajeASesion(msj: string): void {
    console.log(`envieando mensaje sesion: ${msj}`)
    if (!this.cliente) {
      console.error('Cliente no conectado. No se puede Mandar mensajes.')
      return
    }
    this.cliente.MensajeASesion(msj)
  }
}
