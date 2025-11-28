<script setup lang="ts">
import { ref, watch } from 'vue'
import { MicHelper } from './micHelper'
import { NotaAfinar } from './notaAfinar'
import circulo from './circulo.vue'
import selectEscala from '../SelectEscala.vue'
import { Logger } from '../../modelo/logger'

const tipoAfinacion = ref(440) // 440 Hz por defecto
const cantidadNotas = ref(12) // Cantidad de notas en la afinación
const micHelper = new MicHelper()
const refMicEstado = ref('')
const notasAfinar = ref([] as NotaAfinar[])
notasAfinar.value.push(new NotaAfinar('Sexta Cuerda', 'E2', 82.41))
notasAfinar.value.push(new NotaAfinar('Quinta Cuerda', 'A2', 110.0))
notasAfinar.value.push(new NotaAfinar('Cuarta Cuerda', 'D3', 146.83))
notasAfinar.value.push(new NotaAfinar('Tercera Cuerda', 'G3', 196.0))
notasAfinar.value.push(new NotaAfinar('Segunda Cuerda', 'B3', 246.94))
notasAfinar.value.push(new NotaAfinar('Primera Cuerda', 'E4', 329.63))
const instrumentoSeleccionado = ref('guitarra')
const viendoAfindado = ref('simple')
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

const appStore = useAppStore()
const helperNotas = HelperDisplayAcordesLatino.getInstance()
helperNotas.latino = appStore.perfil.CifradoLatino

if (appStore.perfil.CifradoLatino) {
  for (let i = 0; i < notas.length; i++) {
    notas[i] = helperNotas.GetAcorde(notas[i])
  }
}
const clsNotas = ref<string[]>([])
const notasSonido = ref<NotaSonido[]>([])

const mostrarEscala = ref(false)
const refViendoEscala = ref('C')

let modos: { [key: string]: number[] } = {}
modos['mayor'] = [2, 2, 1, 2, 2, 2, 1]
modos['menor'] = [2, 1, 2, 2, 1, 2, 2]

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

function calcularEscala() {
  if (!mostrarEscala.value) {
    for (var i = 0; i < notasSonido.value.length; i++) {
      clsNotas.value[i] = ''
    }
    return
  }

  for (var i = 0; i < notasSonido.value.length; i++) {
    clsNotas.value[i] = 'invisible'
  }
  const escala = notaToMidi(
    refViendoEscala.value.replace(' menor', 'm').replace(' mayor', ''),
  )
  const modo = escala.includes('m') ? 'menor' : 'mayor'
  const notaescala = escala.replace('m', '')
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
  console.log('CALCULANDO ESCALA', notaescala, modo)
  let notaCont: number = notas.indexOf(notaescala)
  for (let i = 0; notaCont < notasSonido.value.length; i++) {
    clsNotas.value[notaCont] = 'clsEscala'
    notaCont += modos[modo][i % modos[modo].length]
  }
}

watch(refViendoEscala, () => {
  calcularEscala()
})

const frequency = ref(0)
const otrasFrecuencias = ref<FrecuenciaDetectada[]>([])
const otrasNotas = ref<string[]>([])
function detectarFrecuencia() {
  micHelper.detectFrequency()
  frequency.value = micHelper.frecuencia
  otrasFrecuencias.value = micHelper.otrasFrecuencias
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

  requestAnimationFrame(detectarFrecuencia)
}
micHelper
  .getEstadoMic()
  .then((estado) => {
    if (estado === 'granted') {
      refMicEstado.value = 'Conectado'
    } else if (estado === 'denied') {
      refMicEstado.value = 'Denegado'
    } else {
      refMicEstado.value = 'No Conectado'
    }
  })
  .catch((error) => {
    Logger.logError(
      'ESTADO MICRÓFONO',
      `${error}`,
    )
    refMicEstado.value = 'Error'
  })
const escuchando = ref(false)
function DejarEscuchar() {
  escuchando.value = false
  micHelper.stopMic()
}
// Solicitar acceso al micrófono
function Solicitar() {
  escuchando.value = true
  micHelper.detectar = true
  micHelper
    .requestMicAccess()
    .then(() => {
      detectarFrecuencia()
    })
    .catch((error) => {
      Logger.logError(
        'SOLICITAR MICRÓFONO',
        `${error}`,
      )
      refMicEstado.value = 'Error'
    })
}

// Añadir log para montaje y desmontaje del componente
import { onMounted, onUnmounted } from 'vue'
import type { NotaSonido } from '../../modelo/sonido/notaSonido'
import { HelperSonidos } from '../../modelo/sonido/helperSonido'
import { FrecuenciaDetectada } from '../../modelo/sonido/FrecuenciaDetectada'
import { useAppStore } from '../../stores/appStore'
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi'
import { MidiPlayer } from '../../modelo/midi/MidiPlayer'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'

