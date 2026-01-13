import { useAppStore } from '../../stores/appStore'
import { Reproductor } from '../reproduccion/reproductor'
import { Configuracion } from '../configuracion'
import { datosLogin } from '../datosLogin'
import { Perfil } from '../perfil'
import { CancionManager } from '../cancion/CancionManager'
import { UltimasCanciones } from '../cancion/ultimascanciones'
import type { Servidor } from '../servidor'
import { IndiceHelper } from '../indices/IndiceHelper'
import type { Router } from 'vue-router'
import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { OrigenCancion } from '../cancion/origencancion'
import { ConexionManager } from './ConexionManager'
import { SesionManager } from './SesionManager'
import { AutenticacionManager } from './AutenticacionManager'
import type { RolesSesion } from '../userSesion'

export default class Aplicacion {
  reproductor: Reproductor = new Reproductor()
  configuracion: Configuracion = Configuracion.getInstance()
  indiceHelper: IndiceHelper = IndiceHelper.getInstance()
  conexionManager: ConexionManager = new ConexionManager()
  sesionManager: SesionManager
  autenticacionManager: AutenticacionManager
  router: Router | null = null

  public setRouter(router: Router) {
    this.router = router
    this.sesionManager.setRouter(router)
  }

  constructor() {
    CancionManager.getInstance().SetDB()
    const ultimas = new UltimasCanciones()
    ultimas.filtrarSubidas()

    this.sesionManager = new SesionManager(
      this.conexionManager,
      this.reproductor,
    )
    this.autenticacionManager = new AutenticacionManager(this.conexionManager)
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

    this.PrepararPaginaInicio()

    if (navigator.onLine) {
      const servidor = this.GetServerDefault()
      if (servidor) {
        this.conectar(servidor)
      }
    }
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

  async ClickEditar(cancion: ItemIndiceCancion) {
    await this.reproductor.ClickCancion(cancion)
    const appStore = useAppStore()
    appStore.editandocancion = appStore.aplicacion.reproductor.cancion
    appStore.origenEditando = new OrigenCancion(
      appStore.origenCancion.origenUrl,
      appStore.origenCancion.fileName,
      appStore.origenCancion.usuario,
    )
    this.router?.push('/editar')
  }
  async ClickTocarLista(lista: ItemIndiceCancion[]) {
    const appStore = useAppStore()
    appStore.estadosApp.paginaLista = ''
    await this.reproductor.ClickTocarLista(lista)
    this.router?.push('/tocar')
  }

  UnirmeSesion(nombre: string) {
    this.sesionManager.unirmeSesion(nombre)
  }

  SalirSesion() {
    this.sesionManager.salirSesion()
  }

  CrearSesion() {
    if (this.configuracion.perfil) {
      this.sesionManager.crearSesion(
        this.configuracion.perfil.nombreSesion,
        this.configuracion.perfil.defaultEnSesion,
      )
    }
  }

  async ClickCancionNro(nro: number) {
    const appStore = useAppStore()
    appStore.estadosApp.paginaLista = ''
    this.reproductor.ClickCancionNro(nro)
    this.router?.push('/tocar')
  }

  next() {
    this.reproductor.Next()
  }

  url = ''
  conectar(servidor: Servidor) {
    const config = Configuracion.getInstance()
    const appStore = useAppStore()

    appStore.estadosApp.estadoSesion = 'desconectado'
    appStore.estadosApp.estadoLogin = 'desconectado'

    this.conexionManager.conectar(
      servidor,
      (token: string) => this.onConectado(token, config),
      (status: string) => this.onStatusChange(status),
    )

    // Configurar handlers adicionales
    this.conexionManager.setMensajesesionHandler((msj: string) => {
      appStore.mensajes.push(msj)
    })

    this.conexionManager.setSesionesActualizadasHandler(() => {
      this.sesionManager.cargarSesiones('Fogon de Luis')
    })

    this.conexionManager.setActualizarUsuariosHandler(() => {
      this.sesionManager.cargarUsuariosSesion()
    })

    this.sesionManager.setupHandlers('Fogon de Luis')
    this.autenticacionManager.setupHandlers()
  }

  private onConectado(_token: string, config: Configuracion): void {
    if (this.configuracion?.perfil) {
      this.conexionManager.enviarPerfil(this.configuracion.perfil)
    }

    this.sesionManager.cargarSesiones('Fogon de Luis')

    const urlParams = new URLSearchParams(window.location.search)
    const sesionurl = urlParams.get('sesion')

    if (config.loginDefault?.mantenerseLogeado) {
      this.login(config.loginDefault)
    }

    if (sesionurl) {
      this.unirmeSesion(sesionurl.replace(/_/g, ' '))
    }
  }

  private onStatusChange(status: string): void {
    if (status === 'desconectado') {
      this.reproductor.desconectar()
      this.reproductor.detenerReproduccion()
    }
  }

  CambioEstadoMedio(estado: number) {
    if (estado === 1) {
      this.reproductor.iniciarReproduccion()
    } else if (estado === 2) {
      this.reproductor.detenerReproduccion()
    }
  }

  login(datos: datosLogin): boolean {
    return this.autenticacionManager.login(datos)
  }

  logout(): boolean {
    return this.autenticacionManager.logout()
  }

  crearSesion(): void {
    if (this.configuracion.perfil) {
      this.sesionManager.crearSesion(
        this.configuracion.perfil.nombreSesion,
        this.configuracion.perfil.defaultEnSesion,
      )
    }
  }

  unirmeSesion(nombre: string): void {
    this.sesionManager.unirmeSesion(nombre)
  }

  salirSesion(): void {
    this.sesionManager.salirSesion()
  }

  mensajeASesion(msj: string): void {
    this.sesionManager.mensajeASesion(msj)
  }

  darRolAUsuario(idUsuario: number, rol: RolesSesion): void {
    this.sesionManager.darRolAUsuario(idUsuario, rol)
  }
}
