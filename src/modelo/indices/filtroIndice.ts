import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'

export class FiltroIndice {
  FiltroOk(item: ItemIndiceCancion): boolean {
    console.log('Filtro Ok', item)
    return true
  }
}
