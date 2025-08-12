<script setup lang="ts">
import { ref, watch } from 'vue'
import { Pantalla } from '../../modelo/pantalla'
import { MicHelper } from './micHelper'
import { NotaAfinar } from './notaAfinar'
import frecuen from './frecuenciometro.vue'

import circulo from './circulo.vue'

const pantalla = new Pantalla()
const ancho = pantalla.getAnchoPantalla() * 0.7
const alto = pantalla.getAltoPantalla()
const tipoAfinacion = ref(440) // 440 Hz por defecto
const cantidadNotas = ref(12) // Cantidad de notas en la afinación
const refViendoFrecuencia = ref(440)
const micHelper = new MicHelper()
const refMicEstado = ref('')
const mediaStream = ref<MediaStream | null>(null)
const notasAfinar = ref([] as NotaAfinar[])
notasAfinar.value.push(new NotaAfinar('Sexta Cuerda', 'E2', 82.41))
notasAfinar.value.push(new NotaAfinar('Quinta Cuerda', 'A2', 110.0))
notasAfinar.value.push(new NotaAfinar('Cuarta Cuerda', 'D3', 146.83))
notasAfinar.value.push(new NotaAfinar('Tercera Cuerda', 'G3', 196.0))
notasAfinar.value.push(new NotaAfinar('Segunda Cuerda', 'B3', 246.94))
notasAfinar.value.push(new NotaAfinar('Primera Cuerda', 'E4', 329.63))

const audioContext = ref<AudioContext | null>(null)
const analyserNode = ref<AnalyserNode | null>(null)
const sourceNode = ref<MediaStreamAudioSourceNode | null>(null)
const buffer = new Float32Array(2048)

watch(mediaStream, (stream) => {
  if (!stream) return

  audioContext.value = new AudioContext()
  sourceNode.value = audioContext.value.createMediaStreamSource(stream)

  analyserNode.value = audioContext.value.createAnalyser()
  analyserNode.value.fftSize = 2048

  sourceNode.value.connect(analyserNode.value)

  detectFrequency() // arranca el loop
})
function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length
  let rms = 0

  // 1. Calcular RMS para detectar silencio
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i]
  }
  rms = Math.sqrt(rms / SIZE)
  if (rms < 0.01) return -1 // silencio

  // 2. Autocorrelación
  const correlations = new Array(SIZE).fill(0)
  for (let lag = 0; lag < SIZE; lag++) {
    for (let i = 0; i < SIZE - lag; i++) {
      correlations[lag] += buffer[i] * buffer[i + lag]
    }
  }

  // 3. Buscar el primer mínimo (inicio del valle)
  let start = 0
  while (correlations[start] > correlations[start + 1]) {
    start++
  }

  // 4. Buscar el pico máximo después del valle
  let maxval = -1
  let maxpos = -1
  for (let i = start; i < SIZE; i++) {
    if (correlations[i] > maxval) {
      maxval = correlations[i]
      maxpos = i
    }
  }

  // 5. Calcular frecuencia
  const T0 = maxpos
  return sampleRate / T0
}
const frequency = ref(90)
const detectFrequency = () => {
  if (!analyserNode.value) return

  analyserNode.value.getFloatTimeDomainData(buffer)
  frequency.value = autoCorrelate(buffer, audioContext.value!.sampleRate)

  if (frequency.value !== -1) {
    console.log(`🎯 Frecuencia detectada: ${frequency.value.toFixed(2)} Hz`)
  }

  requestAnimationFrame(detectFrequency)
}

micHelper
  .getEstadoMic()
  .then((estado) => {
    refMicEstado.value = estado
  })
  .catch((error) => {
    console.error('Error al obtener el estado del micrófono:', error)
    refMicEstado.value = 'Error'
  })
