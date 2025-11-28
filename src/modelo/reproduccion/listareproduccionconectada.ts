import { useAppStore } from '../../stores/appStore'
import type { Cancion } from '../cancion/cancion'
import { CancionManager } from '../cancion/CancionManager'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { OrigenCancion } from '../cancion/origencancion'
import type { ClienteSocket } from '../conexion/ClienteSocket'
import { ListaReproduccion } from './listareproduccion'

export class ListaReproduccionConectada extends ListaReproduccion {
  cliente: ClienteSocket
  token: string

  constructor(cliente: ClienteSocket, token: string) {
    super()
    this.cliente = cliente
    this.token = token
    this.cliente.setListacambiadaHandler(async () => {
      await this.CargarLista()
      this.CargarNroCancionActual()
    })
    this.cliente.setNrocambiadoHandler(async () => {
      this.CargarNroCancionActual()
    })
    this.CargarLista().then(() => {
      this.CargarNroCancionActual()
    })
  }
  async CargarNroCancionActual() {
    const response = await this.cliente.HTTPGET('numerocancion')
    const nroCancion = await response.json()
    const appStore = useAppStore()
    appStore.nroCancion = nroCancion.nroCancion
  }

  async EnviarCancion(cancion: Cancion) {
    const origenN = new OrigenCancion('fogon', '', '')
    CancionManager.getInstance().Save(origenN, cancion)
  }

  async CargarLista(): Promise<void> {
    const response = await this.cliente.HTTPGET('listasesion')
    const lista: ItemIndiceCancion[] = await response.json()
    const appStore = useAppStore()
    appStore.listaReproduccion = lista
  }

  override async ClickTocarLista(lista: ItemIndiceCancion[]) {
    await this.cliente.HTTPPost('listasesion', lista)
  }
  override async InsertarEnListaReproduccion(cancion: ItemIndiceCancion) {
    await this.cliente.HTTPPost('tocar', cancion)
  }

  override async ClickCancion(cancion: ItemIndiceCancion) {
    await this.InsertarEnListaReproduccion(cancion)
  }
  async ClickCancionNro(nro: number) {
    await this.cliente.HTTPPost('tocarnro', { Numero: nro })
  }

  async Agregar(item: ItemIndiceCancion) {
    this.cliente.HTTPPost('listasesionitem', item)
  }
}
