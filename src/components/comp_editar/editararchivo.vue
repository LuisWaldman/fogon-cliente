<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { OrigenCancion } from '../../modelo/cancion/origencancion'
import { useAppStore } from '../../stores/appStore'
import { HelperJSON } from '../../modelo/cancion/HelperJSON'
const emit = defineEmits(['cerrar'])
const props = defineProps<{
  cancion: Cancion
  origen: OrigenCancion
}>()

const nombrecancion = ref('')
const nombrebanda = ref('')
const nombrearchivo = ref('')
const calidad = ref(props.cancion.calidad)
nombrecancion.value = props.cancion.cancion
nombrebanda.value = props.cancion.banda
nombrearchivo.value = props.cancion.archivo || 'archivo_noload'

const appStore = useAppStore()
function clickCancelarCambiarDatos() {
  props.cancion.cancion = nombrecancion.value
  props.cancion.banda = nombrebanda.value
  props.cancion.archivo = nombrearchivo.value
  props.cancion.calidad = calidad.value
  emit('cerrar', false)
}
function clickOkCambiarDatos() {
  emit('cerrar', false)
}

function hacerNombreArchivo() {
  props.cancion.archivo =
    props.cancion.banda.replace(/ /g, '_') +
    '-' +
    props.cancion.cancion.replace(/ /g, '_')
}

</script>
<template>
  <div style="width: 100%">
    Cancion:
    <input
      type="text"
      v-model="props.cancion.cancion"
      :style="{ width: props.cancion.cancion.length + 'ch' }"
      @change="hacerNombreArchivo"
      class="input-editable"
    />
    - Banda:
    <input
      type="text"
      class="input-editable"
      v-model="props.cancion.banda"
      @change="hacerNombreArchivo"
      :style="{ width: props.cancion.banda.length + 1 + 'ch' }"
    />

    Archivo:
    <input
      type="text"
      v-model="props.cancion.archivo"
      :style="{ width: props.cancion.archivo.length + 'ch' }"
    />
    Calidad:
    <select v-model="cancion.calidad">
      <option value="-1">♻️ Reprocesar</option>
      <option value="0">⭐⚫⚫⚫⚫ De Internet</option>
      <option value="1">⭐⭐⚫⚫⚫ Texto Sincronizado</option>
      <option value="2">⭐⭐⭐⚫⚫ Texto Corregido</option>
      <option value="3">Ok</option>
    </select>
    <button class="lblCabecera" @click="clickOkCambiarDatos">✔️</button>
    <button class="lblCabecera" @click="clickCancelarCambiarDatos">❌</button>
  </div>
  <div></div>
</template>
<style scoped>
.btnDescarga {
  margin-left: 20px;
}
</style>
