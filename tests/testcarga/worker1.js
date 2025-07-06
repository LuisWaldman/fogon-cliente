import { parentPort, workerData } from 'worker_threads'
import { AppFake } from './appfake.js'

const flag = new Int32Array(workerData.shared)
const app = new AppFake()

app.conectar()
app.cliente.CrearSesion('Sesion1', 0, 0)

// Esperar a que el otro hilo se una
while (Atomics.load(flag, 0) < 1) {
  Atomics.wait(flag, 0, 0)
}

// Después de la unión, actualizar la canción
app.cliente.actualizarCancion('Cancion1')

// Enviar mensajes para validación
parentPort.postMessage(app.mensajes)
