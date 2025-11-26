<script setup lang="ts">
import { computed } from 'vue'
import { AcordesTecladosHelper } from '../../modelo/instrucciones/AcordesTecladosHelper'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import { useAppStore } from '../../stores/appStore'

const props = defineProps<{
  acorde: string
}>()

const helper = HelperDisplayAcordesLatino.getInstance()
const appStore = useAppStore()
helper.latino = appStore.perfil.CifradoLatino

// Obtener las teclas del acorde
const acordeData = computed(() => AcordesTecladosHelper.getAcorde(props.acorde))

// Definir todas las teclas del piano desde C4 hasta B5
const teclas = [
  { nota: 'C4', esNegra: false },
  { nota: 'C#4', esNegra: true },
  { nota: 'D4', esNegra: false },
  { nota: 'D#4', esNegra: true },
  { nota: 'E4', esNegra: false },
  { nota: 'F4', esNegra: false },
  { nota: 'F#4', esNegra: true },
  { nota: 'G4', esNegra: false },
  { nota: 'G#4', esNegra: true },
  { nota: 'A4', esNegra: false },
  { nota: 'A#4', esNegra: true },
  { nota: 'B4', esNegra: false },
  { nota: 'C5', esNegra: false },
  { nota: 'C#5', esNegra: true },
  { nota: 'D5', esNegra: false },
  { nota: 'D#5', esNegra: true },
  { nota: 'E5', esNegra: false },
  { nota: 'F5', esNegra: false },
  { nota: 'F#5', esNegra: true },
  { nota: 'G5', esNegra: false },
  { nota: 'G#5', esNegra: true },
  { nota: 'A5', esNegra: false },
  { nota: 'A#5', esNegra: true },
  { nota: 'B5', esNegra: false },
]

// Función para verificar si una tecla debe estar resaltada
const estaResaltada = (nota: string): boolean => {
  // Normalizar notas con bemoles (Bb -> A#)
  const notaNormalizada = nota.replace('Bb', 'A#')
  return acordeData.value.teclas.some(
    (t: string) => t.replace('Bb', 'A#') === notaNormalizada,
  )
}
</script>

<template>
  <div class="divTocarAcorde">
    <div class="chord-name">{{ helper.GetAcorde(acorde) }}</div>
    <div class="piano-keyboard">
      <div
        v-for="tecla in teclas"
        :key="tecla.nota"
        :class="[
          'piano-key',
          tecla.esNegra ? 'black-key' : 'white-key',
          estaResaltada(tecla.nota) ? 'highlighted' : '',
        ]"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.divTocarAcorde {
  display: inline-block;
  text-align: center;
  margin: 5px;
}

.chord-name {
  color: #a9a8f6;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.piano-keyboard {
  position: relative;
  display: flex;
  height: 80px;
  background: transparent;
}

.piano-key {
  position: relative;
}

.white-key {
  width: 14px;
  height: 80px;
  background: transparent;
  border: 1px solid #a9a8f6;
  border-right: none;
  z-index: 1;
}

.white-key:last-of-type {
  border-right: 1px solid #a9a8f6;
}

.black-key {
  position: absolute;
  width: 10px;
  height: 50px;
  background: #a9a8f6;
  z-index: 2;
  margin-left: -5px;
}

/* Posicionamiento de teclas negras */
.piano-key:nth-child(2) {
  left: 14px;
}
.piano-key:nth-child(4) {
  left: 28px;
}
.piano-key:nth-child(7) {
  left: 56px;
}
.piano-key:nth-child(9) {
  left: 70px;
}
.piano-key:nth-child(11) {
  left: 84px;
}
.piano-key:nth-child(14) {
  left: 112px;
}
.piano-key:nth-child(16) {
  left: 126px;
}
.piano-key:nth-child(19) {
  left: 154px;
}
.piano-key:nth-child(21) {
  left: 168px;
}
.piano-key:nth-child(23) {
  left: 182px;
}

.piano-key.highlighted {
  background: red !important;
}

.white-key.highlighted {
  background: red !important;
}
</style>
