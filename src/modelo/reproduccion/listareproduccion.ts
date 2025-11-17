import { useAppStore } from '../../stores/appStore'
import { CancionManager } from '../cancion/CancionManager'
import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'

export class ListaReproduccion {
  async InsertarEnListaReproduccion(cancion: ItemIndiceCancion) {
    const appStore = useAppStore()
    const nuevaLista = []
    if (appStore.nroCancion > appStore.listaReproduccion.length) {
      appStore.nroCancion = appStore.listaReproduccion.length;
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

  async CargarCancion(cancion: ItemIndiceCancion) {
    const appStore = useAppStore()
    const cancionObtenida = await CancionManager.getInstance().Get(
      ItemIndiceCancion.GetOrigen(cancion),
    )
    appStore.cancion = cancionObtenida
    appStore.compas = 0
    appStore.estadosApp.estado = 'ok'
    appStore.origenCancion = ItemIndiceCancion.GetOrigen(cancion)
  }

  async ClickCancion(cancion: ItemIndiceCancion) {
    await this.InsertarEnListaReproduccion(cancion)
    await this.CargarCancion(cancion)
  }
  async ClickCancionNro(nro: number) {
    const appStore = useAppStore()
    appStore.nroCancion = nro
    await this.CargarCancion(appStore.listaReproduccion[nro])
  }

  Agregar(item: ItemIndiceCancion) {
    const appStore = useAppStore()
    appStore.listaReproduccion.push(item)
  }
}
