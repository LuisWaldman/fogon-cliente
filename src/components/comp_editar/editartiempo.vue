<script setup lang="ts">
import type { Cancion } from '../../modelo/cancion/cancion'
import { Tiempo } from '../../modelo/tiempo'
const tiempo = new Tiempo()

defineProps<{
  cancion: Cancion
}>()

const emit = defineEmits(['cerrar'])
function clickListo() {
  emit('cerrar')
}
</script>
<template>
  <div @click="clickListo">[Listo]</div>
  <div v-if="cancion">
    <span class="lblCabecera">BPM:</span>
    <input
      type="range"
      style="background-color: #a9a8f6; color: white"
      v-model="cancion.bpm"
      min="30"
      max="240"
    />
    {{ cancion.bpm }} -
    <span v-if="cancion?.bpm && cancion.bpm >= 40 && cancion.bpm <= 60"
      >Largo</span
    >

    <span v-if="cancion?.bpm && cancion.bpm > 60 && cancion.bpm <= 66"
      >Largo a Adagio</span
    >
    <span v-if="cancion?.bpm && cancion.bpm > 66 && cancion.bpm <= 76"
      >Adagio</span
    >
    <span v-if="cancion?.bpm && cancion.bpm > 76 && cancion.bpm <= 108"
      >Andante</span
    >
    <span v-if="cancion?.bpm && cancion.bpm > 108 && cancion.bpm <= 120"
      >Moderato</span
    >
    <span v-if="cancion?.bpm && cancion.bpm > 120 && cancion.bpm <= 168"
      >Allegro</span
    >
    <span v-if="cancion?.bpm && cancion.bpm > 168 && cancion.bpm <= 176"
      >Vivace</span
    >
    <span v-if="cancion?.bpm && cancion.bpm > 176 && cancion.bpm <= 200"
      >Presto</span
    >
    <span v-if="cancion?.bpm && cancion.bpm > 200">Prestissimo</span>
    <span>&nbsp;-&nbsp;</span>

    <span class="lblCabecera">Compas:</span>
    <input
      type="text"
      v-model="cancion.compasCantidad"
      maxlength="1"
      :style="{ width: '3ch' }"
    />
    /
    <input
      type="text"
      v-model="cancion.compasUnidad"
      maxlength="1"
      :style="{ width: '3ch' }"
    />
    Duracion: <span>{{ tiempo.formatSegundos(cancion.duracionCancion) }}</span>
  </div>
</template>
<style scoped></style>