onMounted(() => {
  Solicitar()
  CalcularNotas()
  updateInstrumentData()
})

onUnmounted(() => {
  micHelper.detectar = false
  DejarEscuchar()
})

const mostrandoNota = ref<number>(0)

// ============ LÓGICA DE MIDI ============
const refInstrumentos = ref(InstrumentoMidi.GetInstrumentos())
const instrumento = ref('pad_1_new_age.json')
const midiCargado = ref(false)
const CargandoMidi = ref(false)
let midiPlayer = new MidiPlayer()

function clickMidi() {
  if (midiCargado.value) {
    midiCargado.value = false
  } else {
    ActualizarInstrumentoMidi()
  }
}

function iniciarMidi() {
  Logger.log('Cargar MIDI')
  midiPlayer = new MidiPlayer()
  fetch('InstrumentosMIDI/' + instrumento.value)
    .then((response) => response.json())
    .then((samples) => {
      midiPlayer.setInstrument(samples)
      midiPlayer.initialize()
      midiCargado.value = true
      CargandoMidi.value = false
    })
    .catch((error) => {
      console.error('Error loading samples:', error)
      Logger.logError(
        'Cargando MIDI',
        `${error}`,
      )
      CargandoMidi.value = false
    })
  Logger.log('MIDI Inicializado')
}

function ActualizarInstrumentoMidi() {
  midiCargado.value = false
  CargandoMidi.value = true
  iniciarMidi()
  console.log(instrumento.value)
}
function notaToMidi(nota: string): string {
  if (!appStore.perfil.CifradoLatino) return nota
  return helperNotas.GetAcordeAmericano(nota)
}

function TocarNota(nota: string) {
  if (!midiCargado.value) {
    return
  }
  midiPlayer.tocarNota(notaToMidi(nota))
}

function SoltarNota(nota: string) {
  if (!midiCargado.value) {
    return
  }
  midiPlayer.soltarNota(notaToMidi(nota))
}
// ============ FIN LÓGICA DE MIDI ============

function formatFrequency(freq: number, totalDigits = 4, decimalPlaces = 2) {
  if (freq < 0) {
    freq = 0
  }
  const fixed = freq.toFixed(decimalPlaces) // Ej: "12.43"
  const [intPart, decPart] = fixed.split('.')
  const paddedInt = intPart.padStart(totalDigits, '0') // Ej: "00012"
  return `${paddedInt},${decPart}` // Ej: "00012,43"
}

const mostrandoNotas = ref<number[]>([7, 12, 17, 22, 26, 31])
const constNombre = ref<string[]>(['6ta', '5ta', '4ta', '3ra', '2da', '1ra'])
function ajusteTexto(
  frecuenciaIdeal: number,
  frecuenciaActual: number,
): string {
  const diferencia = frecuenciaActual - frecuenciaIdeal
  const porcentaje = Math.abs(diferencia / frecuenciaIdeal)

  if (porcentaje < 0.01) {
    return 'Ok'
  }

  if (diferencia > 0) {
    if (porcentaje < 0.03) return 'Aflojar'
    return 'Aflojar >>'
  } else {
    if (porcentaje < 0.03) return 'Tensar'
    return 'Tensar >>'
  }
}

function updateInstrumentData() {
  const allInstruments = [...instrumentos, ...otrasAfinaciones]
  const instrument = allInstruments.find(
    (inst) => inst.value === instrumentoSeleccionado.value,
  )
  if (instrument) {
    mostrandoNotas.value = instrument.notas
    constNombre.value = instrument.nombres
  } else {
    // Default to guitar
    mostrandoNotas.value = [7, 12, 17, 22, 26, 31]
    constNombre.value = ['6ta', '5ta', '4ta', '3ra', '2da', '1ra']
  }
}

watch(instrumentoSeleccionado, () => {
  updateInstrumentData()
})

const instrumentos = [
  {
    value: 'guitarra',
    label: 'Guitarra',
    notas: [7, 12, 17, 22, 26, 31],
    nombres: ['6ta', '5ta', '4ta', '3ra', '2da', '1ra'],
  },
  {
    value: 'charango',
    label: 'Charango',
    notas: [10, 15, 19, 24, 31],
    nombres: ['5ta', '4ta', '3ra', '2da', '1ra'],
  },
  {
    value: 'violin',
    label: 'Violín',
    notas: [7, 14, 21, 28],
    nombres: ['4ta', '3ra', '2da', '1ra'],
  },
  {
    value: 'ukelele',
    label: 'Ukelele',
    notas: [7, 12, 16, 21],
    nombres: ['4ta', '3ra', '2da', '1ra'],
  },
]

