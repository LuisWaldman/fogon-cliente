import { useAppStore } from '../stores/appStore'
import { ClienteSocket } from './conexion/ClienteSocket'
import { Reproductor } from './reproductor'

export class ReproductorConectado extends Reproductor {
  cliente: ClienteSocket
  momentoInicio: Date | null = null
  compasInicio: number | null = null

  constructor(cliente: ClienteSocket) {
    super()
    this.cliente = cliente
    this.cliente.setCancionActualizadaHandler((cancion: string) => {
      console.log(`Canción actualizada: ${cancion}`)
      this.CargarCancion(cancion)
    })
    this.cliente.setCancionIniciadaHandler((compas: number, desde: string) => {
      // Obtener la hora estándar mundial (UTC) similar a NTP
      const momento = new Date(Date.now())
      console.log(
        `${momento} : Reproducción iniciada desde compás ${compas} por ${desde}`,
      )
      this.momentoInicio = new Date(desde)
      this.compasInicio = compas
      this.setearMomento(momento, this.momentoInicio)
      const appStore = useAppStore()
      if (appStore.cancion) {
        this.reloj.setDuracion(appStore.cancion.duracionGolpe * 1000)
        this.reloj.setIniciaCicloHandler(this.onInicioCiclo.bind(this))
        this.reloj.iniciar()
        if (appStore.compas < 0) {
          appStore.compas = 0
        }
      }
      //this.CalcularCompasActual(momento)
    })
    this.cliente.setCancionDetenidaHandler(() => {
      console.log('Reproducción detenida')
      const appStore = useAppStore()
      appStore.estadoReproduccion = 'pausado'
      appStore.golpeDelCompas = 0
      this.reloj.pausar()
    })
    this.cliente.setCompasActualizadoHandler((compas: number) => {
      console.log(`Compás actualizado a ${compas}`)
      const appStore = useAppStore()
      appStore.compas = compas
    })
  }

  setearMomento(momento: Date, momentoInicio: Date) {
    const appStore = useAppStore()
    if (momentoInicio.getTime() <= momento.getTime()) {
      appStore.estadoReproduccion = 'Reproduciendo'
      const diferencia = momento.getTime() - momentoInicio.getTime()
      const duracionGolpe = appStore.cancion?.duracionGolpe * 1000
      const golpe = Math.floor(diferencia / duracionGolpe)
      const delay = diferencia - golpe * duracionGolpe
      this.reloj.setDelay(duracionGolpe - delay)
      appStore.compas = Math.floor(golpe / appStore.cancion?.compasCantidad)
      appStore.golpeDelCompas = golpe % appStore.cancion?.compasCantidad
    } else {
      appStore.estadoReproduccion = 'Iniciando'
      appStore.compas = 0
      const diferencia = momentoInicio.getTime() - momento.getTime()
      const duracionGolpe = appStore.cancion?.duracionGolpe * 1000
      const golpe = Math.floor(diferencia / duracionGolpe)
      const delay = diferencia - golpe * duracionGolpe
      this.reloj.setDelay(delay)
      appStore.golpeDelCompas = 3 - (golpe % appStore.cancion?.compasCantidad)
    }
    console.log(
      `Estado de reproducción: ${appStore.estadoReproduccion}, Compás: ${appStore.compas}, Golpe del compás: ${appStore.golpeDelCompas}, Delay: ${this.reloj.delayIntervalo}`,
    )
    this.momentoInicio = momento
  }

  override async SetCancion(cancionstr: string) {
    const appStore = useAppStore()
    console.log('ESTADO', appStore.estadoSesion)
    if (appStore.estadoSesion === 'conectado') {
      console.log(`Actualizando canción en el servidor: ${cancionstr}`)
      this.cliente.actualizarCancion(cancionstr)
    }
  }

  override async iniciarReproduccion() {
    const appStore = useAppStore()
    if (appStore.cancion) {
      appStore.estadoReproduccion = 'Iniciando'
      if (appStore.compas < 0) {
        appStore.compas = 0
      }
      this.cliente.iniciarReproduccion(
        appStore.compas,
        appStore.cancion.duracionCompas,
      )
    }
  }

  override detenerReproduccion() {
    this.cliente.detenerReproduccion()
  }

  override updateCompas(compas: number) {
    this.cliente.actualizarCompas(compas)
  }
}
