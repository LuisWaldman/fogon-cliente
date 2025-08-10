<script setup lang="ts">
import { ref, watch } from 'vue'
import { Pantalla } from '../../modelo/pantalla'
import { MicHelper } from './micHelper'
import { NotaAfinar } from './notaAfinar'

const pantalla = new Pantalla()
const ancho = pantalla.getAnchoPantalla() * 0.7
const alto = pantalla.getAltoPantalla()
const tipoAfinacion = ref(440) // 440 Hz por defecto
const cantidadNotas = ref(12) // Cantidad de notas en la afinación
const Notas = ref<number[]>([]) // Cantidad de notas en la afinación
const ClaseNotas = ref<string[]>([])
const NotasAnteriores = ref<number[]>([]) // Cantidad de notas en la afinación
const ClaseNotasAnteriores = ref<string[]>([])
const octavasCirculo = ref(7)
const DesdeOctavasCirculo = ref(4)
const refViendoFrecuencia = ref(440)
const micHelper = new MicHelper()
const refMicEstado = ref('')
const mediaStream = ref<MediaStream | null>(null)
const notasAfinar = ref([] as NotaAfinar[])
notasAfinar.value.push(new NotaAfinar('Sexta Cuerda','E2', 82.41))
notasAfinar.value.push(new NotaAfinar('Quinta Cuerda','A2', 110.00))
notasAfinar.value.push(new NotaAfinar('Cuarta Cuerda','D3', 146.83))
notasAfinar.value.push(new NotaAfinar('Tercera Cuerda','G3', 196.00))
notasAfinar.value.push(new NotaAfinar('Segunda Cuerda','B3', 246.94))
notasAfinar.value.push(new NotaAfinar('Primera Cuerda','E4', 329.63))

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
const frequency = ref(-1)
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
function calcularNotas() {
  Notas.value = []
  NotasAnteriores.value = []
  const desdeNota = tipoAfinacion.value / 8
  // cantidadNotas es la cantidad de notas en la octava
  for (let i = 0; i < cantidadNotas.value * 3; i++) {
    const nota = desdeNota * Math.pow(2, i / cantidadNotas.value)
    NotasAnteriores.value.push(nota)
  }
  for (let i = 1; i < cantidadNotas.value * 3; i++) {
    const nota = tipoAfinacion.value * Math.pow(2, i / cantidadNotas.value)
    Notas.value.push(nota)
  }
}

calcularNotas()

function styleDivAfinador() {
  return {
    height: alto + 'px',
    width: ancho + 'px',
  }
}

const maxRadio = 500
const minRadio = 100
const centroLeft = 300
const centroTop = 230
function StyleOctava(i: number) {
  const radio =
    minRadio + ((maxRadio - minRadio) / (octavasCirculo.value - 1)) * (i - 1)
  const left = centroLeft - radio / 2
  const top = centroTop - radio / 2
  return {
    width: radio + 'px',
    top: top + 'px',
    left: left + 'px',
    height: radio + 'px',
    borderRadius: '50%',
  }
}
function StyleFrecuencia(frecuencia: number) {
  let enOctava =
    Math.floor(Math.log2(frecuencia / tipoAfinacion.value)) +
    DesdeOctavasCirculo.value
  const baseOctava =
    tipoAfinacion.value *
    Math.pow(2, Math.floor(Math.log2(frecuencia / tipoAfinacion.value)))
  const portentajeEnOctava = (frecuencia - baseOctava) / baseOctava

  if (enOctava < 0) {
    enOctava = 0
  }
  // Calcular el porcentaje de la octava
  const radio =
    minRadio +
    ((maxRadio - minRadio) / (octavasCirculo.value - 1)) * (enOctava - 1)
  const left =
    centroLeft + Math.cos(portentajeEnOctava * 2 * Math.PI) * (radio / 2)
  const top =
    centroTop + Math.sin(portentajeEnOctava * 2 * Math.PI) * (radio / 2)
  console.log(
    'enOctava',
    enOctava,
    baseOctava,
    'Porcentaje=',
    portentajeEnOctava,
    frecuencia,
    tipoAfinacion.value,
  )
  return {
    top: top + 'px',
    left: left + 'px',
  }
}

function StyleFrecuenciaLinea(frecuencia: number) {
  let fontSize = 10
  let backgroundColor = ''
  let border = ''
  let color = 'white'

  // Calcular en qué octava está la frecuencia relativa a tipoAfinacion
  const octavasDesdeBase = Math.log2(frecuencia / tipoAfinacion.value)
  const octavaCompleta = Math.floor(octavasDesdeBase)
  const baseOctava = tipoAfinacion.value * Math.pow(2, octavaCompleta)
  const portentajeEnOctava = (frecuencia - baseOctava) / baseOctava

  // Determine styling based on the remainder
  if (
    Math.abs(portentajeEnOctava - 0) < 0.01 ||
    Math.abs(portentajeEnOctava - 1) < 0.01
  ) {
    fontSize = 24
    color = 'red'
    border = '1px solid black'
  } else if (Math.abs(portentajeEnOctava - 0.5) < 0.02) {
    fontSize = 22
    border = '1px solid rgb(102, 64, 64);'
  } else if (Math.abs(portentajeEnOctava - 1 / 3) < 0.02) {
    fontSize = 19
    border = '1px solid rgb(102, 64, 64);'
  } else if (Math.abs(portentajeEnOctava - 2 / 3) < 0.02) {
    fontSize = 19
    border = '1px solid rgb(102, 64, 64);'
  }
  return {
    'font-size': fontSize + 'px',
    'background-color': backgroundColor,
    color: color,
    border: border,
    'padding-top': '-12px',
  }
}
</script>

