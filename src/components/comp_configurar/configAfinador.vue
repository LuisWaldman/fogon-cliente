<script setup lang="ts">
import { ref, watch } from 'vue'
import { Pantalla } from '../../modelo/pantalla'
import { MicHelper } from './micHelper'
import { NotaAfinar } from './notaAfinar'
import frecuen from './frecuenciometro.vue'

import circulo from './circulo.vue'
const afinandoInstrumento = ref(false)
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
const mostrandoEscala = ref([] as number[]) // Notas de la escala
const mostrandoAcorde = ref([] as number[])

const notas: string[] = [
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
]
const notasSonido = ref<NotaSonido[]>([])
const mostrarEscala = ref(false)
const escalaMenor = ref(false)
const refViendoEscala = ref(0)
let modos: { [key: string]: number[] } = {}
modos['mayor'] = [2, 2, 1, 2, 2, 2]
modos['menor'] = [2, 1, 2, 2, 1, 2]

function CalcularNotas() {
  notasSonido.value = HelperSonidos.GetNotas(
    tipoAfinacion.value,
    cantidadNotas.value,
    notas,
  )
}

function calcularEscala() {
  if (!mostrandoEscala.value) {
    mostrandoEscala.value = []
    return
  }
  mostrandoEscala.value = []
  const modo = escalaMenor.value ? 'menor' : 'mayor'
  let notaCont: number = refViendoEscala.value
  for (let i = 0; i < modos[modo].length; i++) {
    mostrandoEscala.value.push(notaCont % cantidadNotas.value)
    notaCont += modos[modo][i]
  }
}

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
const frequency = ref(0)
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

// Añadir log para montaje y desmontaje del componente
import { onMounted, onUnmounted } from 'vue'
import type { NotaSonido } from '../../modelo/sonido/notaSonido'
import { HelperSonidos } from '../../modelo/sonido/helperSonido'

onMounted(() => {
  Solicitar()
  CalcularNotas()
})

onUnmounted(() => {
  DejarEscuchar()
})

function formatFrequency(freq, totalDigits = 5, decimalPlaces = 2) {
  if (freq < 0) {
    freq = 0
  }
  const fixed = freq.toFixed(decimalPlaces) // Ej: "12.43"
  const [intPart, decPart] = fixed.split('.')
  const paddedInt = intPart.padStart(totalDigits, '0') // Ej: "00012"
  return `${paddedInt},${decPart}` // Ej: "00012,43"
}
</script>

<template>
  <div :style="styleDivAfinador()" class="divAfinador" id="divAfinador">
    <div style="display: flex">
      <div>
        <div>FRECUENCIA</div>
        <div
          style="
            font-size: xx-large;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ formatFrequency(frequency) }} Hz
        </div>
      </div>

      <frecuen
        :notasSonido="notasSonido"
        :frecuencia="frequency"
        :ancho="ancho"
      ></frecuen>
    </div>
    <div style="display: flex">
      <div>
        <div>
          <input
            type="checkbox"
            v-model="mostrarEscala"
            @change="calcularEscala"
          />
          <span>Mostrar Escala</span>
          <select v-model="refViendoEscala" v-if="mostrarEscala">
            <option
              v-for="(nota, index) in notas"
              :key="index"
              :value="index"
              @change="calcularEscala"
            >
              {{ nota }}
            </option>
          </select>
        </div>
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
        :mostrarEscala="mostrandoEscala"
        :mostrarAcorde="mostrandoAcorde"
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
  width: 100%;
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
