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
  { nota: 'E4', nombre: 'Caja', icono: '🥁' }, // Sonido intermedio
  { nota: 'A#3', nombre: 'Matraca', icono: '🪇' }, // Indica el cierre del sonido
  { nota: 'C#3', nombre: 'Platillo cerrado', icono: '🔔>' }, // Más resonante
  { nota: 'D#3', nombre: 'Platillo abierto', icono: '🔔<' }, // Más resonante
  { nota: 'G#4', nombre: 'Triangulo', icono: '🎵' }, // Representa su tono más grave
  { nota: 'C5', nombre: 'Silbato', icono: '🪈' }, // Tono más agudo
  { nota: 'F6', nombre: 'Crash', icono: '🦶' }, // Representa el impacto del crash
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

function cambiar(id: number, idx: number = 0) {
  sonidoxgolpe.value[id] = idx
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

      <div>
        <div style="display: flex" v-if="midiCargado">
          <div
            class="dropdown"
            v-for="n in appStore.cancion?.compasCantidad"
            :key="n"
          >
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ instrumentosBateria[sonidoxgolpe[n]].icono }}
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li v-for="(instrumento, idx) in instrumentosBateria" :key="idx">
                <a class="dropdown-item" @click="cambiar(n, idx)">
                  {{ instrumento.icono }} {{ instrumento.nombre }}
                </a>
              </li>
            </ul>
          </div>
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
