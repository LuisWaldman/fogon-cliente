import { describe, it, expect } from 'vitest'
import { AppFake } from './appfake.ts'
import { Worker } from 'worker_threads'
import path from 'path'
import { FakeMessage } from './fakemessage.ts'

describe('Cancion', () => {
  it('2 coneciones al servidor', async () => {
    const shared = new SharedArrayBuffer(4)
    const workerPath1 = path.resolve(__dirname, './worker3.js')
    const workerPath2 = path.resolve(__dirname, './worker3.js')

    const mensajes2r: Promise<FakeMessage[]> = new Promise((res) => {
      const w2 = new Worker(workerPath2, { workerData: { shared } })
      w2.on('message', res)

      w2.on('error', (err) => console.error('Error en worker2:', err))
      w2.on('exit', (code) => console.log('worker2 salió con código:', code))
    })

    const mensajes1r: Promise<FakeMessage[]> = new Promise((res) => {
      const w1 = new Worker(workerPath1, { workerData: { shared } })
      w1.on('message', res)

      w1.on('error', (err) => console.error('Error en worker2:', err))
      w1.on('exit', (code) => console.log('worker2 salió con código:', code))
    })
    const mensajes2 = await mensajes2r
    const mensajes1 = await mensajes1r
    expect(mensajes1.length).toBe(2)
    expect(mensajes1[1].mensaje).toBe('CancionActualizada')
    expect(mensajes1[1].args[0]).toBe('Cancion1')
    expect(mensajes2.length).toBe(1)
    expect(mensajes2[1].mensaje).toBe('CancionActualizada')
    expect(mensajes2[1].args[0]).toBe('Cancion1')
  })
})
