import { HelperSincro } from '../sincro/HelperSincro'
import { SincroSesion } from '../sincro/SincroSesion'
import { useAppStore } from '../../stores/appStore'
import { CancionManager } from '../cancion/CancionManager'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { ListaReproduccion } from './listareproduccion'

export class Reproductor {
  protected cancion: string = ''
  protected listaReproduccion: ListaReproduccion = new ListaReproduccion()
  public get Cancion() {
    return this.cancion
  }
  async ClickCancion(cancion: ItemIndiceCancion) {
    await this.listaReproduccion.ClickCancion(cancion)
  }

  async ClickCancionNro(nro: number) {
    await this.listaReproduccion.ClickCancionNro(nro)
  }

  async Next() {
    const appStore = useAppStore()
    appStore.nroCancion++
    const origen = ItemIndiceCancion.GetOrigen(
      appStore.listaReproduccion[appStore.nroCancion - 1],
    )
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
    this.listaReproduccion.Agregar(item)
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
      if (appStore.MediaVistas !== null) {
        appStore.sesSincroCancion.timeInicio =
          appStore.MediaVistas.GetTiempoDesdeInicio!()
        appStore.MediaVistas?.Iniciar?.()
      }

      console.log(`Iniciando reproducción de la canción: ${momento}`)
      if (appStore.compas < 0) {
        appStore.compas = 0
      }
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
      if (appStore.MediaVistas.GetTiempoDesdeInicio != null) {
        const tiempoDesdeInicio = appStore.MediaVistas.GetTiempoDesdeInicio()
        if (tiempoDesdeInicio != null) {
          const est = helper.GetEstadoSincroMedia(
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
