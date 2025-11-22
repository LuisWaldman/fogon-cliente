import { Cancion } from '../../modelo/cancion/cancion'
import type { VistaAcorde } from './vistaParteAcorde'

export class VistaParte {
  static GetFromCancion(cancion: Cancion): VistaParte[] {
    return []
  }
  nombre: string = ''
  acordes: VistaAcorde[] = []
  public constructor(nombre: string, acordes: VistaAcorde[]) {
    this.nombre = nombre
    this.acordes = acordes
  }
}
