import { useAppStore } from './stores/appStore'

export class EstadosAplicacion {
  SetEstadoReproduccion(estado: string) {
    this.estadoReproduccion = estado
    if (estado === 'cargando-demanager') {
      this.texto = 'Obteniendo canción...'
    } else if (estado === 'cargando-enviofogon') {
      this.texto = 'Enviando canción al fogón...'
    } else if (estado === 'cargando-dedirector') {
      this.texto = 'Esperando que el director envíe la canción...'
    } else if (estado === 'cargando-cancion') {
      this.texto = 'Cargando canción...'
    } else {
      this.texto = ''
    }
    EstadosAplicacion.SetEstadosAplicacion(this)
  }
  public estado: string = 'iniciando'
  public texto: string = '...'
  public paginaLista: string = ''
  public internet: boolean = true
  public estadoconeccion: string = 'desconectado'
  public estadoLogin: string = 'desconectado'
  public estadoReproduccion: string = 'sin-cancion'
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
