import type { EstadoReproduccion } from '../../EstadosAplicacion'
import { CancionManager } from '../cancion/CancionManager'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import type { OrigenCancion } from '../cancion/origencancion'
import { Logger } from '../logger'
import { EstadoSincroCancion } from '../sincro/EstadoSincroCancion'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroSesion } from '../sincro/SincroSesion'
import type { Reproductor } from './reproductor'

export class StrategyReproductor {
  protected EstadoSincro: EstadoSincroCancion = new EstadoSincroCancion(
    -1,
    0,
    'sin-cancion',
    0,
  )
  public reproductor: Reproductor
  protected sesSincroCancion: SincroSesion = new SincroSesion(0, 0)
  constructor(reproductor: Reproductor) {
    this.reproductor = reproductor
  }

  iniciarReproduccion() {
    if (this.reproductor.cancion) {
      if (this.reproductor.compas < 0) {
        this.reproductor.compas = 0
      }
      const helper = HelperSincro.getInstance()
      const momento = helper.MomentoSincro()
      this.sesSincroCancion = new SincroSesion(
        momento + this.reproductor.cancion?.duracionCompas * 1000, // timeInicio
        this.reproductor.compas || 0, // desdeCompas
      )
      if (this.reproductor.MediaVista !== null) {
        this.sesSincroCancion.timeInicio =
          this.reproductor.MediaVista.GetTiempoDesdeInicio!()
        this.reproductor.MediaVista?.Iniciar?.()
      }

      Logger.log(`Iniciando reproducción de la canción: ${momento}`)

      this.reproductor.SetEstado('iniciando')
      this.sincronizar()
    }
  }

  SetEstado(estado: EstadoReproduccion) {
    this.reproductor.SetEstado(estado)
  }

  detenerReproduccion() {
    if (this.reproductor.MediaVista !== null) {
      this.reproductor.MediaVista?.Pausar?.()
    }
    this.reproductor.SetEstado('pausa')
    this.reproductor.golpeDelCompas = 0
  }
  updateCompas(compas: number) {
    this.reproductor.compas = compas

    if (this.reproductor.MediaVista !== null) {
      const duracionCompas = this.reproductor.cancion.duracionCompas * 1000
      this.reproductor.MediaVista?.SetTiempoDesdeInicio?.(
        compas * duracionCompas,
      )
    }
    this.reproductor.SetEstadoCarga('update-compas')
  }
  async sincronizar() {
    const helper = HelperSincro.getInstance()
    if (this.reproductor.MediaVista === null) {
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
      if (this.reproductor.MediaVista?.GetTiempoDesdeInicio != null) {
        const tiempoDesdeInicio =
          this.reproductor.MediaVista?.GetTiempoDesdeInicio()
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
    this.reproductor.SetEstadoCarga('cargando-demanager')
    await this.CargarCancionDeOrigen(ItemIndiceCancion.GetOrigen(cancion))

    this.reproductor.SetEstadoCarga('cargada')
  }

  async CargarCancionDeOrigen(cancion: OrigenCancion) {
    this.reproductor.SetEstadoCarga('cargando-demanager')
    const cancionObtenida = await CancionManager.getInstance().Get(cancion)
    this.reproductor.cancion = cancionObtenida
    this.reproductor.compas = 0
    this.reproductor.SetEstadoCarga('cargada')
    this.reproductor.SetEstado('pausa')
    this.reproductor.origenCancion = cancion
  }
}
