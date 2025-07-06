import { parentPort, workerData } from 'worker_threads'
import { AppFake } from './appfake.js'

const flag = new Int32Array(workerData.shared)
const app = new AppFake()
console.log('Worker3: Iniciando conexión', flag)

parentPort.postMessage(app.mensajes)
