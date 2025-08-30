import { CancionUrlManager } from '../cancion/CancionUrlManager'
import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'

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

  public async Buscar(busqueda: string) {
    if (busqueda.trim() === '') {
      this.BusquedaCanciones = []
      return
    }
    let resultado: ItemIndiceCancion[] = this.TodasLasCanciones
    const filtros = busqueda.split(',')
    for (let i = 0; i < filtros.length; i++) {
      resultado = this.filtrarvectores(filtros[i], resultado)
    }
    this.BusquedaCanciones = resultado.length > 30 ? resultado.slice(0, 30) : resultado
    console.log('Busqueda Canciones', this.BusquedaCanciones)
}

  public filtrarvectores(filtro: string, vector: ItemIndiceCancion[]) {
    return vector.filter(
      (cancion) =>
        cancion.banda.toLowerCase().includes(filtro.toLowerCase()) ||
        cancion.cancion.toLowerCase().includes(filtro.toLowerCase()),
    )
  }

  public static getInstance(): IndiceHelper {
    if (!IndiceHelper.instance) {
      IndiceHelper.instance = new IndiceHelper()
    }
    return IndiceHelper.instance
  }
}
