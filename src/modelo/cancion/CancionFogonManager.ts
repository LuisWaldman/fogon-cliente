import type { ClienteSocket } from '../conexion/ClienteSocket'
import { Cancion } from './cancion'
import { HelperJSON } from './HelperJSON'
import type { OrigenCancion } from './origencancion'

export class CancionFogonManager {
  public static async GetCancion(
    origencancion: OrigenCancion,
    cliente: ClienteSocket | null = null,
  ): Promise<Cancion> {
    const response = await cliente?.HTTPGET('cancionsesion')
    const dataRes = await response?.json()
    if (dataRes.datosJSON === null) {
      return Cancion.GetDefault('Sin cancion en el fogón')
    }
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
    return new Promise<void>(async (resolve, reject) => {
      const response = await cliente?.HTTPPost('cancionsesion', cancionData)
      if (response?.ok) {
        resolve()
      } else {
        reject(new Error('Error al guardar la canción'))
      }
    })
  }
}
