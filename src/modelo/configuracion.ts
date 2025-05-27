// Clase Configuracion (singleton)
export class Configuracion {
  private static instance: Configuracion | null = null
  static VERSION = 1
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
      }),
    )
  }
}
