import { Cancion } from './cancion'
import { OrigenCancion } from './origencancion'

export class CancionSubidasManager {
  public static async GetCancion(
    origencancion: OrigenCancion,
  ): Promise<Cancion> {
    return this.canciones.get(origencancion.fileName) as Cancion
  }

  private static canciones = new Map<string, Cancion>()
  public static async SaveCancion(cancion: Cancion): Promise<void> {
    this.canciones.set(cancion.archivo, cancion)
  }
}
