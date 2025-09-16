import { Cancion } from '../cancion/cancion'
import type { OrigenCancion } from '../cancion/origencancion'
import { Reloj } from '../reloj'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroCancion } from '../sincro/SincroCancion'
import { useAppStore } from '../../stores/appStore'
import { CancionManager } from '../cancion/CancionManager'

export class Reproductor {
  reloj: Reloj = new Reloj()
  protected cancion: string = ''
  public get Cancion() {
    return this.cancion
  }
  async ClickCancion(origen: OrigenCancion) {
    const appStore = useAppStore()
    const cancionObtenida = await CancionManager.getInstance().Get(origen)
    appStore.MediaVistas = []
    if (cancionObtenida.pentagramas.length > 0) {
      appStore.estadosApp.texto = 'Cargando Midis...'
    }
    appStore.cancion = cancionObtenida
    appStore.compas = 0
    appStore.estadosApp.estado = 'ok'
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

      // Activo Medias
      for (let i = 0; i < appStore.MediaVistas.length; i++) {
        if (appStore.MediaVistas[i].rector) {
          appStore.MediaVistas[i].Iniciar?.()
        }
      }

      this.reloj.setDuracion(appStore.cancion.duracionGolpe * 1000)
      this.reloj.setIniciaCicloHandler(this.onInicioCiclo.bind(this))
      this.reloj.iniciar()
      //this.sincronizar()
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
    // Activo Medias
    for (let i = 0; i < appStore.MediaVistas.length; i++) {
      if (appStore.MediaVistas[i].sincronizar) {
        const duracionCompas = appStore.cancion.duracionCompas * 1000
        appStore.MediaVistas[i].SetTiempoDesdeInicio?.(compas * duracionCompas)
      }
    }
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
    let momento: number = helper.MomentoSincro()
    // Activo Medias
    for (let i = 0; i < appStore.MediaVistas.length; i++) {
      if (appStore.MediaVistas[i].rector) {
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
        const tiempoReproduccion =
          appStore.MediaVistas[i].GetTiempoDesdeInicio?.() || 0
        appStore.MediaVistas[i].delayconrector =
          momento - (sincro.timeInicio + tiempoReproduccion)
        if (!appStore.MediaVistas[i].rector) {
          if (est.estado !== 'Reproduciendo') {
            appStore.MediaVistas[i].Pausar?.()
          } else {
            if (est.compas >= 0) {
              const momento =
                est.compas * appStore.cancion.duracionCompas * 1000 +
                est.golpeEnCompas * appStore.cancion.duracionGolpe * 1000 -
                est.delay
              appStore.MediaVistas[i].SetTiempoDesdeInicio?.(momento)
              appStore.MediaVistas[i].Iniciar?.()
            }
          }
        }
      }
    }
  }
  onInicioCiclo() {
    this.sincronizar()
  }
}
