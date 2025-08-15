<script setup lang="ts">
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import type { OrigenCancion } from '../../modelo/cancion/origencancion'

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

function clickCancelarCambiarDatos() {
  emit('cerrar', false)
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
    <span class="lblCabecera" @click="clickGuardar">[guardar]</span>
    <span class="lblCabecera" @click="clickGuardar">[nuevo]</span>

    <span class="lblCabecera" @click="clickGuardar">[subir]</span>
    <span class="lblCabecera" @click="clickGuardar">[descargar]</span>
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
      <option value="local">LocalStorage</option>
      <option value="remoto">Servidor</option>
    </select>
    [cancelar][guardar]
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
