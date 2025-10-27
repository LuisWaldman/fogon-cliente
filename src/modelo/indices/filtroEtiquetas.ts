import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroEtiquetas extends FiltroIndice {
  etiquetas: string[] = []
  constructor(etiqueta: string) {
    super()
    this.etiquetas = etiqueta.split(',')
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    console.log('Filtrando por etiqueta:', this.etiquetas, 'en', item.etiquetas)
    if (!item.etiquetas || !Array.isArray(item.etiquetas)) {
      return false
    }
    return this.etiquetas.some((etiqueta) => item.etiquetas.includes(etiqueta))
  }
}
