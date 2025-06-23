// src/stores/appStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Aplicacion from '../aplicacion'
import { Cancion } from '../modelo/cancion'
import { itemLista } from '../modelo/item_lista'
import { Acordes } from '../modelo/acordes'
import { Letra } from '../modelo/letra'
import { Noticia } from '../modelo/noticia'
import { Perfil } from '../modelo/perfil'
import { Sesion } from '../modelo/sesion'

export const useAppStore = defineStore('app', () => {
  const aplicacion = new Aplicacion()

  // Estados centrales en Pinia
  const cancion = ref<Cancion>(
    new Cancion(
      'Cancion no cargada',
      'sin banda',
      new Acordes([], []),
      new Letra([]),
    ),
  )
  const listaCanciones = ref<itemLista[]>([])
  const mensajes = ref<string[]>([])
  const nroCancion = ref<number>(1)
  const compas = ref<number>(-1)
  const golpeDelCompas = ref<number>(0) // Valor inicial predeterminado

  const noticias = ref<Noticia[]>([])

  const sesion = ref<Sesion>(new Sesion('', 0, '', 0, 0))
  const estadoSesion = ref<string>('no-conectado') // Estados : 'No iniciado', 'Conectado', 'Desconectado'
  const rolSesion = ref<string>('default') // Estados : 'No iniciado', 'Conectado', 'Desconectado'

  const perfil = ref<Perfil>(new Perfil('', '', '', '', ''))
  const estado = ref<string>('No iniciado')
  const estadoLogin = ref<string>('')
  // Método para actualizar el estado de reproducción
  const actualizarEstado = (nuevoEstado: string) => {
    estado.value = nuevoEstado
  }

  const estadoConexion = ref<string>('No iniciado') // Estados : 'Desconectado', 'Intenando-Loguear', 'Logueado'
  // Método para actualizar el estado de reproducción
  const actualizarEstadoConexion = (nuevoEstado: string) => {
    estadoConexion.value = nuevoEstado
  }

  const estadoReproduccion = ref<string>('pausado') // Estados : 'Pausado', 'Inicializando', 'Reproduciendo'
  // Método para actualizar el estado de reproducción
  const actualizarEstadoReproduccion = (nuevoEstado: string) => {
    estadoReproduccion.value = nuevoEstado
  }

  return {
    aplicacion,
    cancion,
    listaCanciones,
    compas,
    estado,
    estadoConexion,
    estadoSesion,
    estadoLogin,
    rolSesion,
    perfil,
    estadoReproduccion,
    nroCancion,
    golpeDelCompas,
    noticias,
    sesion,
    mensajes,
    actualizarEstado,
    actualizarEstadoConexion,
    actualizarEstadoReproduccion,
  }
})
