// src/stores/appStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Aplicacion from '../aplicacion'
import { Cancion } from '../modelo/cancion'
export const useAppStore = defineStore('app', () => {
  const aplicacion = new Aplicacion()
  const cancion = ref<Cancion | null>(null)
  const tocar = async (id: string) => {
    const nueva = await aplicacion.tocar(id)
    cancion.value = nueva
  }

  return {
    cancion,
    tocar,
  }
})
