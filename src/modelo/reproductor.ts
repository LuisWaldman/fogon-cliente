import { HelperObtenerCancionURL } from '../helpers/HelperObtenerCancionURL'
import { useAppStore } from '../stores/appStore'

export class Reproductor {
  async SetCancion(cancionstr: string) {
    await this.CargarCancion(cancionstr)
  }

  protected async CargarCancion(cancionstr: string) {
    localStorage.setItem('cancion_actual', cancionstr)
    const appStore = useAppStore()
    const helperArchivo = new HelperObtenerCancionURL('/canciones')
    appStore.cancion = await helperArchivo.GetCancion(cancionstr)
  }
}
