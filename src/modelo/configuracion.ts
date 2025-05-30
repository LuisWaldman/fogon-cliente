import { Servidor } from './servidor' // Nueva importación

export class VistaTocar {
  public tamanioLetra: number = 22
  public tamanioAcorde: number = 23
  public tamanioAcordesolo: number = 16
  public tamanioParte: number = 16
  public tamanioAcordeParte: number = 26
  public anchoPrincipal: number = 8
  public altoPantallaDescuento: number = 200 // Nueva propiedad
  public factorScroll: number = 3.4 // Nueva propiedad para el factor de scroll
}
export class Configuracion {
  public vistasTocar: VistaTocar[] = [
    // 0: Celular, 1: PC, 2: Pantalla grande
    new VistaTocar(),
    new VistaTocar(),
    new VistaTocar(),
  ]
  public servidores: Servidor[] = [] // Nueva propiedad

  GetConfiguracionPantalla(innerWidth: number, innerHeight: number) {
    // 0: Celular, 1: PC, 2: Pantalla grande
    let idx = 1 // PC por defecto
    if (innerWidth < 700) {
      idx = 0 // Celular
    } else if (innerWidth > 1700 && innerHeight > 1000) {
      idx = 2 // Pantalla grande
    }
    return this.vistasTocar[idx]
  }
  private static instance: Configuracion | null = null
  static VERSION = 3 // Incrementa la versión para guardar nuevas vistas y servidores
  public tema: string = 'claro'
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
    const conf = new Configuracion() // Create a base instance. Default values (like empty 'servidores' array) are set by constructor.
    const data = localStorage.getItem('configuracion')

    if (data) {
      try {
        const obj = JSON.parse(data)
        if (obj.VERSION === Configuracion.VERSION) {
          conf.tema = obj.tema
          conf.volumen = obj.volumen
          conf.mostrarAcordes = obj.mostrarAcordes
          if (
            obj.vistasTocar &&
            Array.isArray(obj.vistasTocar) &&
            obj.vistasTocar.length === 3
          ) {
            conf.vistasTocar = obj.vistasTocar.map((v: unknown) =>
              Object.assign(new VistaTocar(), v),
            )
          }

          if (
            obj.servidores &&
            Array.isArray(obj.servidores) &&
            obj.servidores.length > 0
          ) {
            conf.servidores = obj.servidores.map(
              (s: { nombre: string; direccion: string }) =>
                new Servidor(s.nombre, s.direccion),
            )
          } else {
            // No valid 'servidores' array in stored data, add default
            conf.servidores.push(new Servidor('desa', 'http://localhost:8080/'))
          }
          return conf
        } else {
          // Version mismatch, initialize with default server
          conf.servidores.push(new Servidor('desa', 'http://localhost:8080/'))
          // The new conf (with default server) will be saved by getInstance if this was the initial load.
          return conf
        }
      } catch (e) {
        console.error('Error al cargar configuración desde localStorage:', e)
        // Error parsing, initialize with default server
        conf.servidores.push(new Servidor('desa', 'http://localhost:8080/'))
        return conf
      }
    }
    // No data in localStorage, initialize with default server
    conf.servidores.push(new Servidor('desa', 'http://localhost:8080/'))
    // The new conf (with default server) will be saved by getInstance on first call.
    return conf
  }

  public guardarEnLocalStorage() {
    localStorage.setItem(
      'configuracion',
      JSON.stringify({
        VERSION: Configuracion.VERSION,
        tema: this.tema,
        volumen: this.volumen,
        mostrarAcordes: this.mostrarAcordes,
        vistasTocar: this.vistasTocar,
        servidores: this.servidores, // Guardar servidores
      }),
    )
  }
}
