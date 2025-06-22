import { useAppStore } from '../stores/appStore'
import { ClienteSocket } from './conexion/ClienteSocket'
import { Reproductor } from './reproductor'

export class reproductorConectado extends Reproductor {
  cliente: ClienteSocket

  constructor(cliente: ClienteSocket) {
    super()
    this.cliente = cliente
    this.cliente.setCancionActualizadaHandler((cancion: string) => {
      console.log(`Canción actualizada: ${cancion}`)
      this.CargarCancion(cancion)
    })
  }

  override async SetCancion(cancionstr: string) {
    const appStore = useAppStore()
    console.log('ESTADO', appStore.estadoSesion)
    if (appStore.estadoSesion === 'conectado') {
      console.log(`Actualizando canción en el servidor: ${cancionstr}`)
      this.cliente.actualizarCancion(cancionstr)
    }
  }
}
