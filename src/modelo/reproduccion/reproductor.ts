import { useAppStore } from '../../stores/appStore'
import { CancionManager } from '../cancion/CancionManager'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { ListaReproduccion } from './listareproduccion'
import type { ClienteSocket } from '../conexion/ClienteSocket'
import { ListaReproduccionConectada } from './listareproduccionconectada'
import { StrategyReproductor } from './strategyReproductor'
import { StrategyReproductorConectado } from './StrategyReproductorConectado'
import { Letra } from '../cancion/letra'
import { Acordes } from '../cancion/acordes'
import { Cancion } from '../cancion/cancion'
import {
  EstadosAplicacion,
  type EstadoCargaReproduccion,
  type EstadoReproduccion,
} from '../../EstadosAplicacion'
import { OrigenCancion } from '../cancion/origencancion'
import type { MediaVista } from './MediaVista'

export class Reproductor {
  public ultimoUsuarioQueCambioEstado: number = 0
  public ultimoEstadoCambiado: string = ''
  MediaVista: MediaVista | null = null

  async listaActualizada() {
    await this.strategyReproductor.CargarCancion(
      this.listaReproduccion.GetCancion(),
    )
  }
  SetEstado(estado: EstadoReproduccion) {
    if (estado === 'pausa') {
      this.MediaVista?.Pausar?.()
    }
    EstadosAplicacion.GetEstadosAplicacion().SetEstadoReproduccion(estado)
  }

  SetEstadoCarga(estado: EstadoCargaReproduccion) {
    EstadosAplicacion.GetEstadosAplicacion().SetEstadoCarga(estado)
  }

  setMediaVista(mediaVista: MediaVista): void {
    this.MediaVista = mediaVista
    this.strategyReproductor.SetEstado('esperandoMedia')
    mediaVista.setMediaCambioEstado((estado: string) => {
      if (estado === 'cargado') {
        this.strategyReproductor.SetEstado('pausa')
      }
    })
  }

  quitarMediaVista(): void {
    this.MediaVista = null
  }

  sincronizar() {
    this.strategyReproductor.sincronizar()
  }
  updateCompas(compas: number) {
    this.strategyReproductor.updateCompas(compas)
  }
  iniciarReproduccion() {
    this.strategyReproductor.iniciarReproduccion()
  }
  detenerReproduccion() {
    this.strategyReproductor.detenerReproduccion()
  }

  CargarCancion(cancion: OrigenCancion): Promise<void> {
    return this.strategyReproductor.CargarCancionDeOrigen(cancion)
  }

  protected strategyReproductor: StrategyReproductor = new StrategyReproductor(
    this,
  )
  protected listaReproduccion: ListaReproduccion = new ListaReproduccion()
  public estadoReproductor: string = 'sin-cancion'
  public origenCancion: OrigenCancion = new OrigenCancion('', '', '')
  public cancion: Cancion = new Cancion(
    'Cancion no cargada',
    'sin banda',
    new Acordes([], []),
    new Letra([]),
  )
  compas: number = 0
  golpeDelCompas: number = 0 // Valor inicial predeterminado
  constructor() {
    this.cancion.archivo = ''
  }

  public conectar(
    cliente: ClienteSocket,
    token: string,
    creandoSesion: boolean,
  ) {
    const reproductor = new StrategyReproductorConectado(this, cliente, token)
    this.strategyReproductor = reproductor
    this.listaReproduccion = new ListaReproduccionConectada(
      cliente,
      token,
      this,
    )
    if (creandoSesion) {
      reproductor.EnviarCancion(this.cancion)
    } else {
      reproductor.GetCancionDelFogon()
    }
  }
  public desconectar() {
    this.strategyReproductor = new StrategyReproductor(this)
  }

  async ClickCancion(cancion: ItemIndiceCancion) {
    await this.listaReproduccion.ClickCancion(cancion)
    await this.strategyReproductor.CargarCancion(cancion)
  }

  async ClickTocarLista(lista: ItemIndiceCancion[]) {
    await this.listaReproduccion.ClickTocarLista(lista)
    await this.strategyReproductor.CargarCancion(lista[0])
  }
  async ClickCancionNro(nro: number) {
    await this.listaReproduccion.ClickCancionNro(nro)
    await this.strategyReproductor.CargarCancion(
      this.listaReproduccion.GetCancion(),
    )
  }

  async Next() {
    const appStore = useAppStore()
    appStore.nroCancion++
    const origen = ItemIndiceCancion.GetOrigen(
      appStore.listaReproduccion[appStore.nroCancion - 1],
    )
    const cancionObtenida = await CancionManager.getInstance().Get(origen)
    this.MediaVista = null
    if (cancionObtenida.pentagramas.length > 0) {
      appStore.estadosApp.texto = 'Cargando Midis...'
    }
    this.cancion = cancionObtenida
    this.compas = -1
    appStore.estadosApp.estado = 'ok'
    appStore.origenCancion = origen
  }

  async AgregarAListaReproduccion(item: ItemIndiceCancion) {
    this.listaReproduccion.Agregar(item)
  }
}
