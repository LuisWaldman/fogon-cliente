<script setup lang="ts">
import { ref } from 'vue';
import type { Cancion } from '../../modelo/cancion/cancion'
import type { OrigenCancion } from '../../modelo/cancion/origencancion';

const emit = defineEmits(['cerrar'])
const props = defineProps<{
  cancion: Cancion
  origen: OrigenCancion
}>()

const modelcancion = ref(props.cancion.cancion)
const modelbanda = ref(props.cancion.banda)
const modelarchivo = ref(props.cancion.archivo)

function clickCancelarCambiarDatos() {
  emit('cerrar', false)
}
function clickGuardar() {
  props.cancion.cancion = modelcancion.value
  props.cancion.banda = modelbanda.value
  props.cancion.archivo = modelarchivo.value
  emit('cerrar', true)
}
</script>
<template>
  
  <div>
    <span class="lblCabecera" @click="clickCancelarCambiarDatos"
      >[cancelar]</span
    >
    <span
      class="lblCabecera"
      
      @click="clickGuardar"
      >[guardar]</span
    >
    <span
      class="lblCabecera"
      
      @click="clickGuardar"
      >[nuevo]</span>
      <span
      class="lblCabecera"
      
      @click="clickGuardar"
      >[descargar]</span>
    <span
      class="lblCabecera"
      
      @click="clickGuardar"
      >[subir]</span>
    
  </div>
  <div style="width: 100%">
    
    <div>
      <label v-if="origen.origenUrl === 'sitio'">🌐</label>
      
      Cancion:
      <input
        type="text"
        v-model="cancion.cancion"
        :style="{ width: cancion.cancion.length + 'ch' }"
        class="input-editable"
      />
      - Banda:
      <input
        type="text"
        v-model="cancion.banda"
        :style="{ width: cancion.banda.length + 1 + 'ch' }"
        class="input-editable"
      />
    </div>
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
