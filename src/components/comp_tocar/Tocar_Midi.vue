<script lang="ts" setup>
import { ref, onUnmounted, onMounted } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { MidiPlayer } from '../../modelo/midi/MidiPlayer'
import { MediaVista } from '../../modelo/reproduccion/MediaVista'
import { useAppStore } from '../../stores/appStore'
import { MidiHelper } from '../../modelo/midi/MidiHelper'
import { Tiempo } from '../../modelo/tiempo'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

let midiPlayer = new MidiPlayer()
const midiCargado = ref(false)
const mediaVista = new MediaVista('MIDI')
const refTiempo = ref(0)
mediaVista.setGetTiempoDesdeInicio(() => {
  const time = midiPlayer.getCurrentTime()
  refTiempo.value = time
  return time
})

function cargarCancion() {
  const helper = new MidiHelper()
  midiPlayer.borrarSequence()
  const bpm = props.cancion.bpm ? props.cancion.bpm : 40
  for (let i = 0; i < props.cancion.pentagramas.length; i++) {
    if (
      InstrumentosSelecconados.value.indexOf(
        props.cancion.pentagramas[i].instrumento,
      ) < 0
    ) {
      continue
    }
    const secuencia = helper.GetSecuencia(props.cancion.pentagramas[i], bpm)
    midiPlayer.loadSequence(props.cancion.pentagramas[i].instrumento, secuencia)
  }
}
const todosInstrumentos = ref<string[]>([])
const InstrumentosSelecconados = ref<string[]>([])
function clickInstrumentos(instrumento: string) {
  const index = InstrumentosSelecconados.value.indexOf(instrumento)
  if (index >= 0) {
    InstrumentosSelecconados.value.splice(index, 1)
  } else {
    InstrumentosSelecconados.value.push(instrumento)
  }
  cargarCancion()
}
function iniciar() {
  if (midiCargado.value) {
    midiCargado.value = false
    return
  }
  console.log('Cargar')
  midiPlayer = new MidiPlayer()
  todosInstrumentos.value = [
    ...new Set(props.cancion.pentagramas.map((p) => p.instrumento)),
  ]
  InstrumentosSelecconados.value = [...todosInstrumentos.value]
  midiPlayer.cargarInstrumentos(todosInstrumentos.value).then(() => {
    midiCargado.value = true
    console.log('Instrumentos cargados')
    cargarCancion()
  })
}

mediaVista.setIniciar(() => {
  play()
})
mediaVista.setPausar(() => {
  stop()
})
mediaVista.setSetTiempoDesdeInicio((numero: number) => {
  midiPlayer.setCurrentTime(numero)
})

mediaVista.setGetEstado(() => {
  return midiPlayer.getPlayerState() || -1
})

onUnmounted(() => {
  const appStore = useAppStore()
  appStore.aplicacion.quitarMediaVista(mediaVista)
})

onMounted(() => {
  const appStore = useAppStore()
  appStore.aplicacion.setMediaVista(mediaVista)
  iniciar()
  cargarCancion()
})

function play() {
  if (!midiCargado.value) {
    return
  }
  midiPlayer.start()
}

function stop() {
  if (!midiCargado.value) {
    return
  }
  midiPlayer.stop()
}

const tiempo = new Tiempo()
function setinstrumentovolumen(instrumento: string, volumen: string) {
  midiPlayer.setInstrumentVolume(instrumento, parseFloat(volumen))
}
</script>
<template>
  <div>
    <div
      v-for="instrumento in todosInstrumentos"
      :key="instrumento"
      class="instrumento"
    >
      <div
        :class="{
          seleccionado: InstrumentosSelecconados.includes(instrumento),
        }"
        @click="clickInstrumentos(instrumento)"
      >
        {{ instrumento }}
      </div>
      <div v-if="InstrumentosSelecconados.includes(instrumento)">
        <input
          type="range"
          min="-10"
          max="5"
          step="0.1"
          @input="setinstrumentovolumen(instrumento, $event.target.value)"
        />
      </div>
    </div>
    <div class="tiempoMidi">
      TIEMPO:
      {{ tiempo.formatSegundos(refTiempo / 1000) }}
    </div>
  </div>
</template>
<style scoped>
.tiempoMidi {
  font-size: x-large;
  border: 1px solid;
  padding: 4px;
}
.seleccionado {
  border: 1px solid;
  background-color: lightcyan;
  color: black;
}
.instrumento {
  padding: 2px;
  margin: 2px;
  border: 1px solid;
}
</style>
