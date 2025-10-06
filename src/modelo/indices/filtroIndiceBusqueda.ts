import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'
import { FiltroIndice } from './filtroIndice'

export class FiltroIndiceBusqueda extends FiltroIndice {
  busqueda: string = ''
  constructor(busqueda: string) {
    super()
    this.busqueda = busqueda
  }
  override FiltroOk(item: ItemIndiceCancion): boolean {
    const busquedaLower = this.busqueda.toLowerCase().split(' ')
    const incBanda = item.banda.toLowerCase()
    const incCancion = item.cancion.toLowerCase()
    for (let i = 0; i < busquedaLower.length; i++) {
      const palabra = busquedaLower[i]
      if (!incCancion.includes(palabra) && !incBanda.includes(palabra)) {
        return false
      }
    }
    return true
  }
}
