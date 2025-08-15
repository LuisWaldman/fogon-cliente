<script setup lang="ts">
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import type { OrigenCancion } from '../../modelo/cancion/origencancion'
import { useAppStore } from '../../stores/appStore'
import { JSONHelper } from '../../modelo/cancion/JSONHelper'

const emit = defineEmits(['cerrar'])
const props = defineProps<{
  cancion: Cancion
  origen: OrigenCancion
}>()

const nombrecancion = ref('')
const nombrebanda = ref('')
const nombrearchivo = ref('')
const origenOriginal = ref('')
const origenDestino = ref('')
nombrecancion.value = props.cancion.cancion
nombrebanda.value = props.cancion.banda
nombrearchivo.value = props.cancion.archivo
origenOriginal.value = props.origen.origenUrl
origenDestino.value = props.origen.origenUrl
const appStore = useAppStore()
function clickCancelarCambiarDatos() {
  emit('cerrar', false)
}


function DescargarJSON() {
  console.log('Descargando JSON de la canción actual...')
  const cancionJSON = JSONHelper.CancionToJSON(props.cancion)
  console.log('Descargando JSON:', cancionJSON)

  const blob = new Blob([cancionJSON], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const nombreArchivo =
    `${appStore.editandocancion.archivo}.json`.toLocaleLowerCase()
  a.download = nombreArchivo
  a.click()
  URL.revokeObjectURL(url)
}
function clickGuardar() {
  props.cancion.cancion = nombrecancion.value
  props.cancion.banda = nombrebanda.value
  props.cancion.archivo = nombrearchivo.value
  emit('cerrar', true)
}
</script>
<template>
  <div>
    <span class="lblCabecera" @click="clickCancelarCambiarDatos"
      >[cancelar]</span
    >
    <span
      v-if="
        origenOriginal !== origenDestino ||
        nombrearchivo !== props.cancion.archivo ||
        nombrecancion !== props.cancion.cancion ||
        nombrebanda !== props.cancion.banda
      "
    >
      [guardar]
    </span>

    <span class="lblCabecera" @click="clickGuardar">[nuevo]</span>

    <span class="lblCabecera" @click="clickGuardar">[subir]</span>
    <span class="lblCabecera" @click="DescargarJSON">[descargar]</span>
  </div>
  <div style="width: 100%">
    <div>
      <label v-if="origen.origenUrl === 'sitio'">🌐</label>

      Cancion:
      <input
        type="text"
        v-model="nombrecancion"
        :style="{ width: nombrecancion.length + 'ch' }"
        class="input-editable"
      />
      - Banda:
      <input
        type="text"
        v-model="nombrebanda"
        :style="{ width: nombrebanda.length + 1 + 'ch' }"
        class="input-editable"
      />
    </div>
  </div>
  <div>
    Archivo:
    <input
      type="text"
      v-model="nombrearchivo"
      :style="{ width: nombrearchivo.length + 'ch' }"
      class="input-editable"
    />
    Origen:
    <select v-model="origenDestino">
      <option value="sitio">🌐Sitio</option>
      <option value="local">🖥️LocalStorage</option>
      <option value="remoto" v-if="appStore.estadoLogin === 'logueado'">
        🔌Servidor
      </option>
    </select>
  </div>
  <div></div>
</template>
<style scoped>
.input-editable {
  border: none;
  outline: none;
  background: transparent;
  width: fit-content;
  color: rgb(97, 95, 202);
}
</style>
