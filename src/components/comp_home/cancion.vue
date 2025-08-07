<script setup lang="ts">
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'

const props = defineProps<{
  cancion: ItemIndiceCancion
}>()
const viendoDetalle = ref(false)

defineEmits(['click'])
</script>

<template>
  <div class="cancion" @click="$emit('click')">
    <div>{{ props.cancion.cancion }}</div>
    <div class="origen-indicador">
    <div v-if="props.cancion.origen.origenUrl.startsWith('http')">W</div></div>
    <div>{{ props.cancion.banda }}</div>
    <div v-if="viendoDetalle">
       <div v-if="props.cancion.origen">
      
      origen fileName: {{ props.cancion.origen.fileName }}, url:
      {{ props.cancion.origen.origenUrl }}
      <span v-if="props.cancion.origen.origenUrl == 'server'">{{
        props.cancion.origen.owner
      }}</span>
    </div>
    </div>
   
  </div>
</template>
<style scoped>
.cancion {
  cursor: pointer;
  position: relative;
  padding: 5px;
  border: 1px solid #ccc;
  margin: 5px;
  border-radius: 4px;
  max-width: 24%;
}
.cancion:hover {
  background-color: #1f1818;
}
.origen-indicador {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
