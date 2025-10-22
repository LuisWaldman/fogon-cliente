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
  ): Promise<void> {}

  async RemoveCancion(nameLista: string, index: number): Promise<void> {}

  async ReorderCancion(
    nameLista: string,
    index: number,
    orden: number,
  ): Promise<void> {}

  async GetCanciones(nameLista: string): Promise<ItemIndiceCancion[]> {
    return []
  }
}
