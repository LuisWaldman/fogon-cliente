import type { ClienteSocket } from '../conexion/ClienteSocket'
import type { Cancion } from './cancion'
import { HelperJSON } from './HelperJSON'
import type { OrigenCancion } from './origencancion'

export class CancionServerManager {
  public static async GetCancion(
    origencancion: OrigenCancion,
    cliente: ClienteSocket | null = null,
    token: string = '',
  ): Promise<Cancion> {
    const response = await fetch(
      cliente?.UrlServer + 'cancion?nombre=' + origencancion.fileName,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const dataRes = await response.json()
    return HelperJSON.JSONToCancion(JSON.stringify(dataRes.datosJSON))
  }

  public static async SaveCancion(
    cancion: Cancion,
    cliente: ClienteSocket | null = null,
    token: string = '',
  ): Promise<void> {
    const cancionData = {
      nombreArchivo: cancion.archivo,
      datosJSON: cancion,
    }
    return new Promise<void>(async (resolve, reject) => {
      const response = await fetch(cliente?.UrlServer + 'cancion', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cancionData),
      })
      if (response.ok) {
        resolve()
      } else {
        reject(new Error('Error al guardar la canción'))
      }
    })
  }
}
