<script lang="ts" setup>
import { ref, onUnmounted, onMounted } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { MidiPlayer } from '../../modelo/midi/MidiPlayer'
import { MediaVista } from '../../modelo/reproduccion/MediaVista'
import { useAppStore } from '../../stores/appStore'
import { MidiHelper } from '../../modelo/midi/MidiHelper'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

let midiPlayer = new MidiPlayer()
const midiCargado = ref(false)
function iniciar() {
  //appStore.midiPlayer.setInstrument
  if (midiCargado.value) {
    midiCargado.value = false
    return
  }
  console.log('Cargar')
  midiPlayer = new MidiPlayer()
  fetch('InstrumentosMIDI/piano.json')
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

function cargarCancion() {
  if (!midiCargado.value) {
    return
  }
  const helper = new MidiHelper()
  midiPlayer.loadSequence(helper.GetSecuencia(props.cancion))
}

const mediaVista = new MediaVista()
mediaVista.setGetTiempoDesdeInicio(() => {
  const time = midiPlayer.getCurrentTime()
  return time
})
mediaVista.setIniciar(() => {
  play()
})
mediaVista.setPausar(() => {
  stop()
})

onUnmounted(() => {
  const appStore = useAppStore()
  appStore.aplicacion.quitarMediaVista()
})

onMounted(() => {
  const appStore = useAppStore()
  appStore.aplicacion.setMediaVista(mediaVista)
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
</script>
<template>
  <span @click="iniciar" v-if="!midiCargado">[INICIAR MIDI]</span>
  <span @click="cargarCancion" v-if="midiCargado">[CARGAR CANCIÓN]</span>
  <span @click="play" v-if="midiCargado">[PLAY]</span>
  <span @click="stop" v-if="midiCargado">[PAUSA]</span>
  Pentagramas : {{ props.cancion.pentagramas.length }}
</template>
