import { Cancion } from '../cancion/cancion'
import type { OrigenCancion } from '../cancion/origencancion'
import { Reloj } from '../reloj'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroCancion } from '../sincro/SincroCancion'
import { useAppStore } from '../../stores/appStore'

export class Reproductor {
  reloj: Reloj = new Reloj()
  protected cancion: string = ''
  public get Cancion() {
    return this.cancion
  }
  SetCancion(origen: OrigenCancion, cancion: Cancion) {
    const appStore = useAppStore()
    appStore.cancion = cancion
    appStore.origenCancion = origen
  }

  iniciarReproduccion() {
    const appStore = useAppStore()
    const helper = HelperSincro.getInstance()
    const momento = helper.MomentoSincro()
    if (appStore.cancion) {
      appStore.sesSincroCancion = new SincroCancion(
        appStore.cancion?.duracionGolpe || 1000, // duracionGolpe
        momento + appStore.cancion?.duracionCompas * 1000, // timeInicio
        appStore.cancion?.compasCantidad || 4, // golpesxcompas
        appStore.compas || 0, // desdeCompas
      )
      console.log(`Iniciando reproducción de la canción: ${momento}`)
      this.reloj.setDuracion(appStore.cancion.duracionGolpe * 1000)
      this.reloj.setIniciaCicloHandler(this.onInicioCiclo.bind(this))

      // Activo Medias
      for (let i = 0; i < appStore.MediaVistas.length; i++) {
        if (appStore.MediaVistas[i].sincronizar) {
          appStore.MediaVistas[i].Iniciar?.()
        }
      }

      this.reloj.iniciar()
      appStore.estadoReproduccion = 'Iniciando'
      if (appStore.compas < 0) {
        appStore.compas = 0
      }
    }
  }

  detenerReproduccion() {
    const appStore = useAppStore()
    // Pauso Medias
    for (let i = 0; i < appStore.MediaVistas.length; i++) {
      if (appStore.MediaVistas[i].sincronizar) {
        appStore.MediaVistas[i].Pausar?.()
      }
    }
    appStore.estadoReproduccion = 'pausado'
    appStore.golpeDelCompas = 0
    this.reloj.pausar()
  }
  updateCompas(compas: number) {
    const appStore = useAppStore()
    appStore.compas = compas
  }
  sincronizar() {
    const appStore = useAppStore()
    const helper = HelperSincro.getInstance()
    const duracionGolpe = appStore.cancion?.duracionGolpe * 1000
    const golpesxcompas = appStore.cancion?.compasCantidad || 4

    // Renuevo Sincro
    const sincro = new SincroCancion(
      duracionGolpe,
      appStore.sesSincroCancion.timeInicio,
      golpesxcompas, // golpesxcompas
      appStore.sesSincroCancion.desdeCompas, // duracionGolpe
    )
    appStore.sesSincroCancion = sincro

    // Calculo el estado segun el momento
    let momento = helper.MomentoSincro()
    // Activo Medias
    for (let i = 0; i < appStore.MediaVistas.length; i++) {
      if (appStore.MediaVistas[i].rector) {
        //appStore.MediaVistas[i].Iniciar?.()
        const tiempo = appStore.MediaVistas[i].GetTiempoDesdeInicio?.() || 0
        appStore.MediaVistas[i].delay = momento - (sincro.timeInicio + tiempo)
        momento = sincro.timeInicio + tiempo
      }
    }

    const est = helper.GetEstadoSincro(sincro, momento)
    appStore.EstadoSincro = est
    appStore.compas = est.compas
    appStore.golpeDelCompas = est.golpeEnCompas
    appStore.estadoReproduccion = est.estado
    this.reloj.setDelay(est.delay)

    // Activo Medias
    for (let i = 0; i < appStore.MediaVistas.length; i++) {
      if (appStore.MediaVistas[i].sincronizar) {
        //appStore.MediaVistas[i].Iniciar?.()
        const tiempo = appStore.MediaVistas[i].GetTiempoDesdeInicio?.() || 0
        appStore.MediaVistas[i].delayconrector =
          momento - (sincro.timeInicio + tiempo)
        momento = sincro.timeInicio + tiempo
      }
    }
  }
  onInicioCiclo() {
    this.sincronizar()
  }
}
