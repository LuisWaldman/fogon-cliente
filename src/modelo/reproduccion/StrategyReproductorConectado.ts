import { useAppStore } from '../../stores/appStore'
import type { Cancion } from '../cancion/cancion'
import { CancionManager } from '../cancion/CancionManager'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { OrigenCancion } from '../cancion/origencancion'
import type { ClienteSocket } from '../conexion/ClienteSocket'
import { Logger } from '../logger'
import { HelperSincro } from '../sincro/HelperSincro'
import { SincroSesion } from '../sincro/SincroSesion'
import type { Reproductor } from './reproductor'
import { StrategyReproductor } from './strategyReproductor'

export class StrategyReproductorConectado extends StrategyReproductor {
  protected cliente: ClienteSocket
  protected token: string

  constructor(reproductor: Reproductor, cliente: ClienteSocket, token: string) {
    super(reproductor)
    this.token = token
    this.cliente = cliente
    this.cliente.setCancionActualizadaHandler(async () => {
      await this.GetCancionDelFogon()
      this.reproductor.SetEstado('pausado')
    })
    this.cliente.setCancionIniciadaHandler(
      (compas: number, desde: number, nroUsuario: number) => {
        Logger.log(
          `Reproducción iniciada desde compás ${compas} en ${desde} x ${nroUsuario}`,
        )
        this.reproductor.SetEstado('reproduciendo')
        this.reproductor.ultimoUsuarioQueCambioEstado = nroUsuario
        this.reproductor.ultimoEstadoCambiado = 'reproduciendo'
        this.sesSincroCancion = new SincroSesion(
          desde,
          compas, // duracionGolpe
        )
        this.reproductor.MediaVista?.Iniciar?.()
        this.sincronizar()
        if (this.reproductor.cancion) {
          if (this.reproductor.compas < 0) {
            this.reproductor.compas = 0
          }
        }
      },
    )
    this.cliente.setCancionCambioEstadoHandler(
      (estado: string, nroUsuario: number) => {
        this.reproductor.SetEstado(estado)
        this.reproductor.ultimoUsuarioQueCambioEstado = nroUsuario
        this.reproductor.ultimoEstadoCambiado = estado
      },
    )
    this.cliente.setCompasActualizadoHandler(
      (compas: number, nroUsuario: number) => {
        Logger.log(`Compás actualizado a ${compas}`)
        this.reproductor.compas = compas
        this.reproductor.ultimoUsuarioQueCambioEstado = nroUsuario
        this.reproductor.ultimoEstadoCambiado = 'update-compas'
        this.reproductor.SetEstado('update-compas')
      },
    )
    this.cliente.setCancionSincronizadaHandler(
      (compas: number, desde: number) => {
        Logger.log(
          `En ${this.sesSincroCancion.timeInicio} Sincronizando inicio sesion  ${this.sesSincroCancion.timeInicio} , time  ${desde}`,
        )
        if (this.reproductor.MediaVista === null) {
          this.sesSincroCancion.desdeCompas = compas
          this.sesSincroCancion.timeInicio = desde
        }
      },
    )
  }

  override SetEstado(estado: string) {
    Logger.log(`Cambiando estado a ${estado} y notificando al servidor`)
    this.cliente.cambiarEstado(estado)
  }

  async EnviarCancion(cancion: Cancion) {
    const origenN = new OrigenCancion('fogon', '', '')
    CancionManager.getInstance().Save(origenN, cancion)
  }
  async GetCancionDelFogon() {
    this.reproductor.SetEstado('cargando-defogon')
    const origen = new OrigenCancion('fogon', '', '')
    const cancion = await CancionManager.getInstance().Get(origen)
    const appStore = useAppStore()
    this.reproductor.cancion = cancion
    appStore.origenCancion = origen
    if (this.reproductor.estadoReproductor == 'Reproduciendo') {
      this.reproductor.SetEstado('actualizado-fogonReproduciendo')
    } else {
      this.reproductor.SetEstado('actualizado-fogon')
    }

  }

  override async CargarCancion(cancion: ItemIndiceCancion) {
    const appStore = useAppStore()
    if (appStore.rolSesion != 'director') {
      this.reproductor.SetEstado('cargando-dedirector')
    } else {
      this.reproductor.SetEstado('cargando-demanager')
      const cancionObtenida = await CancionManager.getInstance().Get(
        ItemIndiceCancion.GetOrigen(cancion),
      )
      this.reproductor.SetEstado('cargando-enviofogon')
      this.EnviarCancion(cancionObtenida)
    }
  }

  override async sincronizar() {
    await super.sincronizar()
    if (this.reproductor.MediaVista !== null) {
      const helper = HelperSincro.getInstance()
      const momento = helper.MomentoSincro()
      const sincro = helper.GetSincro(
        this.EstadoSincro,
        momento,
        this.reproductor.cancion!.duracionGolpe * 1000,
        this.reproductor.cancion!.compasCantidad,
        0,
      )
      const dif = Math.abs(
        HelperSincro.Diferencia(
          this.sesSincroCancion.timeInicio,
          sincro.timeInicio,
        ),
      )
      if (dif > 20) {
        Logger.log(
          `Sincronizando inicio sesion  ${this.sesSincroCancion.timeInicio} , time inicio ${sincro.timeInicio} con diferencia de ${dif} ms`,
        )
        this.sesSincroCancion.timeInicio = sincro.timeInicio
        this.cliente.sincronizarReproduccion(0, sincro.timeInicio)
      }
    }
  }

  override async iniciarReproduccion() {
    super.iniciarReproduccion()
    this.cliente.iniciarReproduccion(
      this.reproductor.compas,
      this.sesSincroCancion.timeInicio,
    )
  }

  override detenerReproduccion() {
    this.reproductor.SetEstado('pausando')
    this.cliente.cambiarEstado('pausado')
  }

  override updateCompas(compas: number) {
    this.cliente.actualizarCompas(compas)
  }
}
