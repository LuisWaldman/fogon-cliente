// src/stores/appStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Aplicacion from '../aplicacion'
import { Cancion } from '../modelo/cancion/cancion'
import { Acordes, Parte } from '../modelo/cancion/acordes'
import { Letra } from '../modelo/cancion/letra'
import { Noticia } from '../modelo/noticia'
import { Perfil } from '../modelo/perfil'
import { Sesion } from '../modelo/sesion'
import { SincroSesion } from '../modelo/sincro/SincroSesion'
import { EstadoSincroCancion } from '../modelo/sincro/EstadoSincroCancion'
import type { UserSesion } from '../modelo/userSesion'
import { OrigenCancion } from '../modelo/cancion/origencancion'
import { EstadosAplicacion } from '../EstadosAplicacion'
import type { MediaVista } from '../modelo/reproduccion/MediaVista'
import type { ItemIndiceCancion } from '../modelo/cancion/ItemIndiceCancion'

export const useAppStore = defineStore('app', () => {
  const aplicacion = new Aplicacion()

  const sesSincroCancion = ref<SincroSesion>(new SincroSesion(0, 0))
  const EstadoSincro = ref<EstadoSincroCancion>(
    new EstadoSincroCancion(-1, 0, '-', 0),
  )
  const rolSesion = ref<string>('') // invitado, participante, admin, owner
  const sesion = ref<Sesion>(new Sesion('', 0, '', 0, 0))

  // Estados centrales en Pinia
  const cancion = ref<Cancion>(
    new Cancion(
      'Cancion no cargada',
      'sin banda',
      new Acordes([], []),
      new Letra([]),
    ),
  )
  const listasEnServer = ref<string[]>([])
  const MediaVista = ref<MediaVista | null>(null)
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
  const listaReproduccion = ref<ItemIndiceCancion[]>([])
  const nroCancion = ref<number>(1)
  const mensajes = ref<string[]>([])
  const compas = ref<number>(-1)
  const golpeDelCompas = ref<number>(0) // Valor inicial predeterminado

  const errores = ref<Error[]>([])
  const noticias = ref<Noticia[]>([])
  const perfil = ref<Perfil>(new Perfil('', '', '', '', ''))
  const estado = ref<string>('No iniciado')

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
    listasEnServer,
    origenEditando,
    errores,
    MediaVistas: MediaVista,
    cancionModificada,
    cancion,
    editandocancion,
    listaReproduccion,
    compas,
    sesion,
    estado,
    estadoConexion,
    sesSincroCancion,
    EstadoSincro,
    rolSesion,
    perfil,
    estadoReproduccion,
    nroCancion,
    golpeDelCompas,
    noticias,
    mensajes,
    sesiones,
    actualizarEstado,
    actualizarEstadoConexion,
    actualizarEstadoReproduccion,
  }
})
