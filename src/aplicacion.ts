import { HelperObtenerCancionURL } from './helpers/HelperObtenerCancionURL'
import type { Cancion } from './modelo/cancion'

export default class Aplicacion {
  async tocar(cancionstr: string): Promise<Cancion> {
    const helperArchivo = new HelperObtenerCancionURL('/canciones')
    return helperArchivo.GetCancion(cancionstr)
  }
  onMounted() {
    console.log('Aplicacion montada')
  }

  constructor() {
    // Inicialización de la aplicación
    console.log('Aplicacion inicializada')
  }

  // Puedes agregar métodos y propiedades según tus necesidades
}