const otrasAfinaciones = [
  {
    value: 'gabierto',
    label: 'Sol Abierto',
    notas: [5, 10, 15, 20, 24, 29],
    nombres: ['6ta', '5ta', '4ta', '3ra', '2da', '1ra'],
  }, // Approx. Open G
  {
    value: 'gcaida',
    label: 'Sol Caida',
    notas: [5, 10, 15, 20, 24, 29],
    nombres: ['6ta', '5ta', '4ta', '3ra', '2da', '1ra'],
  }, // Approx. Drop G
  {
    value: 'dabierto',
    label: 'Re Abierto',
    notas: [2, 7, 12, 17, 21, 26],
    nombres: ['6ta', '5ta', '4ta', '3ra', '2da', '1ra'],
  }, // Approx. Open D
  {
    value: 'dcaida',
    label: 'Re Caida',
    notas: [2, 7, 12, 17, 21, 26],
    nombres: ['6ta', '5ta', '4ta', '3ra', '2da', '1ra'],
  }, // Approx. Drop D
]
function clickEscala() {
  mostrarEscala.value = !mostrarEscala.value
  calcularEscala()
}
</script>

<template>
  <div class="divAfinador" id="divAfinador">
    <div class="dropdown dropdown-superior-derecha">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="bi bi-eye"></i>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li>
          <a class="dropdown-item" href="#" @click="viendoAfindado = 'simple'"
            >Simple</a
          >
          <a class="dropdown-item" href="#" @click="viendoAfindado = 'circulo'"
            >Circulo</a
          >
        </li>
      </ul>
    </div>

    <div v-if="viendoAfindado === 'simple'">
      <div style="display: flex; flex-wrap: wrap">
        <div class="contDatos">
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
          <div>Instrumento</div>
          <div
            style="
              font-size: xx-large;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            <select v-model="instrumentoSeleccionado">
              <option
                v-for="inst in instrumentos"
                :key="inst.value"
                :value="inst.value"
              >
                {{ inst.label }}
              </option>
              <optgroup label="Otras Afinaciones">
                <option
                  v-for="afin in otrasAfinaciones"
                  :key="afin.value"
                  :value="afin.value"
                >
                  {{ afin.label }}
                </option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      <div
        v-for="(nota, index) in mostrandoNotas"
        :key="index"
        style="display: flex; height: 80px; border: 1px solid"
      >
        <div>
          <div
            style="font-size: xx-large; padding-left: 5px; padding-right: 5px"
          >
            {{ constNombre[index] }}
          </div>

          <div v-if="notasSonido[nota]">
            <span style="font-size: x-large; margin-right: 10px"
              >{{ notasSonido[nota].nota }}{{ notasSonido[nota].octava }} </span
            >{{ notasSonido[nota].frecuencia.toFixed(2) }} Hz
          </div>
        </div>
        <div>
          <div
            v-if="notasSonido[nota] && mostrandoNota == nota"
            style="font-size: xx-large"
          >
            {{ ajusteTexto(notasSonido[nota].frecuencia, frequency) }}
          </div>
        </div>
      </div>
    </div>
    <div class="circuloConteiner" v-if="viendoAfindado === 'circulo'">
      <div class="divctrlAfinador">
        <div
          class="ctrlAfinador"
          :class="{ ctrlMostrando: mostrarEscala }"
          @click="clickEscala"
        >
          <span>🎸 Mostrar Escala</span>
          <div>
            <selectEscala
              v-if="mostrarEscala"
              v-model="refViendoEscala"
              @click.stop
            ></selectEscala>
          </div>
        </div>

        <div
          @click="clickMidi"
          class="ctrlAfinador"
          :class="{ ctrlMostrando: midiCargado }"
        >
          <span>🎹 Tocar</span>

          <div @click.stop>
            <select
              v-if="midiCargado"
              v-model="instrumento"
              @change="ActualizarInstrumentoMidi"
            >
              <option
                v-for="(inst, index) in refInstrumentos"
                :key="index"
                :value="inst.archivo"
              >
                {{ inst.nombre }}
              </option>
            </select>
          </div>
          <span v-if="CargandoMidi">Cargando instrumento...</span>
        </div>
      </div>

      <div>
        <circulo
          :notasSonido="notasSonido"
          :clasenotasSonido="clsNotas"
          :otrasNotas="otrasFrecuencias"
          :frecuencia="frequency"
          :tocarNota="TocarNota"
          :soltarNota="SoltarNota"
        ></circulo>
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
.divAfinador {
  position: relative;
  width: 90%;
  margin: auto;
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
.ctrlMostrando {
  background-color: rgb(209, 169, 38);
  color: white;
}
.circuloConteiner {
  display: flex;
}
.ctrlAfinador {
  font-size: large;
  padding: 13px;
  border: 1px solid;
  margin-bottom: 10px;
  cursor: pointer;
}

.divctrlAfinador {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

@media (max-width: 768px) {
  .circuloConteiner {
    display: block;
  }
}
</style>
