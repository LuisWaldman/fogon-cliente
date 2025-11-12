<script setup lang="ts">
import { Cancion } from '../../modelo/cancion/cancion'
import { HelperJSON } from '../../modelo/cancion/HelperJSON'
import { onMounted, ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { useAppStore } from '../../stores/appStore'

const fileInput = ref<HTMLInputElement | null>(null)

function abrirDialogoArchivo() {
  fileInput.value?.click()
}

let router: Router | null = null
onMounted(() => {
  router = useRouter()
})

function manejarSeleccionArchivo(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Verificar que sea un archivo JSON
  if (!file.name.toLowerCase().endsWith('.json')) {
    alert('Por favor selecciona un archivo JSON válido')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const fileContent = e.target?.result as string
      const data = JSON.parse(fileContent)
      const cancion: Cancion = HelperJSON.JSONToCancion(JSON.stringify(data))
      const appStore = useAppStore()
      appStore.editandocancion = cancion
      router?.push('/editar')
    } catch (error) {
      console.error('Error al procesar el archivo JSON:', error)
      alert(
        'Error al procesar el archivo JSON. Verifica que el formato sea correcto.',
      )
    }
  }
  reader.readAsText(file)

  // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
  target.value = ''
}
</script>

<template>
  <button @click="abrirDialogoArchivo">
    ⬆️<span class="button-text"> SUBIR</span>
  </button>

  <input
    ref="fileInput"
    type="file"
    accept=".json"
    style="display: none"
    @change="manejarSeleccionArchivo"
  />
</template>

<style scoped>
.nombreCancion {
  font-weight: bold;
  border: 1px solid #ccc;
  font-size: 1.2em;
  padding: 10px;
}
.cancion {
  cursor: pointer;
  position: relative;
  padding: 15px;
  margin: 5px;
  border-radius: 4px;
  max-width: 24%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  color: #666;
}
.cancion:hover {
  background-color: #1f1818;
  color: #fff;
}
.origen-indicador {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
