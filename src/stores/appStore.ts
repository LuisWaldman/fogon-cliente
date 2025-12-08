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
import type { RolesSesion, UserSesion } from '../modelo/userSesion'
import { OrigenCancion } from '../modelo/cancion/origencancion'
import { EstadosAplicacion } from '../EstadosAplicacion'
import type { ItemIndiceCancion } from '../modelo/cancion/ItemIndiceCancion'

export const useAppStore = defineStore('app', () => {
  const aplicacion = new Aplicacion()

  const rolSesion = ref<RolesSesion>('visitante')
  const sesion = ref<Sesion>(new Sesion('', 0, '', 0, 0))

  const listasEnServer = ref<string[]>([])
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
  const busqueda = ref<ItemIndiceCancion[]>([])
  const mensajes = ref<string[]>([])

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

  const usuariosSesion = ref([] as UserSesion[])
  return {
    estadosApp,
    usuariosSesion,
    aplicacion,
    origenCancion,
    listasEnServer,
    origenEditando,
    cancionModificada,
    editandocancion,
    sesion,
    estado,
    estadoConexion,
    rolSesion,
    perfil,
    noticias,
    mensajes,
    sesiones,
    busqueda,
    actualizarEstado,
    actualizarEstadoConexion,
  }
})
