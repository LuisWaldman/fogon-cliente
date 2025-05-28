// Clase Configuracion (singleton)
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
  static VERSION = 2 // Incrementa la versión para guardar nuevas vistas
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
    const data = localStorage.getItem('configuracion')
    if (data) {
      try {
        const obj = JSON.parse(data)
        if (obj.VERSION === Configuracion.VERSION) {
          const conf = new Configuracion()
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
          return conf
        } else {
          return new Configuracion() // Si la versión no coincide, se crea una nueva instancia por defecto
        }
      } catch (e) {
        console.error('Error al cargar configuración desde localStorage:', e)
      }
    }
    const conf = new Configuracion()
    conf.guardarEnLocalStorage()
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
      }),
    )
  }
}
