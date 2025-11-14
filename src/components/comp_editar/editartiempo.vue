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
const compas = ref<string>('4_4')

const emit = defineEmits(['cerrar'])

onMounted(() => {
  // Asignar valores actuales y guardar originales
  bpm.value = props.cancion.bpm || 120
  compasCantidad.value = props.cancion.compasCantidad
  compasUnidad.value = props.cancion.compasUnidad
  compas.value = `${compasCantidad.value}_${compasUnidad.value}`
})

function actualizarCompas() {
  const partes = compas.value.split('_')
  props.cancion.compasCantidad = parseInt(partes[0]) || 4
  props.cancion.compasUnidad = parseInt(partes[1]) || 4
}

function clickListo() {
  // Aplicar cambios a la canción
  emit('cerrar')
}

function clickCancelar() {
  // Restaurar valores originales

  props.cancion.bpm = bpm.value
  props.cancion.compasCantidad = compasCantidad.value
  props.cancion.compasUnidad = compasUnidad.value
  emit('cerrar', false)
}
</script>
<template>
  <div v-if="cancion && props.cancion.bpm" class="ctrlEdit">
    <span class="lblCabecera">BPM:</span>
    <input
      type="range"
      style="background-color: #a9a8f6; color: white"
      v-model="props.cancion.bpm"
      min="30"
      max="240"
    />

    {{ props.cancion.bpm }} -
    <span v-if="props.cancion.bpm >= 40 && props.cancion.bpm <= 60">Largo</span>
    <span v-if="props.cancion.bpm > 60 && props.cancion.bpm <= 66"
      >Largo a Adagio</span
    >
    <span v-if="props.cancion.bpm > 66 && props.cancion.bpm <= 76">Adagio</span>
    <span v-if="props.cancion.bpm > 76 && props.cancion.bpm <= 108"
      >Andante</span
    >
    <span v-if="props.cancion.bpm > 108 && props.cancion.bpm <= 120"
      >Moderato</span
    >
    <span v-if="props.cancion.bpm > 120 && props.cancion.bpm <= 168"
      >Allegro</span
    >
    <span v-if="props.cancion.bpm > 168 && props.cancion.bpm <= 176"
      >Vivace</span
    >
    <span v-if="props.cancion.bpm > 176 && props.cancion.bpm <= 200"
      >Presto</span
    >
    <span v-if="props.cancion.bpm > 200">Prestissimo</span>
    <span>&nbsp;-&nbsp;</span>

    <span class="lblCabecera">Compas:</span>
    <select v-model="compas" @change="actualizarCompas">
      <option value="2_4">2/4</option>
      <option value="3_4">3/4</option>
      <option value="4_4">4/4</option>
      <option value="6_8">6/8</option>
      <option value="12_8">12/8</option>
    </select>

    Duracion Cancion:
    <span>{{
      tiempo.formatSegundos(
        (60 / bpm) * compasCantidad * props.cancion.totalCompases,
      )
    }}</span>
    Duracion Compas: <span>{{ ((60 / bpm) * compasCantidad).toFixed(2) }}</span>

    <button class="lblCabecera" @click="clickListo">✔️</button>
    <button class="lblCabecera" @click="clickCancelar">❌</button>
  </div>
</template>
<style scoped>
.ctrlEdit {
  display: flex;
  gap: 10px;
}
</style>
