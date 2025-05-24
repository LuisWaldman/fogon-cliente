<script setup lang="ts">
import { ref } from 'vue'
import { watch } from 'vue'
import MidiPlayer from '../../modelo/midi/MidiPlayer'
let midiPlayer = new MidiPlayer()
import { useAppStore } from '../../stores/appStore'
const appStore = useAppStore()
const midiCargado = ref(false)
let sonidoxgolpe = ref([1, 1, 1, 1, 1, 1, 1, 1, 1])
const instrumentosBateria = [
  { nota: '', nombre: 'Silencio', icono: '' }, // Representa la profundidad del bombo
  { nota: 'C1', nombre: 'Bombo', icono: '🪘' }, // Representa la profundidad del bombo
  { nota: 'D1', nombre: 'Redoblante', icono: '🪘' }, // Sonido característico y versátil
  { nota: 'F#1', nombre: 'Hi-Hat cerrado', icono: '🪇' }, // Indica el cierre del sonido
  { nota: 'A#1', nombre: 'Hi-Hat abierto', icono: '🔔' }, // Más resonante
  { nota: 'F1', nombre: 'Tom bajo', icono: '🎵' }, // Representa su tono más grave
  { nota: 'A1', nombre: 'Tom medio', icono: '🥁' }, // Sonido intermedio
  { nota: 'C2', nombre: 'Tom alto', icono: '🥁' }, // Tono más agudo
  { nota: 'C#2', nombre: 'Crash', icono: '💥' }, // Representa el impacto del crash
]

function iniciar() {
  //appStore.midiPlayer.setInstrument
  if (midiCargado.value) {
    midiCargado.value = false
    return
  }
  console.log('Cargar')
  midiPlayer = new MidiPlayer()
  fetch('InstrumentosMIDI/bateria.json')
    .then((response) => response.json())
    .then((samples) => {
      midiPlayer.setInstrument(samples)
      midiPlayer.initialize()
      midiCargado.value = true
    })
    .catch((error) => {
      console.error('Error loading samples:', error)
    })
  console.log('Iniciar')
}

function tocar() {
  if (!midiCargado.value) {
    return
  }

  const note =
    instrumentosBateria[sonidoxgolpe.value[appStore.golpeDelCompas + 1]].nota
  if (note != '') {
    midiPlayer.play(note, 0.05, 0)
  }
}

watch(
  () => appStore.golpeDelCompas,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      tocar()
    }
  },
)

function cambiar(id: number) {
  sonidoxgolpe.value[id] =
    (sonidoxgolpe.value[id] + 1) % instrumentosBateria.length
}
</script>

<template>
  <div>
    <div
      class="divPrevia"
      v-if="appStore.estado == 'tocando' && appStore.compas < 0"
    >
      Empieza en {{ 4 - appStore.golpeDelCompas }}
    </div>
    <div class="metronono">
      <div style="display: flex">
        <div
          v-for="n in appStore.cancion?.compasCantidad"
          :key="n"
          class="beat"
          :class="{
            beat_activo:
              n - 1 === appStore.golpeDelCompas &&
              appStore.estado === 'tocando',
          }"
        >
          {{ n }}
        </div>
        <div
          class="beat"
          :class="{
            beat_activo: midiCargado,
          }"
          @click="iniciar"
        >
          🥁
        </div>
      </div>

      <div style="display: flex" v-if="midiCargado">
        <div
          v-for="n in appStore.cancion?.compasCantidad"
          :key="n"
          @click="cambiar(n)"
          class="beat"
          :class="{
            beat_activo:
              n - 1 === appStore.golpeDelCompas &&
              appStore.estado === 'tocando',
          }"
        >
          {{ instrumentosBateria[sonidoxgolpe[n]].icono }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
}

.metronono {
  border: 1px solid #a9a8f6;
  border-radius: 10px;
  font-size: 27px;
  margin: 4px;
}

.beat {
  border: 1px solid #a9a8f6;
  border-radius: 10px;
  margin: 4px;
  padding-left: 14px;
  padding-right: 14px;
}
.beat_activo {
  background-color: rgb(235, 67, 16);
}
.divPrevia {
  position: absolute;
  top: 200px;
  left: 90px;
  color: red;
  font-size: 80px;
  padding: 20px;
  border: 1px solid red;
}
</style>