const escuchando = ref(false)
function DejarEscuchar() {
  // Detener todos los tracks del MediaStream primero
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => {
      track.stop()
    })
    mediaStream.value = null
  }

  // Desconectar y cerrar el contexto de audio
  if (sourceNode.value) {
    sourceNode.value.disconnect()
    sourceNode.value = null
  }

  if (analyserNode.value) {
    analyserNode.value.disconnect()
    analyserNode.value = null
  }

  if (audioContext.value && audioContext.value.state !== 'closed') {
    audioContext.value.close()
    audioContext.value = null
  }

  escuchando.value = false
}
// Solicitar acceso al micrófono
function Solicitar() {
  escuchando.value = true
  micHelper
    .requestMicAccess()
    .then((media) => {
      mediaStream.value = media
    })
    .catch((error) => {
      console.error('Error al solicitar permiso del micrófono:', error)
      refMicEstado.value = 'Error'
    })
}
function clickVerFrecuencia(frecuencia: number) {
  refViendoFrecuencia.value = frecuencia
}

function styleDivAfinador() {
  return {
    height: alto + 'px',
    width: ancho + 'px',
  }
}
</script>

<template>
  <div :style="styleDivAfinador()" class="divAfinador">
    <div style="display: flex">
      <div width="200px" max-width="200px">
        FRECUENCIA <span> {{ frequency.toFixed(2) }} </span> Hz
      </div>
      <frecuen
        :tipoAfinacion="tipoAfinacion"
        :cantidadNotas="cantidadNotas"
        :frecuencia="frequency"
        :ancho="ancho"
      ></frecuen>
    </div>
    <div style="display: flex">
      <div>
        <div>Viendo: {{ refViendoFrecuencia.toFixed(0) }} Hz</div>
        <div>
          Afinacion
          <input
            type="number"
            v-model="tipoAfinacion"
            min="1"
            max="999"
            @focus="clickVerFrecuencia(tipoAfinacion)"
          />
          Hz Total de Notas:
          <input type="number" v-model="cantidadNotas" min="1" max="24" />
        </div>
        <div>
          Permisos Mic:
          <span v-if="refMicEstado === 'granted'" @click="Solicitar">✔️</span>
          <span
            v-if="refMicEstado === 'granted' && !escuchando"
            @click="Solicitar"
            >[Escuchar]</span
          >
          <span v-if="escuchando" @click="DejarEscuchar"
            >[Dejar de escuchar]</span
          >

          <span v-else-if="refMicEstado === 'denied'">❌</span>
          <span v-else-if="refMicEstado === 'error'">⚠️</span>

          <span v-else-if="refMicEstado === 'prompt'" @click="Solicitar"
            >[SOLICITAR]</span
          >
          <span v-else>{{ refMicEstado }}</span>
          <span>{{ frequency }}</span>
        </div>
        <div>
          <div
            v-for="nota in notasAfinar"
            :key="nota.nombre"
            :class="{ sonandoNota: Math.abs(frequency - nota.frecuencia) < 12 }"
          >
            {{ nota.nombre }} ({{ nota.nota }}) :
            <span @click="clickVerFrecuencia(nota.frecuencia)">{{
              nota.frecuencia
            }}</span>
            Hz

            <div v-if="Math.abs(frequency - nota.frecuencia) < 12">
              <div v-if="frequency < nota.frecuencia">
                [TENSAR]{{ Math.abs(frequency - nota.frecuencia).toFixed(2) }}
              </div>
              <div v-else>
                [DESTENSAR]{{
                  Math.abs(frequency - nota.frecuencia).toFixed(2)
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <circulo
        :tipoAfinacion="tipoAfinacion"
        :cantidadNotas="cantidadNotas"
        :frecuencia="frequency"
        :ancho="ancho"
      ></circulo>
    </div>
  </div>
</template>

<style scoped>
.sonandoNota {
  background-color: lightgreen;
  color: black;
  font-weight: bold;
}
.circulodiv {
  position: relative;
}
.viendoFrecuencia {
  background-color: rgb(133, 104, 202);
  color: white;
  padding: 2px;
  border: 1px solid black;
}
.divAfinador {
}

.quinta {
  font-size: larger;
  background-color: lightyellow;
}
.octava {
  background-color: lightgrey;
  font-size: x-large;
}
.clsNota {
  padding: 1px;
  height: 30px;
}
</style>
