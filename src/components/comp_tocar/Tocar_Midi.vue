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
const mediaVista = new MediaVista()
mediaVista.setGetTiempoDesdeInicio(() => {
  const time = midiPlayer.getCurrentTime()
  return time
})

function cargarCancion() {
  const helper = new MidiHelper()
  midiPlayer.borrarSequence()
  const bpm = props.cancion.bpm ? props.cancion.bpm : 40
  for (let i = 0; i < props.cancion.pentagramas.length; i++) {
    const secuencia = helper.GetSecuencia(props.cancion.pentagramas[i], bpm)
    midiPlayer.loadSequence(secuencia)
  }
}
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
      cargarCancion()
    })
    .catch((error) => {
      console.error('Error loading samples:', error)
    })
  console.log('Iniciar')
}

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
</script>
<template>
  <span @click="play">[PLAY]</span>
  <span @click="stop">[PAUSA]</span>
  Pentagramas : {{ props.cancion.pentagramas.length }}
</template>
