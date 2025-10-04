import { CancionUrlManager } from '../cancion/CancionUrlManager'
import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import type { FiltroIndice } from './filtroIndice'

export class IndiceHelper {
  private static instance: IndiceHelper
  public TodasLasCanciones: ItemIndiceCancion[] = []
  public BusquedaCanciones: ItemIndiceCancion[] = []

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public async CargarIndice() {
    this.TodasLasCanciones = await CancionUrlManager.GetIndice()
  }

  public async Buscar(filtros: FiltroIndice[]) {
    this.BusquedaCanciones = []
    const resultado: ItemIndiceCancion[] = []
    for (let i = 0; i < this.TodasLasCanciones.length; i++) {
      let ok = true
      for (let j = 0; j < filtros.length; j++) {
        ok = filtros[j].FiltroOk(this.TodasLasCanciones[i])
        if (!ok) {
          break
        }
      }
      if (ok) {
        resultado.push(this.TodasLasCanciones[i])
        if (resultado.length >= 100) {
          this.BusquedaCanciones = resultado
          break
        }
      }
    }

    this.BusquedaCanciones = resultado
  }

  public static getInstance(): IndiceHelper {
    if (!IndiceHelper.instance) {
      IndiceHelper.instance = new IndiceHelper()
    }
    return IndiceHelper.instance
  }
}
