<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'

import renglonPentagrama from './renglonPentagrama.vue'

defineProps<{
  compas: number
  cancion: Cancion
}>()


</script>
<template>
  <div class="componenteMusical">
    <renglonPentagrama></renglonPentagrama>
    {{ cancion }}
  </div>
</template>

<style scoped>
</style>
