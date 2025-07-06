import { parentPort, workerData } from 'worker_threads'
import { AppFake } from './appfake.js'

const flag = new Int32Array(workerData.shared)
const app = new AppFake()

app.conectar()
app.cliente.UnirmeSesion('Sesion1')

// Notificar que se ha unido
Atomics.store(flag, 0, 1)
Atomics.notify(flag, 0, 1)

// Enviar mensajes para validación
parentPort.postMessage(app.mensajes)
