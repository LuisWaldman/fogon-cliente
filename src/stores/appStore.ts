// src/stores/appStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Aplicacion from '../aplicacion'
import { Cancion } from '../modelo/cancion'
import { itemLista } from '../modelo/item_lista'
import { Acordes } from '../modelo/acordes'
import { Letra } from '../modelo/letra'

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
  const nroCancion = ref<number>(1)
  const compas = ref<number>(-2)
  const estado = ref<string>('No iniciado') // Estado inicial de la aplicación
  const golpeDelCompas = ref<number>(0) // Valor inicial predeterminado

  // Método para tocar una canción por ID
  const tocar = async (id: string) => {
    const nueva = await aplicacion.tocar(id)
    if (nueva) {
      cancion.value = nueva
    }
  }

  // Método para actualizar el estado de reproducción
  const actualizarEstado = (nuevoEstado: string) => {
    estado.value = nuevoEstado
  }

  // Método para modificar el compás
  const actualizarCompas = (nuevoCompas: number) => {
    compas.value = nuevoCompas
  }

  const actualizargolpeDelCompas = (nuevoGolpe: number) => {
    golpeDelCompas.value = nuevoGolpe
  }

  return {
    aplicacion,
    cancion,
    listaCanciones,
    compas,
    estado,
    nroCancion,
    golpeDelCompas,
    tocar,
    actualizarEstado,
    actualizarCompas,
    actualizargolpeDelCompas,
  }
})
