import { useAppStore } from '../../stores/appStore'
import { CancionManager } from '../cancion/CancionManager'
import type { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'

export class ListaReproduccion {
  async InsertarEnListaReproduccion(cancion: ItemIndiceCancion) {
    const appStore = useAppStore()
    const nuevaLista = []
    for (let i = 0; i < appStore.listaReproduccion.length; i++) {
      if (i === appStore.nroCancion) {
        nuevaLista.push(cancion)
      }
      nuevaLista.push(appStore.listaReproduccion[i])
    }
    appStore.listaReproduccion = nuevaLista
  }

  async CargarCancion(cancion: ItemIndiceCancion) {
    const appStore = useAppStore()
    const cancionObtenida = await CancionManager.getInstance().Get(
      cancion.GetOrigen(),
    )
    appStore.cancion = cancionObtenida
    appStore.compas = 0
    appStore.estadosApp.estado = 'ok'
    appStore.origenCancion = cancion.GetOrigen()
  }

  async ClickCancion(cancion: ItemIndiceCancion) {
    await this.InsertarEnListaReproduccion(cancion)
    await this.CargarCancion(cancion)
  }

  Agregar(item: ItemIndiceCancion) {
    const appStore = useAppStore()
    appStore.listaReproduccion.push(item)
  }
}
