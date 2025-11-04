import { datosLogin } from './datosLogin'
import { Servidor } from './servidor' // Nueva importación
import { Perfil } from './perfil'
export class VistaTocar {
  public tamanioLetra: number = 22
  public modo: string = 'doble' // 'simple', 'doble', 'triple'
  public muestra: string = 'karaoke' // 'simple', 'doble', 'triple'
  public muestraLetra: boolean = false
  public viendoPartituras: boolean = false
  public reproduce: string = 'video' // 'simple', 'doble', 'triple'
  public invertido: boolean = false
  public viendoSecuencia: boolean = false
  public viendoInstrucciones: boolean = false
  public viendoCuadrado: boolean = false
  public viendoSecuencia3: boolean = false
  public viendoInstrucciones3: boolean = false
  public viendoCuadrado3: boolean = false
  public tamanioAcorde: number = 23
  public tamanioAcordesolo: number = 16
  public viendoResumenVerso: boolean = false
  public tamanioParte: number = 16
  public tamanioAcordeParte: number = 26
  public anchoPrincipal: number = 70 // Ancho de la parte principal
  public altoReproductor: number = 70 // Alto del reproductor
  public anchoTerciaria: number = 30 // Ancho de la parte terciaria
  public altoPantallaDescuento: number = 200 // Nueva propiedad
  public AutoScroll: boolean = true
  public factorScroll: number = 1.4 // Nueva propiedad para el factor de scroll
  public columnas: number = 78 // Nueva propiedad para el número de columnas
}

export class Configuracion {
  obtenerURLConectar(serverName: string) {
    const server = this.servidores.find((s) => s.nombre === serverName)
    if (server) {
      return server.direccion
    }
    return '' // Retorna vacío si no se encuentra el servidor
  }
  public vistasTocar: VistaTocar[] = [
    // 0: Celular, 1: PC, 2: Pantalla grande
    new VistaTocar(),
  ]
  public servidores: Servidor[] = []
  public conectarServerDefault: string = ''
  public loginDefault: datosLogin | null = null
  public perfil: Perfil | null = null

  GetConfiguracionPantalla() {
    return this.vistasTocar[0] // Siempre retorna la configuración para PC
  }
  private static instance: Configuracion | null = null
  static VERSION = 8 // Incremented version
  public volumen: number = 50
  public mostrarAcordes: boolean = true

  private constructor() {}

  static getInstance(): Configuracion {
    if (!Configuracion.instance) {
      Configuracion.instance = Configuracion.cargarDesdeLocalStorage()
    }
    return Configuracion.instance
  }
  private static cargarDesdeLocalStorage(): Configuracion {
    const conf = new Configuracion()
    const data = localStorage.getItem('configuracion')

    if (data) {
      try {
        const obj = JSON.parse(data)
        if (obj.VERSION === Configuracion.VERSION) {
          // Version match: load everything
          conf.volumen = obj.volumen
          conf.mostrarAcordes = obj.mostrarAcordes

          conf.conectarServerDefault =
            typeof obj.conectarServerDefault === 'string'
              ? obj.conectarServerDefault
              : ''

          if (obj.loginDefault) {
            const mantenerseLogeado =
              typeof obj.loginDefault.mantenerseLogeado === 'boolean'
                ? obj.loginDefault.mantenerseLogeado
                : true
            conf.loginDefault = new datosLogin(
              obj.loginDefault.modo,
              obj.loginDefault.usuario,
              obj.loginDefault.password,
              mantenerseLogeado,
            )
          }

          if (obj.perfil) {
            conf.perfil = new Perfil(
              obj.perfil.imagen,
              obj.perfil.nombre,
              obj.perfil.usuario,
              obj.perfil.descripcion,
              obj.perfil.instrumento,
            )
            conf.perfil.nombreSesion = obj.perfil.nombreSesion || ''
            conf.perfil.CifradoLatino = obj.perfil.CifradoLatino || false
            conf.perfil.instrumentosFavoritos =
              Array.isArray(obj.perfil.instrumentosFavoritos) &&
              obj.perfil.instrumentosFavoritos.every(
                (i: unknown) => typeof i === 'string',
              )
                ? obj.perfil.instrumentosFavoritos
                : []
          }

          if (
            obj.vistasTocar &&
            Array.isArray(obj.vistasTocar) &&
            obj.vistasTocar.length === 1
          ) {
            conf.vistasTocar = obj.vistasTocar.map((v: unknown) =>
              Object.assign(new VistaTocar(), v),
            )
          }

          if (obj.servidores && Array.isArray(obj.servidores)) {
            conf.servidores = obj.servidores.map(
              (s: { nombre: string; direccion: string }) =>
                new Servidor(s.nombre, s.direccion),
            )
          }
        }
        // If version mismatch, conf remains mostly a new instance with its defaults.
      } catch (e) {
        console.error('Error al cargar configuración desde localStorage:', e)
        // On error, conf remains mostly a new instance.
      }
    }

    // Post-processing for servidores and conectarServerDefault
    if (conf.servidores.length === 0) {
      // No servers loaded (fresh install, version mismatch, corrupted/empty array in storage)
      conf.servidores.push(new Servidor('desa', 'http://localhost:8080/'))
      conf.servidores.push(
        new Servidor('prod', 'https://fogon-servidor.fly.dev/'),
        new Servidor('exprod', 'https://fogon-servidor.onrender.com/'),
      )
      conf.conectarServerDefault = 'prod' // Default to 'desa' as it's the only one
    } else {
      // Servers were loaded. Validate conectarServerDefault.
      const defaultServerIsValid = conf.servidores.some(
        (s) => s.nombre === conf.conectarServerDefault,
      )
      if (!defaultServerIsValid) {
        // If loaded default is invalid (not found or was empty), set to the first server's name.
        conf.conectarServerDefault = conf.servidores[0].nombre
      }
    }
    return conf
  }

  public guardarEnLocalStorage() {
    localStorage.setItem(
      'configuracion',
      JSON.stringify({
        VERSION: Configuracion.VERSION,
        volumen: this.volumen,
        mostrarAcordes: this.mostrarAcordes,
        vistasTocar: this.vistasTocar,
        servidores: this.servidores,
        conectarServerDefault: this.conectarServerDefault,
        loginDefault: this.loginDefault,
        perfil: this.perfil,
      }),
    )
  }
}
