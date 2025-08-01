import { HelperObtenerCancionURL } from '../helpers/HelperObtenerCancionURL'
import { useAppStore } from '../stores/appStore'
import { Reloj } from './reloj'

export class Reproductor {
  reloj: Reloj = new Reloj()
  private cancion: string = ''
  public get Cancion() {
    return this.cancion
  }
  async SetCancion(cancionstr: string) {
    await this.CargarCancion(cancionstr)
  }

  protected async CargarCancion(cancionstr: string) {
    localStorage.setItem('cancion_actual', cancionstr)
    const appStore = useAppStore()
    const helperArchivo = new HelperObtenerCancionURL('/canciones')
    appStore.cancion = await helperArchivo.GetCancion(cancionstr)
    this.cancion = cancionstr
  }

  iniciarReproduccion() {
    const appStore = useAppStore()
    if (appStore.cancion) {
      this.reloj.setDuracion(appStore.cancion.duracionGolpe * 1000)
      this.reloj.setIniciaCicloHandler(this.onInicioCiclo.bind(this))
      this.reloj.iniciar()
      appStore.estadoReproduccion = 'Iniciando'
      if (appStore.compas < 0) {
        appStore.compas = 0
      }
    }
  }
  detenerReproduccion() {
    const appStore = useAppStore()
    appStore.estadoReproduccion = 'pausado'
    appStore.golpeDelCompas = 0
    this.reloj.pausar()
  }
  updateCompas(compas: number) {
    const appStore = useAppStore()
    appStore.compas = compas
  }

  onInicioCiclo() {
    const appStore = useAppStore()
    appStore.golpeDelCompas = appStore.golpeDelCompas + 1
    if (appStore.golpeDelCompas >= appStore.cancion.compasCantidad) {
      appStore.golpeDelCompas = 0
      if (appStore.estadoReproduccion === 'Iniciando') {
        appStore.estadoReproduccion = 'Reproduciendo'
      } else {
        appStore.compas = appStore.compas + 1
      }
    }
  }
}