<template>
  <div :style="styleDivAfinador()" class="divAfinador">
    <div style="display: flex">
      <div
        v-for="(nota, index) in NotasAnteriores"
        @click="clickVerFrecuencia(nota)"
        :key="index"
        :style="StyleFrecuenciaLinea(nota)"
        :class="ClaseNotasAnteriores[index]"
        class="clsNota"
      >
        {{ nota.toFixed(0) }}
      </div>
      <input
        type="number"
        v-model="tipoAfinacion"
        min="1"
        max="999"
        @focus="clickVerFrecuencia(tipoAfinacion)"
        @change="calcularNotas"
      />
      <div
        v-for="(nota, index) in Notas"
        @click="clickVerFrecuencia(nota)"
        :key="index"
        :class="ClaseNotas[index]"
        :style="StyleFrecuenciaLinea(nota)"
        class="clsNota"
      >
        {{ nota.toFixed(0) }}
      </div>
    </div>
    <div style="display: flex">
      <div style="position: relative">
        <div class="circulodiv" style="display: flex; width: 800px">
          <div v-for="i in octavasCirculo" :key="i">
            <div :style="StyleOctava(i)" class="circuloOctava"></div>
          </div>

          <div
            :style="StyleFrecuencia(Number(refViendoFrecuencia.toFixed(0)))"
            class="frecuencia viendoFrecuencia"
          >
            {{ refViendoFrecuencia.toFixed(0) }}
          </div>
          <div
            v-if="frequency !== -1"
            :style="StyleFrecuencia(Number(frequency.toFixed(0)))"
            class="frecuencia viendoFrecuencia"
          >
            {{ frequency.toFixed(0) }}
          </div>

          <div
            v-for="k in 3"
            :key="k"
            :style="StyleFrecuencia(tipoAfinacion * Math.pow(2, (k - 1) * 2))"
            class="frecuencia"
          >
            {{ (tipoAfinacion * Math.pow(2, (k - 1) * 2)).toFixed(0) }}
          </div>

          <div
            v-for="k in 3"
            :key="k"
            :style="StyleFrecuencia(440 * Math.pow(2, (k - 1) * 2))"
            class="frecuencia"
          >
            {{ (440 * Math.pow(2, (k - 1) * 2)).toFixed(0) }}
          </div>
        </div>
      </div>
      <div>
        <div>Viendo: {{ refViendoFrecuencia.toFixed(0) }} Hz</div>
        <div>
          Total de Notas:
          <input
            type="number"
            v-model="cantidadNotas"
            min="1"
            max="24"
            @change="calcularNotas"
          />
        </div>
        <div>
          Permisos Mic:
          <span v-if="refMicEstado === 'granted'" @click="Solicitar">✔️</span>
          <span
            v-if="refMicEstado === 'granted' && !escuchando"
            @click="Solicitar"
            >[Escuchar]</span
          >
          <span v-if="escuchando" @click="DejarEscuchar">[Dejar de escuchar]</span>

          <span v-else-if="refMicEstado === 'denied'">❌</span>
          <span v-else-if="refMicEstado === 'error'">⚠️</span>

          <span v-else-if="refMicEstado === 'prompt'" @click="Solicitar"
            >[SOLICITAR]</span
          >
          <span v-else>{{ refMicEstado }}</span>
          <span>{{ frequency }}</span>
        </div>
        <div>
          <div v-for="nota in notasAfinar" :key="nota.nombre"
          :class="{ sonandoNota: Math.abs(frequency - nota.frecuencia) < 12 }">
            {{ nota.nombre }} ({{ nota.nota }}) : <span @click="clickVerFrecuencia(nota.frecuencia)">{{ nota.frecuencia }}</span> Hz

            <div v-if="Math.abs(frequency - nota.frecuencia) < 12">
              <div v-if="frequency < nota.frecuencia"> [TENSAR]{{ Math.abs(frequency - nota.frecuencia).toFixed(2) }}</div>
              <div v-else> [DESTENSAR]{{ Math.abs(frequency - nota.frecuencia).toFixed(2) }}</div>
            </div>
          </div>

        </div>
      </div>
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
.circuloOctava {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgb(133, 104, 202);
}
.viendoFrecuencia {
  background-color: rgb(133, 104, 202);
  color: white;
  padding: 2px;
  border: 1px solid black;
}
.frecuencia {
  position: absolute;
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

function autoCorrelate(buffer: Float32Array, sampleRate: number) { throw new
Error('Function not implemented.') }
