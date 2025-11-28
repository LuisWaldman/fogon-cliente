import { useAppStore } from './stores/appStore'

export class EstadosAplicacion {
  public estado: string = 'iniciando'
  public texto: string = '...'
  public paginaLista: string = ''
  public internet: boolean = true
  public estadoconeccion: string = 'desconectado'
  public estadoLogin: string = 'desconectado'
  public estadoReproduccion: string = 'pausa'
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
