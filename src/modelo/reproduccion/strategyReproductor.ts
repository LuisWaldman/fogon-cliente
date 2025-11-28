import { useAppStore } from '../../stores/appStore'
import { CancionManager } from '../cancion/CancionManager'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { Logger } from '../logger'
import { EstadoSincroCancion } from '../sincro/EstadoSincroCancion'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroSesion } from '../sincro/SincroSesion'
import type { Reproductor } from './reproductor'

export class StrategyReproductor {
  protected EstadoSincro: EstadoSincroCancion = new EstadoSincroCancion(
    -1,
    0,
    '-',
    0,
  )
  public reproductor: Reproductor
  protected sesSincroCancion: SincroSesion = new SincroSesion(0, 0)
  constructor(reproductor: Reproductor) {
    this.reproductor = reproductor
  }

  iniciarReproduccion() {
    const appStore = useAppStore()
    if (this.reproductor.cancion) {
      const helper = HelperSincro.getInstance()
      const momento = helper.MomentoSincro()
      this.sesSincroCancion = new SincroSesion(
        momento + this.reproductor.cancion?.duracionCompas * 1000, // timeInicio
        this.reproductor.compas || 0, // desdeCompas
      )
      if (appStore.MediaVistas !== null) {
        this.sesSincroCancion.timeInicio =
          appStore.MediaVistas.GetTiempoDesdeInicio!()
        appStore.MediaVistas?.Iniciar?.()
      }

      Logger.log(`Iniciando reproducción de la canción: ${momento}`)
      if (this.reproductor.compas < 0) {
        this.reproductor.compas = 0
      }
      this.reproductor.SetEstado('Iniciando')
      this.sincronizar()
    }
  }

  detenerReproduccion() {
    const appStore = useAppStore()
    // Pauso Medias
    appStore.MediaVistas?.Pausar?.()
    this.reproductor.SetEstado('pausado')
    this.reproductor.golpeDelCompas = 0
  }
  updateCompas(compas: number) {
    const appStore = useAppStore()
    this.reproductor.compas = compas

    if (appStore.MediaVistas) {
      const duracionCompas = this.reproductor.cancion.duracionCompas * 1000
      appStore.MediaVistas?.SetTiempoDesdeInicio?.(compas * duracionCompas)
    }
  }
  async sincronizar() {
    const appStore = useAppStore()
    const helper = HelperSincro.getInstance()
    if (appStore.MediaVistas === null) {
      const momento: number = helper.MomentoSincro()
      const est = helper.GetEstadoSincro(
        this.sesSincroCancion,
        momento,
        this.reproductor.cancion?.duracionGolpe * 1000 || 1000,
        this.reproductor.cancion?.compasCantidad || 4,
      )

      this.EstadoSincro = est
      this.reproductor.compas = est.compas
      this.reproductor.golpeDelCompas = est.golpeEnCompas
      this.reproductor.SetEstado(est.estado)
    } else {
      if (appStore.MediaVistas.GetTiempoDesdeInicio != null) {
        const tiempoDesdeInicio = appStore.MediaVistas.GetTiempoDesdeInicio()
        if (tiempoDesdeInicio != null) {
          const est = helper.GetEstadoSincroMedia(
            tiempoDesdeInicio,
            this.reproductor.cancion?.duracionGolpe * 1000 || 1000,
            this.reproductor.cancion?.compasCantidad || 4,
          )
          this.EstadoSincro = est
          this.reproductor.compas = est.compas
          this.reproductor.golpeDelCompas = est.golpeEnCompas
          this.reproductor.SetEstado(est.estado)
        }
      }
    }
  }

  async CargarCancion(cancion: ItemIndiceCancion) {
    this.reproductor.SetEstado('cargando-cancion')
    const cancionObtenida = await CancionManager.getInstance().Get(
      ItemIndiceCancion.GetOrigen(cancion),
    )
    this.reproductor.cancion = cancionObtenida
    this.reproductor.compas = 0
    this.reproductor.SetEstado('pausado')
    this.reproductor.origenCancion = ItemIndiceCancion.GetOrigen(cancion)
  }
}
