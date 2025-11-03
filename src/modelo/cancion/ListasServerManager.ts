import type { ClienteSocket } from '../conexion/ClienteSocket'
import { ItemIndiceCancion } from './ItemIndiceCancion'

export class ListasServerManager {
  cliente: ClienteSocket
  constructor(cliente: ClienteSocket) {
    this.cliente = cliente
  }

  async AgregarLista(nameLista: string): Promise<void> {
    await this.cliente.HTTPPost('lista', { nombre: nameLista })
  }

  async BorrarLista(nameLista: string): Promise<void> {
    await this.cliente.HTTPDELETE(
      `lista?nombre=${encodeURIComponent(nameLista)}`,
    )
  }

  async RenombrarLista(nameLista: string, nuevoNombre: string): Promise<void> {
    await this.cliente.HTTPPUT('lista', {
      nombre: nameLista,
      nuevoNombre: nuevoNombre,
    })
  }

  async GetListas(): Promise<string[]> {
    const response = await this.cliente.HTTPGET('lista')
    console.log('Response from GetListas:', response)
    const json = await response.json()
    return json
  }

  async AddCancion(
    nameLista: string,
    elemento: ItemIndiceCancion,
  ): Promise<void> {
    console.log('Adding song to server list:', nameLista, elemento)
    await this.cliente.HTTPPost(
      `itemcancionlista?lista=${encodeURIComponent(nameLista)}`,
      elemento,
    )
  }

  async RemoveCancion(nameLista: string, index: number): Promise<void> {
    await this.cliente.HTTPDELETE(
      `cancion?nombreLista=${encodeURIComponent(nameLista)}&index=${index}`,
    )
  }

  async ReorderCancion(
    nameLista: string,
    index: number,
    orden: number,
  ): Promise<void> {
    console.log('ReorderCancion:', nameLista, index, orden)
  }

  async GetCanciones(): Promise<ItemIndiceCancion[]> {
    const response = await this.cliente.HTTPGET('itemcancionusuario')
    const json = await response.json()
    return json
  }

  async GetCancionesLista(nameLista: string): Promise<ItemIndiceCancion[]> {
    const response = await this.cliente.HTTPGET(
      `itemcancionlista?lista=${encodeURIComponent(nameLista)}`,
    )
    const json = await response.json()
    return json
  }
}
