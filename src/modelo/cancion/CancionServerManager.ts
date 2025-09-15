import type { ClienteSocket } from '../conexion/ClienteSocket'
import type { Cancion } from './cancion'
import { HelperJSON } from './HelperJSON'
import type { OrigenCancion } from './origencancion'

export class CancionServerManager {
  public static async GetCancion(
    origencancion: OrigenCancion,
    cliente: ClienteSocket | null = null,
  ): Promise<Cancion> {
    const response = await cliente?.HTTPGET(
      'cancion?nombre=' + origencancion.fileName,
    )
    const dataRes = await response?.json()
    const cancion = HelperJSON.JSONToCancion(JSON.stringify(dataRes.datosJSON))
    cancion.archivo = origencancion.fileName
    return cancion
  }

  public static async SaveCancion(
    cancion: Cancion,
    cliente: ClienteSocket | null = null,
  ): Promise<void> {
    const cancionData = {
      nombreArchivo: cancion.archivo,
      datosJSON: cancion,
    }
    await cliente?.HTTPPost('cancion', cancionData)
    return
  }
}
