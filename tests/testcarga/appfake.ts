import { ClienteSocket } from '../../src/modelo/conexion/ClienteSocket' // Adjust the import path as necessary
import { FakeMessage } from './fakemessage'

export class AppFake {
  cliente: ClienteSocket
  mensajes: FakeMessage[] = []
  constructor() {
    // Inicialización de la aplicación
    console.log('Aplicacion inicializada')
    this.cliente = new ClienteSocket('ws://localhost:8080')
  }

  conectar() {
    // Conectar al servidor
    this.cliente.connectar()
    this.cliente.setCancionActualizadaHandler((cancion: string) => {
      this.mensajes.push(new FakeMessage('CancionActualizada', [cancion]))
    })
    this.cliente.setMensajesesionHandler((msj: string) => {
      this.mensajes.push(new FakeMessage('mensajesesion', [msj]))
    })
    this.cliente.setRolSesionHandler((mensaje: string) => {
      this.mensajes.push(new FakeMessage('rolSesion', [mensaje]))
    })
    this.cliente.setCompasActualizadoHandler((compas: number) => {
      this.mensajes.push(new FakeMessage('compasActualizado', [compas]))
    })
    this.cliente.setEnsesionHandler((mensaje: string) => {
      this.mensajes.push(new FakeMessage('ensesion', [mensaje]))
    })
    this.cliente.setCancionDetenidaHandler(() => {
      this.mensajes.push(new FakeMessage('cancionDetenida', []))
    })
    this.cliente.setCancionIniciadaHandler((compas: number, desde: string) => {
      this.mensajes.push(new FakeMessage('cancionIniciada', [compas, desde]))
    })
  }
  desconectar() {
    // Desconectar del servidor
    this.cliente.disconnect()
  }
}
