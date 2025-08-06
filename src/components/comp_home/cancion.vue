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
    <div v-if="props.cancion.origen">
      origen fileName: {{ props.cancion.origen.fileName }}, url:
      {{ props.cancion.origen.origenUrl }}
      <span v-if="props.cancion.origen.origenUrl == 'server'">{{
        props.cancion.origen.owner
      }}</span>
    </div>
  </div>
</template>
<style scoped>
.cancion {
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ccc;
  margin: 5px;
  border-radius: 4px;
  max-width: 24%;
}
.cancion:hover {
  background-color: #1f1818;
}
</style>
