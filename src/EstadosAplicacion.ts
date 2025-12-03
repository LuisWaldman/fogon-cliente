import { useAppStore } from './stores/appStore'

export type EstadoReproduccion =
  | 'sin-cancion'
  | 'pausa'
  | 'iniciando'
  | 'reproduciendo'
  | 'esperandoMedia'

export type EstadoCargaReproduccion =
  | 'sin-cancion'
  | 'cargando-cancion'
  | 'cargando-demanager'
  | 'cargando-enviofogon'
  | 'cargando-dedirector'
  | 'update-compas'
  | 'cargando-cancion'
  | 'cargando-defogon'
  | 'actualizando-compas'
  | 'cargada'

export class EstadosAplicacion {
  SetEstadoReproduccion(estado: EstadoReproduccion) {
    this.estadoReproduccion = estado
    EstadosAplicacion.SetEstadosAplicacion(this)
  }
  SetEstadoCarga(estado: EstadoCargaReproduccion) {
    this.estadoCarga = estado
    EstadosAplicacion.SetEstadosAplicacion(this)
  }
  public estado: string = 'iniciando'
  public texto: string = '...'
  public paginaLista: string = ''
  public internet: boolean = true
  public estadoconeccion: string = 'desconectado'
  public estadoLogin: string = 'desconectado'
  public estadoReproduccion: EstadoReproduccion = 'sin-cancion'
  public estadoCarga: EstadoCargaReproduccion = 'sin-cancion'
  public estadoSesion: string = 'desconectado'
  public nombreServidor: string = ''
  public static GetEstadosAplicacion(): EstadosAplicacion {
    const appStore = useAppStore()
    return appStore.estadosApp
  }
  public static SetEstadosAplicacion(
    estado: EstadosAplicacion,
  ): EstadosAplicacion {
    const appStore = useAppStore()
    appStore.estadosApp = estado
    return appStore.estadosApp
  }
}
