<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { Tiempo } from '../../modelo/tiempo'

const tiempo = new Tiempo()

const props = defineProps<{
  cancion: Cancion
}>()

// Variables reactivas para edición
const bpm = ref<number>(0)
const compasCantidad = ref<number>(1)
const compasUnidad = ref<number>(2)

const emit = defineEmits(['cerrar'])

onMounted(() => {
  // Asignar valores actuales y guardar originales
  bpm.value = props.cancion.bpm || 120
  compasCantidad.value = props.cancion.compasCantidad
  compasUnidad.value = props.cancion.compasUnidad
})

function clickListo() {
  // Aplicar cambios a la canción
  props.cancion.bpm = bpm.value
  props.cancion.compasCantidad = compasCantidad.value
  props.cancion.compasUnidad = compasUnidad.value
  emit('cerrar')
}

function clickCancelar() {
  // Restaurar valores originales
  emit('cerrar', false)
}
</script>
<template>
  <span @click="clickCancelar">[Cancelar]</span>
  <span @click="clickListo">[Guardar]</span>
  <div v-if="cancion">
    <span class="lblCabecera">BPM:</span>
    <input
      type="range"
      style="background-color: #a9a8f6; color: white"
      v-model="bpm"
      min="30"
      max="240"
    />
    {{ bpm }} -
    <span v-if="bpm >= 40 && bpm <= 60">Largo</span>
    <span v-if="bpm > 60 && bpm <= 66">Largo a Adagio</span>
    <span v-if="bpm > 66 && bpm <= 76">Adagio</span>
    <span v-if="bpm > 76 && bpm <= 108">Andante</span>
    <span v-if="bpm > 108 && bpm <= 120">Moderato</span>
    <span v-if="bpm > 120 && bpm <= 168">Allegro</span>
    <span v-if="bpm > 168 && bpm <= 176">Vivace</span>
    <span v-if="bpm > 176 && bpm <= 200">Presto</span>
    <span v-if="bpm > 200">Prestissimo</span>
    <span>&nbsp;-&nbsp;</span>

    <span class="lblCabecera">Compas:</span>
    <input
      type="text"
      v-model="compasCantidad"
      maxlength="1"
      :style="{ width: '3ch' }"
    />
    /
    <input
      type="text"
      v-model="compasUnidad"
      maxlength="1"
      :style="{ width: '3ch' }"
    />

    Duracion Cancion:
    <span>{{
      tiempo.formatSegundos(
        (60 / bpm) * compasCantidad * props.cancion.totalCompases,
      )
    }}</span>
    Duracion Compas: <span>{{ ((60 / bpm) * compasCantidad).toFixed(2) }}</span>
  </div>
</template>
<style scoped></style>
