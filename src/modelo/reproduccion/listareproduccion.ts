import { useAppStore } from '../../stores/appStore'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'

export class ListaReproduccion {
  GetCancion(): ItemIndiceCancion {
    const appStore = useAppStore()
    return appStore.listaReproduccion[appStore.nroCancion]
  }
  async ClickTocarLista(lista: ItemIndiceCancion[]) {
    const appStore = useAppStore()
    appStore.listaReproduccion = lista
    appStore.nroCancion = 0
  }
  async InsertarEnListaReproduccion(cancion: ItemIndiceCancion) {
    const appStore = useAppStore()
    const nuevaLista = []
    if (appStore.nroCancion > appStore.listaReproduccion.length) {
      appStore.nroCancion = appStore.listaReproduccion.length
    }
    for (let i = 0; i < appStore.listaReproduccion.length; i++) {
      if (i === appStore.nroCancion) {
        nuevaLista.push(appStore.listaReproduccion[i])
        nuevaLista.push(cancion)
      } else {
        nuevaLista.push(appStore.listaReproduccion[i])
      }
    }
    if (appStore.listaReproduccion.length === 0) {
      nuevaLista.push(cancion)
    } else {
      appStore.nroCancion++
    }
    appStore.listaReproduccion = nuevaLista
  }

  async ClickCancion(cancion: ItemIndiceCancion) {
    await this.InsertarEnListaReproduccion(cancion)
  }
  async ClickCancionNro(nro: number) {
    const appStore = useAppStore()
    appStore.nroCancion = nro
  }

  Agregar(item: ItemIndiceCancion) {
    const appStore = useAppStore()
    appStore.listaReproduccion.push(item)
  }
}
