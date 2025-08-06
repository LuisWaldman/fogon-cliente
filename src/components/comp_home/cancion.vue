<script setup lang="ts">
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'

const props = defineProps<{
  cancion: ItemIndiceCancion
}>()

defineEmits(['click'])
</script>

<template>
  <div class="cancion" @click="$emit('click')">
    <div>{{ props.cancion.cancion }}</div>
    <div>{{ props.cancion.banda }}</div>
  </div>
</template>
<style scoped>
.cancion {
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ccc;
  margin: 5px;
  border-radius: 4px;
}
.cancion:hover {
  background-color: #f0f0f0;
}
</style>
