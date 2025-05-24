import { HelperObtenerCancionURL } from './helpers/HelperObtenerCancionURL'
import type { Cancion } from './modelo/cancion'
import { useAppStore } from './stores/appStore'
import { Reloj } from './modelo/reloj'

export default class Aplicacion {
  reloj: Reloj = new Reloj()
  async tocar(cancionstr: string): Promise<Cancion> {
    const helperArchivo = new HelperObtenerCancionURL('/canciones')
    return helperArchivo.GetCancion(cancionstr)
  }
  onMounted() {
    console.log('Aplicacion montada')
  }

  updateCompas(compas: number) {
    const appStore = useAppStore()
    appStore.compas = compas
  }

  iniciarReproduccion() {
    const appStore = useAppStore()
    appStore.compas = appStore.compas + 1
    if (appStore.cancion) {
      this.reloj.setDuracion(appStore.cancion.duracionGolpe * 1000)
      this.reloj.setIniciaCicloHandler(this.onInicioCiclo.bind(this))
      this.reloj.iniciar()
    }
  }

  onInicioCiclo() {
    const appStore = useAppStore()
    appStore.golpeDelCompas = appStore.golpeDelCompas + 1
    if (!appStore.cancion) return

    if (appStore.golpeDelCompas >= appStore.cancion.compasCantidad) {
      appStore.compas = appStore.compas + 1
      appStore.golpeDelCompas = 0
    }
  }

  detenerReproduccion() {
    this.reloj.pausar()
  }

  play() {
    const appStore = useAppStore()
    appStore.estado = 'tocando'
    this.iniciarReproduccion()
  }

  pause() {
    this.detenerReproduccion()
    const appStore = useAppStore()
    appStore.estado = 'pausado'
    appStore.golpeDelCompas = 0
  }

  stop() {
    this.detenerReproduccion()
    const appStore = useAppStore()
    appStore.estado = 'parado'
    appStore.compas = -2
    appStore.golpeDelCompas = 0
  }

  constructor() {
    // Inicialización de la aplicación
    console.log('Aplicacion inicializada')
  }

  // Puedes agregar métodos y propiedades según tus necesidades
}
