import { useAppStore } from './stores/appStore'
import { Reproductor } from './modelo/reproductor'
import { Configuracion } from './modelo/configuracion'
import { datosLogin } from './modelo/datosLogin'
import { ClienteSocket } from './modelo/conexion/ClienteSocket'
import { Noticia } from './modelo/noticia'
import type { ObjetoPosteable } from './modelo/objetoPosteable'
import { Perfil } from './modelo/perfil'
import { ReproductorConectado } from './modelo/reproductorConectado'
import { HelperSincro } from './modelo/sincro/HelperSincro'

export default class Aplicacion {
  reproductor: Reproductor = new Reproductor()
  configuracion: Configuracion = Configuracion.getInstance()
  cliente: ClienteSocket | null = null
  token: string = ''

  async SetCancion(cancionstr: string) {
    this.reproductor.SetCancion(cancionstr)
  }

  async cargarNoticiasLocales() {
    const response = await fetch('/noticias/noticiaslocales.json')
    const data = await response.json()

    const newNoticias = []
    for (let i = 0; i < data.length; i++) {
      newNoticias.push(
        new Noticia(
          data[i].fechayhora,
          data[i].titulo,
          data[i].texto,
          data[i].mastexto,
        ),
      )
    }
    const appStore = useAppStore()
    appStore.noticias = newNoticias
  }

  onMounted() {
    console.log('Aplicacion montada')
    this.cargarNoticiasLocales()
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

  constructor() {
    // Inicialización de la aplicación
    console.log('Aplicacion inicializada')
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
        HelperSincro.getInstance().ActualizarDelayReloj(url)
        appStore.estado = 'conectado'
        if (config.loginDefault?.mantenerseLogeado) {
          this.login(config.loginDefault)
        }
      }
    })

    this.cliente.setConectadoHandler((token: string) => {
      console.log(`Conectado: ${token}`)
      this.token = token
    })
    this.cliente.connectar()
    console.log(`Conectando al servidor: ${url}`)
    this.cliente.setEnsesionHandler((sesionCreada: string) => {
      console.log(`En sesion: ${sesionCreada}`)
      const appStore = useAppStore()
      appStore.estadoSesion = 'conectado'
      appStore.sesion.nombre = sesionCreada
      if (this.cliente != null) {
        this.reproductor = new ReproductorConectado(this.cliente, this.token)
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
      const sesiondef = localStorage.getItem('sesionDefault') || ''
      if (sesiondef !== '') {
        this.UnirmeSesion(sesiondef)
      }
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
  }

  async HTTPGet(urlGet: string): Promise<Response> {
    return fetch(this.url + urlGet, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
  }

  async HTTPPost(urlPost: string, body: ObjetoPosteable): Promise<Response> {
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
        appStore.perfil.imagen = data.Imagen
        appStore.perfil.nombre = data.Nombre
        appStore.perfil.descripcion = data.Descripcion
        appStore.perfil.instrumento = data.Instrumento
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
    appStore.perfil = new Perfil('', '', '', '', '')
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
    console.log(`Intentando crear sesion: ${nombre}`)
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
    this.reproductor = new Reproductor()
    this.cliente.SalirSesion()
  }

  MensajeASesion(msj: string): void {
    console.log(`Intentando crear sesion: ${msj}`)
    if (!this.cliente) {
      console.error('Cliente no conectado. No se puede Mandar mensajes.')
      return
    }
    this.cliente.MensajeASesion(msj)
  }
}
