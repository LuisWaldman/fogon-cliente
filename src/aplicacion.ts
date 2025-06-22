import type { Cancion } from './modelo/cancion'
import { useAppStore } from './stores/appStore'
import { Reproductor } from './modelo/reproductor'
import { Reloj } from './modelo/reloj'
import { Configuracion } from './modelo/configuracion'
import { datosLogin } from './modelo/datosLogin'
import { ClienteSocket } from './modelo/conexion/ClienteSocket'
import { Noticia } from './modelo/noticia'
import type { ObjetoPosteable } from './modelo/objetoPosteable'
import { Perfil } from './modelo/perfil'
import { reproductorConectado } from './modelo/reproductorConectado'

export default class Aplicacion {
  reloj: Reloj = new Reloj()
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
    const appStore = useAppStore()
    appStore.compas = compas
  }

  iniciarReproduccion() {
    const appStore = useAppStore()
    if (appStore.cancion) {
      this.reloj.setDuracion(appStore.cancion.duracionGolpe * 1000)
      this.reloj.setIniciaCicloHandler(this.onInicioCiclo.bind(this))
      this.reloj.iniciar()
    }
  }

  onInicioCiclo() {
    const appStore = useAppStore()
    appStore.golpeDelCompas = appStore.golpeDelCompas + 1
    if (appStore.golpeDelCompas >= appStore.cancion.compasCantidad) {
      appStore.compas = appStore.compas + 1
      appStore.golpeDelCompas = 0
    }
  }

  detenerReproduccion() {
    const appStore = useAppStore()
    appStore.estadoReproduccion = 'pausado'
    this.reloj.pausar()
  }

  play() {
    const appStore = useAppStore()
    appStore.estadoReproduccion = 'Reproduciendo'
    this.iniciarReproduccion()
  }

  pause() {
    this.detenerReproduccion()
    const appStore = useAppStore()
    appStore.golpeDelCompas = 0
  }

  stop() {
    this.detenerReproduccion()
    const appStore = useAppStore()
    appStore.compas = -1
    appStore.golpeDelCompas = 0
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
        appStore.estado = 'conectado'
        if (config.loginDefault?.mantenerseLogeado) {
          this.login(config.loginDefault)
        }
      }
    })
    this.cliente.connectar()
    console.log(`Conectando al servidor: ${url}`)
    this.cliente.setEnsesionHandler((sesionCreada: string) => {
      console.log(`Sesión creada exitosamente: ${sesionCreada}`)
      const appStore = useAppStore()
      appStore.estadoSesion = 'conectado'
      appStore.sesion.nombre = sesionCreada
      if (this.cliente != null) {
        this.reproductor = new reproductorConectado(this.cliente)
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
    this.cliente.setLoginSuccessHandler((token: string) => {
      console.log(`Inicio de sesión exitoso. Token: ${token}`)
      const appStore = useAppStore()
      appStore.estado = 'logueado'
      appStore.estadoLogin = 'logueado'
      this.token = token
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
