<script setup lang="ts">
import { ref, watch } from 'vue'
import { MicHelper } from '../comp_configurar/micHelper'
const tipoAfinacion = ref(440) // 440 Hz por defecto
const cantidadNotas = ref(12) // Cantidad de notas en la afinación
const micHelper = new MicHelper()
const musicaHelper = new MusicaHelper()
const refMicEstado = ref('')
const mediaStream = ref<MediaStream | null>(null)

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()
const refTodosLosAcordes = ref<string[]>(
  props.cancion.acordes.GetTodosLosAcordes(),
)
const audioContext = ref<AudioContext | null>(null)
const analyserNode = ref<AnalyserNode | null>(null)
const sourceNode = ref<MediaStreamAudioSourceNode | null>(null)
const buffer = new Float32Array(2048)
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
const clsNotas = ref<string[]>([])
const notasSonido = ref<NotaSonido[]>([])
const EscuchandoAcorde = ref<string>('')

let modos: { [key: string]: number[] } = {}
modos['mayor'] = [2, 2, 1, 2, 2, 2, 1]
modos['menor'] = [2, 1, 2, 2, 1, 2, 1]

function CalcularNotas() {
  notasSonido.value = HelperSonidos.GetNotas(
    tipoAfinacion.value,
    cantidadNotas.value,
    notas,
  )
  for (var i = 0; i < notasSonido.value.length; i++) {
    clsNotas.value[i] = ''
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
const otrasFrecuencias = ref<FrecuenciaDetectada[]>([])
const otrasNotas = ref<string[]>([])
function detectMultipleFrequencies(
  buffer: Float32Array,
  sampleRate: number,
): FrecuenciaDetectada[] {
  const SIZE = buffer.length
  const frequencies: number[] = []

  // Convertir a espectro de frecuencias usando FFT básica
  const fftSize = SIZE / 2
  const spectrum = new Float32Array(fftSize)

  // Aplicar ventana de Hanning para reducir ruido
  const windowedBuffer = new Float32Array(SIZE)
  for (let i = 0; i < SIZE; i++) {
    const window = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (SIZE - 1)))
    windowedBuffer[i] = buffer[i] * window
  }

  // Calcular magnitudes del espectro
  for (let k = 0; k < fftSize; k++) {
    let real = 0
    let imag = 0

    for (let n = 0; n < SIZE; n++) {
      const angle = (-2 * Math.PI * k * n) / SIZE
      real += windowedBuffer[n] * Math.cos(angle)
      imag += windowedBuffer[n] * Math.sin(angle)
    }

    spectrum[k] = Math.sqrt(real * real + imag * imag)
  }

  // Encontrar picos en el espectro
  const threshold = Math.max(...spectrum) * 0.3 // Aumentar de 0.1 a 0.3
  const minFreq = 80 // Frecuencia mínima para guitarra
  const maxFreq = 2000 // Frecuencia máxima relevante

  for (let k = 1; k < fftSize - 1; k++) {
    const freq = (k * sampleRate) / SIZE

    if (freq < minFreq || freq > maxFreq) continue

    // Verificar si es un pico local
    if (
      spectrum[k] > spectrum[k - 1] &&
      spectrum[k] > spectrum[k + 1] &&
      spectrum[k] > threshold
    ) {
      // Interpolación parabólica para mayor precisión
      const y1 = spectrum[k - 1]
      const y2 = spectrum[k]
      const y3 = spectrum[k + 1]

      const a = (y1 - 2 * y2 + y3) / 2
      const b = (y3 - y1) / 2

      let peakOffset = 0
      if (a !== 0) {
        peakOffset = -b / (2 * a)
      }

      const refinedFreq = ((k + peakOffset) * sampleRate) / SIZE
      frequencies.push(refinedFreq)
    }
  }

  // Ordenar por magnitud (más fuerte primero) y tomar máximo 6 frecuencias
  const indexedFreqs = frequencies.map((freq) => {
    const k = Math.round((freq * SIZE) / sampleRate)
    return { freq, magnitude: spectrum[k] || 0 }
  })

  indexedFreqs.sort((a, b) => b.magnitude - a.magnitude)

  const frequenciesret: FrecuenciaDetectada[] = indexedFreqs.map(
    (item) => new FrecuenciaDetectada(item.freq, item.magnitude),
  )
  return frequenciesret
}
const detectFrequency = () => {
  if (!analyserNode.value) return

  analyserNode.value.getFloatTimeDomainData(buffer)

  // Detectar frecuencia principal con autocorrelación
  const mainFreq = autoCorrelate(buffer, audioContext.value!.sampleRate)
  frequency.value = mainFreq

  // Detectar múltiples frecuencias
  const detectedFreqs = detectMultipleFrequencies(
    buffer,
    audioContext.value!.sampleRate,
  )

  // Filtrar frecuencias válidas y remover la principal si está presente
  otrasFrecuencias.value = detectedFreqs
    .filter(
      (freq) => freq.frecuencia > 0 && Math.abs(freq.frecuencia - mainFreq) > 5,
    ) // Evitar duplicados cercanos
    .slice(0, 5) // Máximo 5 frecuencias adicionales
  otrasNotas.value = otrasFrecuencias.value.map((freq) => {
    const nota =
      notasSonido.value[
        HelperSonidos.GetNotaDesdeFrecuenciaConNotasSonido(
          freq.frecuencia,
          notasSonido.value,
        )
      ]
    return nota.nota + nota.octava
  })
  if (frequency.value !== -1) {
    mostrandoNota.value = HelperSonidos.GetNotaDesdeFrecuenciaConNotasSonido(
      frequency.value,
      notasSonido.value,
    )
  }
  EscuchandoAcorde.value =
    musicaHelper.GetAcordeDeNotas(
      notasSonido.value[mostrandoNota.value].nota +
        notasSonido.value[mostrandoNota.value].octava,
      otrasNotas.value,
    ).nombre || ''
  const appStore = useAppStore()
  if (refTodosLosAcordes.value.length > props.compas + 1) {
    if (refTodosLosAcordes.value[props.compas + 1] === EscuchandoAcorde.value) {
      appStore.aplicacion.reproductor.updateCompas(props.compas + 1)
    }
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

// Añadir log para montaje y desmontaje del componente
import { onMounted, onUnmounted } from 'vue'
import type { NotaSonido } from '../../modelo/sonido/notaSonido'
import { HelperSonidos } from '../../modelo/sonido/helperSonido'
import { FrecuenciaDetectada } from '../../modelo/sonido/FrecuenciaDetectada'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'
import type { Cancion } from '../../modelo/cancion/cancion'
import { useAppStore } from '../../stores/appStore'

onMounted(() => {
  Solicitar()
  CalcularNotas()
})

onUnmounted(() => {
  DejarEscuchar()
})

const mostrandoNota = ref<number>(0)
</script>

<template>
  <div class="divAfinador">
    <div v-if="notasSonido[mostrandoNota]" class="contDatos">
      <div>Nota</div>
      <div
        style="
          font-size: xx-large;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        "
      >
        {{ notasSonido[mostrandoNota].nota }}
        {{ notasSonido[mostrandoNota].octava }}
      </div>
    </div>

    <div class="contDatos">
      <div>Acorde</div>
      <div
        style="
          font-size: xx-large;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        "
      >
        {{ EscuchandoAcorde }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.contDatos {
  border: 1px solid;
  margin: 5px;
  padding: 5px;
}
.sonandoNota {
  background-color: lightgreen;
  color: black;
  font-weight: bold;
}
.circulodiv {
  position: relative;
}

.dropdown-superior-derecha {
  position: absolute;
  left: 100%;
}

.viendoFrecuencia {
  background-color: rgb(133, 104, 202);
  color: white;
  padding: 2px;
  border: 1px solid black;
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
.divAfinador {
  display: flex;
}
</style>
