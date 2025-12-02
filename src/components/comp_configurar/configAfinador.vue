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
    Logger.logError('ESTADO MICRÓFONO', `${error}`)
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
      Logger.logError('SOLICITAR MICRÓFONO', `${error}`)
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
      Logger.logError('Cargando MIDI', `${error}`)
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
/* Contenedor principal del afinador */
.divAfinador {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: auto;
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.08) 0%, rgba(0, 0, 0, 0.9) 100%);
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.1);
}

/* Contenedores de datos mejorados */
.contDatos {
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.15) 0%, rgba(0, 0, 0, 0.7) 100%);
  border: 1px solid rgba(169, 168, 246, 0.4);
  border-radius: 10px;
  margin: 8px;
  padding: 15px 18px;
  min-width: 200px;
  backdrop-filter: blur(3px);
  transition: all 0.3s ease;
}

.contDatos:hover {
  border-color: #a9a8f6;
  box-shadow: 0 4px 15px rgba(169, 168, 246, 0.2);
  transform: translateY(-2px);
}

.contDatos > div:first-child {
  color: #a9a8f6;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.contDatos > div:last-child {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Select mejorado dentro de contDatos */
.contDatos select {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  color: #ffffff;
  padding: 8px 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  width: 100%;
  max-width: 200px;
}

.contDatos select:hover {
  border-color: #ffffff;
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.2);
}

.contDatos select option {
  background: #2d3748;
  color: #ffffff;
  padding: 8px;
}

/* Filas de cuerdas mejoradas */
.divAfinador > div > div[style*="display: flex"][style*="height: 80px"] {
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%);
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  margin: 6px 0;
  padding: 10px 15px;
  align-items: center;
  gap: 15px;
  transition: all 0.2s ease;
}

.divAfinador > div > div[style*="display: flex"][style*="height: 80px"]:hover {
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.15) 0%, rgba(0, 0, 0, 0.7) 100%);
}

/* Nota destacada cuando está sonando */
.sonandoNota {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  border-color: #34d399 !important;
  color: #ffffff !important;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

/* Dropdown superior derecha */
.dropdown-superior-derecha {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}

.dropdown-superior-derecha button {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  color: #ffffff;
  padding: 8px 12px;
}

.dropdown-superior-derecha button:hover {
  background: linear-gradient(135deg, #a9a8f6 0%, #8b7cf6 100%);
  border-color: #ffffff;
}

/* Indicador de frecuencia */
.viendoFrecuencia {
  background: linear-gradient(135deg, #a9a8f6 0%, #8b7cf6 100%);
  color: #ffffff;
  padding: 6px 12px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 6px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Contenedor del círculo */
.circuloConteiner {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* Controles del afinador */
.divctrlAfinador {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  gap: 12px;
}

.ctrlAfinador {
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%);
  border: 1px solid rgba(169, 168, 246, 0.4);
  border-radius: 10px;
  padding: 15px 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.ctrlAfinador:hover {
  border-color: #a9a8f6;
  box-shadow: 0 4px 15px rgba(169, 168, 246, 0.2);
  transform: translateY(-2px);
}

.ctrlAfinador span {
  color: #a9a8f6;
  font-weight: 600;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 8px;
}

/* Control activo/mostrando */
.ctrlMostrando {
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.2) 0%, rgba(207, 218, 65, 0.1) 50%, rgba(0, 0, 0, 0.8) 100%);
  border: 2px solid #a9a8f6;
  box-shadow: 0 0 20px rgba(169, 168, 246, 0.4);
}

.ctrlMostrando span {
  color: #ffffff;
}

/* Select dentro de controles */
.ctrlAfinador select {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  color: #ffffff;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  width: 100%;
  margin-top: 8px;
}

.ctrlAfinador select:hover {
  border-color: #ffffff;
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.2);
}

/* Estilos para notas específicas */
.quinta {
  font-size: 1.2rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #000000;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.octava {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  color: #ffffff;
  font-size: 1.4rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.clsNota {
  padding: 6px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .divAfinador {
    padding: 15px;
  }
  
  .circuloConteiner {
    display: block;
    gap: 15px;
  }
  
  .divctrlAfinador {
    margin-right: 0;
    margin-bottom: 20px;
    min-width: auto;
  }
  
  .contDatos {
    min-width: auto;
    margin: 5px 0;
    padding: 12px 15px;
  }
  
  .contDatos > div:last-child {
    font-size: 1.5rem;
  }
  
  .ctrlAfinador {
    padding: 12px 15px;
    font-size: 0.95rem;
  }
  
  .dropdown-superior-derecha {
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .divAfinador {
    padding: 12px;
  }
  
  .contDatos {
    padding: 10px 12px;
  }
  
  .contDatos > div:last-child {
    font-size: 1.3rem;
  }
  
  .ctrlAfinador {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
  
  .ctrlAfinador span {
    font-size: 1rem;
  }
}

/* Animación de entrada */
.divAfinador {
  animation: fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
