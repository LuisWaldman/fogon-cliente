import type { OrigenCancion } from '../cancion/origencancion'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroSesion } from '../sincro/SincroSesion'
import { useAppStore } from '../../stores/appStore'
import { CancionManager } from '../cancion/CancionManager'
import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'

export class Reproductor {
  protected cancion: string = ''
  public get Cancion() {
    return this.cancion
  }
  async ClickCancion(origen: OrigenCancion) {
    const appStore = useAppStore()
    appStore.MediaVistas = null
    const cancionObtenida = await CancionManager.getInstance().Get(origen)
    if (cancionObtenida.pentagramas.length > 0) {
      appStore.estadosApp.texto = 'Cargando Midis...'
    }
    appStore.cancion = cancionObtenida
    appStore.compas = 0
    appStore.estadosApp.estado = 'ok'
    appStore.origenCancion = origen
  }

  async Next() {
    const appStore = useAppStore()
    appStore.nroCancion++
    const origen =
      appStore.listaReproduccion[appStore.nroCancion - 1].GetOrigen()
    const cancionObtenida = await CancionManager.getInstance().Get(origen)
    appStore.MediaVistas = null
    if (cancionObtenida.pentagramas.length > 0) {
      appStore.estadosApp.texto = 'Cargando Midis...'
    }
    appStore.cancion = cancionObtenida
    appStore.compas = 0
    appStore.estadosApp.estado = 'ok'
    appStore.origenCancion = origen
  }

  async AgregarAListaReproduccion(item: ItemIndiceCancion) {
    const appStore = useAppStore()
    appStore.listaReproduccion.push(item)
  }

  iniciarReproduccion() {
    const appStore = useAppStore()
    if (appStore.cancion) {
      const helper = HelperSincro.getInstance()
      const momento = helper.MomentoSincro()

      appStore.sesSincroCancion = new SincroSesion(
        momento + appStore.cancion?.duracionCompas * 1000, // timeInicio
        appStore.compas || 0, // desdeCompas
      )
      console.log(`Iniciando reproducción de la canción: ${momento}`)
      if (appStore.compas < 0) {
        appStore.compas = 0
      }
      appStore.MediaVistas?.Iniciar?.()
      appStore.estadoReproduccion = 'Iniciando'
      this.sincronizar()
    }
  }

  detenerReproduccion() {
    const appStore = useAppStore()
    // Pauso Medias
    appStore.MediaVistas?.Pausar?.()
    appStore.estadoReproduccion = 'pausado'
    appStore.golpeDelCompas = 0
  }
  updateCompas(compas: number) {
    const appStore = useAppStore()
    appStore.compas = compas

    if (appStore.MediaVistas) {
      const duracionCompas = appStore.cancion.duracionCompas * 1000
      appStore.MediaVistas?.SetTiempoDesdeInicio?.(compas * duracionCompas)
    }
  }
  async sincronizar() {
    const appStore = useAppStore()
    const helper = HelperSincro.getInstance()
    if (appStore.MediaVistas === null) {
      const momento: number = helper.MomentoSincro()
      const est = helper.GetEstadoSincro(
        appStore.sesSincroCancion,
        momento,
        appStore.cancion?.duracionGolpe * 1000 || 1000,
        appStore.cancion?.compasCantidad || 4,
      )

      appStore.EstadoSincro = est
      appStore.compas = est.compas
      appStore.golpeDelCompas = est.golpeEnCompas
      appStore.estadoReproduccion = est.estado
    } else {
      if (appStore.MediaVistas) {
        if (appStore.MediaVistas.GetTiempoDesdeInicio) {
          const tiempoDesdeInicio = appStore.MediaVistas.GetTiempoDesdeInicio()
          const est = helper.GetEstadoSincroMedia(
            appStore.sesSincroCancion,
            tiempoDesdeInicio,
            appStore.cancion?.duracionGolpe * 1000 || 1000,
            appStore.cancion?.compasCantidad || 4,
          )
          appStore.EstadoSincro = est
          appStore.compas = est.compas
          appStore.golpeDelCompas = est.golpeEnCompas
          appStore.estadoReproduccion = est.estado
        }
      }
    }
  }
}
