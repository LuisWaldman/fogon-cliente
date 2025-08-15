<script setup lang="ts">
import type { Cancion } from '../../modelo/cancion/cancion'

defineProps<{
  cancion: Cancion
}>()
</script>
<template>
  <div style="width: 100%">
    <div>
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
    <div>
      Archivo:
      <input
        type="text"
        v-model="cancion.archivo"
        :style="{ width: cancion.archivo.length + 'ch' }"
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
