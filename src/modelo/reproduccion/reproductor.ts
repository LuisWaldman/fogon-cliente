import type { OrigenCancion } from '../cancion/origencancion'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroCancion } from '../sincro/SincroCancion'
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
    console.log(appStore.listaReproduccion)
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
    const momento: number = helper.MomentoSincro()
    const est = helper.GetEstadoSincro(sincro, momento)
    appStore.EstadoSincro = est
    appStore.compas = est.compas
    appStore.golpeDelCompas = est.golpeEnCompas
    appStore.estadoReproduccion = est.estado
  }
  onInicioCiclo() {
    this.sincronizar()
  }
}
