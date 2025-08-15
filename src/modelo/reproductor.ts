import { useAppStore } from '../stores/appStore'
import { Acordes } from './cancion/acordes'
import { Cancion } from './cancion/cancion'
import { CancionManager } from './cancion/CancionManager'
import { Letra } from './cancion/letra'
import type { OrigenCancion } from './cancion/origencancion'
import { Reloj } from './reloj'

export class Reproductor {
  reloj: Reloj = new Reloj()
  protected cancion: string = ''
  public get Cancion() {
    return this.cancion
  }
  async SetCancion(cancion: OrigenCancion) {
    this.CargarCancion(cancion)
  }

  protected async CargarCancion(origen: OrigenCancion) {
    return CancionManager.getInstance()
      .Get(origen)
      .then((cancion) => {
        cancion.normalizar()
        const appStore = useAppStore()
        appStore.cancion = cancion
        appStore.origenCancion = origen
      })
      .catch((error) => {
        console.error('Error al cargar la canción:', error)
        const appStore = useAppStore()
        appStore.cancion = new Cancion(
          'Error al cargar canción',
          'sin banda',
          new Acordes([], []),
          new Letra([]),
        )
      })
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
