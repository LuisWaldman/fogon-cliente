<script lang="ts" setup>
import { ref, onUnmounted, onMounted } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { MidiPlayer } from '../../modelo/midi/MidiPlayer'
import { MediaVista } from '../../modelo/reproduccion/MediaVista'
import { useAppStore } from '../../stores/appStore'
import { MidiHelper } from '../../modelo/midi/MidiHelper'
import { Logger } from '../../modelo/logger'

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
    midiPlayer.compasCantidad = props.cancion.compasCantidad
    midiPlayer.compasUnidad = props.cancion.compasUnidad
    midiPlayer.loadSequence(props.cancion.pentagramas[i].instrumento, secuencia)
  }
  mediaVista.MediaCambioEstado?.('cargado')
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
  Logger.log('Cargar')
  midiPlayer = new MidiPlayer()
  todosInstrumentos.value = [
    ...new Set(props.cancion.pentagramas.map((p) => p.instrumento)),
  ]
  InstrumentosSelecconados.value = [...todosInstrumentos.value]
  midiPlayer.cargarInstrumentos(todosInstrumentos.value).then(() => {
    midiCargado.value = true
    Logger.log('Instrumentos cargados')
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
  appStore.aplicacion.reproductor.quitarMediaVista()
})

onMounted(() => {
  const appStore = useAppStore()
  appStore.aplicacion.reproductor.setMediaVista(mediaVista)
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

function setinstrumentovolumen(
  instrumento: string,
  target: EventTarget | null,
) {
  const volumen = (target as HTMLInputElement).value
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
      <div
        v-if="InstrumentosSelecconados.includes(instrumento)"
        class="volumen-control"
      >
        <span class="volumen-icono">🔊</span>
        <input
          type="range"
          min="-10"
          max="5"
          step="0.1"
          @input="setinstrumentovolumen(instrumento, $event.target)"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.instrumento {
  background-color: #000000;
  border: 2px solid #a9a8f6;
  border-radius: 10px;
  padding: 12px 16px;
  margin: 10px 0;
  transition: all 0.3s ease;
}

.instrumento:hover {
  box-shadow: 0 4px 8px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

.instrumento > div:first-child {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  user-select: none;
  color: #a9a8f6;
}

.instrumento > div:first-child:hover {
  background-color: #1a1a1a;
}

.seleccionado {
  background-color: #2a2a4a;
  color: #a9a8f6;
  box-shadow: 0 3px 6px rgba(169, 168, 246, 0.4);
}

.seleccionado:hover {
  background-color: #353560;
}

.volumen-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.volumen-icono {
  font-size: 1.2rem;
  min-width: 24px;
}

input[type='range'] {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #333;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #a9a8f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(169, 168, 246, 0.4);
  transition: all 0.2s ease;
}

input[type='range']::-webkit-slider-thumb:hover {
  background: #8a88d6;
  transform: scale(1.2);
}

input[type='range']::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #a9a8f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(169, 168, 246, 0.4);
  transition: all 0.2s ease;
}

input[type='range']::-moz-range-thumb:hover {
  background: #8a88d6;
  transform: scale(1.2);
}
</style>
