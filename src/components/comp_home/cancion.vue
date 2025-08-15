<script setup lang="ts">
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'

const props = defineProps<{
  cancion: ItemIndiceCancion
}>()
const viendoDetalle = ref(false)
function arreglartexto(texto: string): string {
  let processed = texto.replace(/-/g, ' ')
  if (processed.length === 0) return processed

  // First letter lowercase, rest uppercase
  processed =
    processed.charAt(0).toUpperCase() + processed.slice(1).toLocaleLowerCase()

  // Truncate if longer than 50 characters
  if (processed.length > 50) {
    processed = processed.substring(0, 47) + '...'
  }

  return processed
}

defineEmits(['click'])
</script>

<template>
  <div class="cancion" @click="$emit('click')">
    <div class="nombreCancion">{{ arreglartexto(props.cancion.cancion) }}</div>
    <div class="origen-indicador">
      <div v-if="props.cancion.origen.origenUrl = 'sitio'">🌐</div>
    </div>
    <div>{{ arreglartexto(props.cancion.banda) }}</div>
    <div v-if="viendoDetalle">
      <div v-if="props.cancion.origen">
        origen fileName: {{ props.cancion.origen.fileName }}, url:
        {{ props.cancion.origen.origenUrl }}
        <span v-if="props.cancion.origen.origenUrl == 'server'">{{
          props.cancion.origen.usuario
        }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.nombreCancion {
  font-weight: bold;
  font-size: 1.2em;
}
.cancion {
  cursor: pointer;
  position: relative;
  padding: 15px;
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
