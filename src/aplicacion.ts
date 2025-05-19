import { useRouter } from 'vue-router'
import { HelperObtenerCancionURL } from './helpers/HelperObtenerCancionURL'

export default class Aplicacion {
  async tocar(cancionstr: string) {
    console.log('Tocando canción:', cancionstr)
    const helperArchivo = new HelperObtenerCancionURL('/canciones')
    const cancion = await helperArchivo.GetCancion(cancionstr)
    console.log(cancion)
    const router = useRouter()
    router.push({ path: 'tocar', query: { tocar: 'mi-cancion.mp3' } })
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
