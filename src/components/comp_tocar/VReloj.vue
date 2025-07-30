<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  fecha: number
}>()

// Calcula el progreso del minuto actual (0-100%)
const progresoMinuto = computed(() => {
  const segundosEnMinuto = Math.floor(props.fecha / 60000)
  return (segundosEnMinuto / 60) * 100
})
</script>

<template>
  <div class="divReloj">
    <div class="progreso-fondo" :style="{ width: progresoMinuto + '%' }"></div>
    <div class="contenido-reloj">
      <!--<div>{{ Math.floor(fecha / 60000) }}m</div>
      -->
      <div>{{ Math.floor((fecha % 60000) / 1000) }}s</div>
      <div>{{ Math.floor(fecha % 1000).toString().padStart(3, '0') }}ms</div>
    </div>
  </div>
</template>

<style scoped>
.divReloj {
  position: relative;
  display: flex;
  border-radius: 10px;
  background-color: rgba(136, 136, 136, 0.65);
  border: 3px solid #8b4513;
  overflow: hidden;
}

.progreso-fondo {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(0, 123, 255, 0.7);
  transition: width 0.1s ease-out;
  z-index: 1;
}

.contenido-reloj {
  position: relative;
  display: flex;
  font-size: xxx-large;
  z-index: 2;
  width: 100%;
}
</style>
