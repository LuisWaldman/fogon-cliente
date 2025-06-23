import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../src/stores/appStore'
import { ReproductorConectado } from '../src/modelo/reproductorConectado'
import { ClienteSocket } from '../src/modelo/conexion/ClienteSocket'
import { createPinia, setActivePinia } from 'pinia'
import { LocalStorageMock } from './LocalStorageMock'
describe('Example test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.localStorage = new LocalStorageMock()
  })
  it('Si la fecha es anterior deberia quedar Inicando', () => {
    const appStore = useAppStore()
    const socket = new ClienteSocket('ws://localhost:8080')
    const reproductorConectado = new ReproductorConectado(socket)

    const momento = new Date()
    reproductorConectado.setearMomento(
      momento,
      new Date(momento.getTime() + 1000),
    )

    expect(appStore.estadoReproduccion).toBe('Iniciando')
  })

  it('Si la fecha es posterior deberia quedar Reproduciendo', () => {
    const appStore = useAppStore()
    const socket = new ClienteSocket('ws://localhost:8080')
    const reproductorConectado = new ReproductorConectado(socket)

    const momento = new Date()
    reproductorConectado.setearMomento(
      momento,
      new Date(momento.getTime() - 1000),
    )

    expect(appStore.estadoReproduccion).toBe('Reproduciendo')
  })

  it('Calcula golpeDelCompas=0, compas=0, delay=8', () => {
    const appStore = useAppStore()
    const socket = new ClienteSocket('ws://localhost:8080')
    const reproductorConectado = new ReproductorConectado(socket)
    appStore.cancion.bpm = 60
    appStore.cancion.compasCantidad = 4
    const momento = new Date()
    const duraciongolpe = appStore.cancion.duracionGolpe * 1000
    const delay = 8
    const delayesperado = duraciongolpe - delay

    reproductorConectado.setearMomento(
      momento,
      new Date(momento.getTime() - (duraciongolpe * 0 + delay)),
    )

    expect(appStore.estadoReproduccion).toBe('Reproduciendo')
    expect(appStore.golpeDelCompas).toBe(0)
    expect(appStore.compas).toBe(0)
    expect(reproductorConectado.reloj.delayIntervalo).toBe(delayesperado)
  })

  it('Calcula golpeDelCompas=3, compas=0, delay=8', () => {
    const appStore = useAppStore()
    const socket = new ClienteSocket('ws://localhost:8080')
    const reproductorConectado = new ReproductorConectado(socket)
    appStore.cancion.bpm = 60
    appStore.cancion.compasCantidad = 4
    const momento = new Date()
    const duraciongolpe = appStore.cancion.duracionGolpe * 1000
    const delay = 8
    const delayesperado = duraciongolpe - delay

    reproductorConectado.setearMomento(
      momento,
      new Date(momento.getTime() - (duraciongolpe * 3 + delay)),
    )

    expect(appStore.estadoReproduccion).toBe('Reproduciendo')
    expect(appStore.golpeDelCompas).toBe(3)
    expect(appStore.compas).toBe(0)
    expect(reproductorConectado.reloj.delayIntervalo).toBe(delayesperado)
  })

  it('Calcula golpeDelCompas=4, compas=0, delay=8', () => {
    const appStore = useAppStore()
    const socket = new ClienteSocket('ws://localhost:8080')
    const reproductorConectado = new ReproductorConectado(socket)
    appStore.cancion.bpm = 60
    appStore.cancion.compasCantidad = 4
    const momento = new Date()
    const duraciongolpe = appStore.cancion.duracionGolpe * 1000
    const delay = 8
    const delayesperado = duraciongolpe - delay

    reproductorConectado.setearMomento(
      momento,
      new Date(momento.getTime() - (duraciongolpe * 4 + delay)),
    )

    expect(appStore.estadoReproduccion).toBe('Reproduciendo')
    expect(appStore.golpeDelCompas).toBe(0)
    expect(appStore.compas).toBe(1)
    expect(reproductorConectado.reloj.delayIntervalo).toBe(delayesperado)
  })

  
  it('Calcula golpeDelCompas=0, compas=0, delay=38', () => {
    const appStore = useAppStore()
    const socket = new ClienteSocket('ws://localhost:8080')
    const reproductorConectado = new ReproductorConectado(socket)
    appStore.cancion.bpm = 60
    appStore.cancion.compasCantidad = 4
    const momento = new Date()
    const delay = 38

    reproductorConectado.setearMomento(
      momento,
      new Date(momento.getTime() + delay),
    )

    expect(appStore.estadoReproduccion).toBe('Iniciando')
    expect(appStore.golpeDelCompas).toBe(3)
    expect(reproductorConectado.reloj.delayIntervalo).toBe(delay)
  })

  it('Calcula golpeDelCompas=-2, compas=0, delay=38', () => {
    const appStore = useAppStore()
    const socket = new ClienteSocket('ws://localhost:8080')
    const reproductorConectado = new ReproductorConectado(socket)
    appStore.cancion.bpm = 60
    appStore.cancion.compasCantidad = 4
    const momento = new Date()
    const duraciongolpe = appStore.cancion.duracionGolpe * 1000
    const delay = 38

    reproductorConectado.setearMomento(
      momento,
      new Date(momento.getTime() + (duraciongolpe * 2 + delay)),
    )

    expect(appStore.estadoReproduccion).toBe('Iniciando')
    expect(appStore.golpeDelCompas).toBe(1)
    expect(reproductorConectado.reloj.delayIntervalo).toBe(delay)
  })

  it('Calcula golpeDelCompas=3, compas=0, delay=8', () => {
    const appStore = useAppStore()
    const socket = new ClienteSocket('ws://localhost:8080')
    const reproductorConectado = new ReproductorConectado(socket)
    appStore.cancion.bpm = 60
    appStore.cancion.compasCantidad = 4
    const momento = new Date()
    const duraciongolpe = appStore.cancion.duracionGolpe * 1000
    const delay = 8
    const delayesperado = duraciongolpe - delay

    reproductorConectado.setearMomento(
      momento,
      new Date(momento.getTime() - (duraciongolpe * 5 + delay)),
    )

    expect(appStore.estadoReproduccion).toBe('Reproduciendo')
    expect(appStore.golpeDelCompas).toBe(1)
    expect(appStore.compas).toBe(1)
    expect(reproductorConectado.reloj.delayIntervalo).toBe(delayesperado)
  })
})
