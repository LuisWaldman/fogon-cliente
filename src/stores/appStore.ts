// src/stores/appStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Aplicacion from '../aplicacion'
import { Cancion } from '../modelo/cancion/cancion'
import { itemLista } from '../modelo/item_lista'
import { Acordes, Parte } from '../modelo/cancion/acordes'
import { Letra } from '../modelo/cancion/letra'
import { Noticia } from '../modelo/noticia'
import { Perfil } from '../modelo/perfil'
import { Sesion } from '../modelo/sesion'
import { SincroCancion } from '../modelo/sincro/SincroCancion'
import { EstadoSincroCancion } from '../modelo/sincro/EstadoSincroCancion'
import type { UserSesion } from '../modelo/userSesion'
import { OrigenCancion } from '../modelo/cancion/origencancion'
import { EstadosAplicacion } from '../EstadosAplicacion'

export const useAppStore = defineStore('app', () => {
  const aplicacion = new Aplicacion()

  const sesSincroCancion = ref<SincroCancion>(new SincroCancion(0, 0, 0, 0))
  const EstadoSincro = ref<EstadoSincroCancion>(
    new EstadoSincroCancion(-1, 0, '-', 0),
  )

  // Estados centrales en Pinia
  const cancion = ref<Cancion>(
    new Cancion(
      'Cancion no cargada',
      'sin banda',
      new Acordes([], []),
      new Letra([]),
    ),
  )
  const estadosApp = ref<EstadosAplicacion>(new EstadosAplicacion())
  const editandocancion = ref<Cancion>(
    new Cancion(
      'nueva cancion',
      'sin banda',
      new Acordes([new Parte('', [''])], []),
      new Letra([['']]),
    ),
  )
  editandocancion.value.escala = 'C'
  const origenCancion = ref<OrigenCancion>(new OrigenCancion('', '', ''))
  const origenEditando = ref<OrigenCancion>(new OrigenCancion('', '', ''))
  const cancionModificada = ref<boolean>(false)

  const sesiones = ref<Sesion[]>([] as Sesion[])
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

  const usuariosSesion = ref([] as UserSesion[])
  return {
    estadosApp,
    usuariosSesion,
    aplicacion,
    origenCancion,
    origenEditando,
    cancionModificada,
    cancion,
    editandocancion,
    listaCanciones,
    compas,
    estado,
    estadoConexion,
    estadoSesion,
    estadoLogin,
    rolSesion,
    sesSincroCancion,
    EstadoSincro,
    perfil,
    estadoReproduccion,
    nroCancion,
    golpeDelCompas,
    noticias,
    sesion,
    mensajes,
    sesiones,
    actualizarEstado,
    actualizarEstadoConexion,
    actualizarEstadoReproduccion,
  }
})
