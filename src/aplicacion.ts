import { useRouter } from 'vue-router'

export default class Aplicacion {
  tocar(cancionstr: string) {
    console.log('Tocar', cancionstr)

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
