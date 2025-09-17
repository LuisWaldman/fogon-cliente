<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { NotaSonido } from '../../modelo/sonido/notaSonido'
import type { FrecuenciaDetectada } from '../../modelo/sonido/FrecuenciaDetectada'
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi'
import { MidiPlayer } from '../../modelo/midi/MidiPlayer'
const octavasCirculo = ref(7)
const DesdeOctavasCirculo = ref(4)

const props = defineProps<{
  notasSonido: NotaSonido[]
  clasenotasSonido: string[]
  frecuencia: number
  otrasNotas?: FrecuenciaDetectada[]
}>()

const maxRadio = 500
const minRadio = 100
const centroLeft = 350
const centroTop = 230
const viendoFrecuencia = ref<NotaSonido>({ nota: '', frecuencia: 0, octava: 0 })
watch(
  () => props.frecuencia,
  (newFrecuencia) => {
    if (newFrecuencia > 0) {
      viendoFrecuencia.value.frecuencia = newFrecuencia
    }
  },
)

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
function StyleFrecuencia(frecuencia: NotaSonido) {
  let backgroundColor = 'white'
  let color = 'black'
  if (frecuencia.nota.includes('#')) {
    backgroundColor = 'black'
    color = 'white'
  }
  let enOctava =
    Math.floor(Math.log2(frecuencia.frecuencia / 440)) +
    DesdeOctavasCirculo.value

  const baseOctava =
    440 * Math.pow(2, Math.floor(Math.log2(frecuencia.frecuencia / 440)))
  const portentajeEnOctava = (frecuencia.frecuencia - baseOctava) / baseOctava

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

  return {
    top: top + 'px',
    left: left + 'px',
    'background-color': backgroundColor,
    color: color,
  }
}

function StyleFrecuenciaNotaAcorde(frecuencia: number) {
  let backgroundColor = 'gray'
  let color = 'black'
  let enOctava =
    Math.floor(Math.log2(frecuencia / 440)) + DesdeOctavasCirculo.value

  const baseOctava = 440 * Math.pow(2, Math.floor(Math.log2(frecuencia / 440)))
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

  return {
    top: top + 'px',
    left: left + 'px',
    'background-color': backgroundColor,
    color: color,
  }
}
const refInstrumentos = ref(InstrumentoMidi.GetInstrumentos())
const instrumento = ref('pad_1_new_age.json')

const midiCargado = ref(false)
const CargandoMidi = ref(false)
let midiPlayer = new MidiPlayer()
function iniciar() {
  console.log('Cargar')
  midiPlayer = new MidiPlayer()
  fetch('InstrumentosMIDI/' + instrumento.value)
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

function ActualizarInstrumento() {
  midiCargado.value = false
  CargandoMidi.value = true
  iniciar()
  console.log(instrumento.value)
}

function TocarNota(nota: string) {
  if (!midiCargado.value) {
    return
  }
  midiPlayer.tocarNota(nota)
}

function SoltarNota(nota: string) {
  if (!midiCargado.value) {
    return
  }
  midiPlayer.soltarNota(nota)
}
</script>
<template>
  <div style="position: relative">
    <select
      v-if="midiCargado"
      v-model="instrumento"
      @change="ActualizarInstrumento"
    >
      <option
        v-for="(inst, index) in refInstrumentos"
        :key="index"
        :value="inst.archivo"
      >
        {{ inst.nombre }}
      </option>
    </select>

    <span @click="iniciar" v-if="!midiCargado && !CargandoMidi">[Tocar]</span>
    <span v-if="CargandoMidi">Cargando instrumento...</span>

    <div class="circulodiv" style="display: flex; width: 800px">
      <div v-for="i in octavasCirculo" :key="i">
        <div :style="StyleOctava(i)" class="circuloOctava"></div>
      </div>

      <div
        v-for="(nota, index) in notasSonido"
        :key="index"
        class="frecuencia"
        :class="clasenotasSonido[index]"
        :style="StyleFrecuencia(nota)"
      >
        <div
          @mousedown="TocarNota(nota.nota + nota.octava)"
          @mouseup="SoltarNota(nota.nota + nota.octava)"
          style="cursor: pointer"
        >
          {{ nota.nota }}
        </div>
      </div>

      <div
        v-if="Number(viendoFrecuencia.frecuencia) > 0"
        :style="StyleFrecuencia(viendoFrecuencia)"
        class="frecuencia viendoFrecuencia"
      >
        {{ viendoFrecuencia.frecuencia.toFixed(0) }}
      </div>

      <div v-if="otrasNotas">
        <div
          v-for="(value, index) in otrasNotas"
          :key="index"
          :style="StyleFrecuenciaNotaAcorde(value.frecuencia)"
          class="frecuencia viendoFrecuencia"
        >
          <span>
            {{ value.frecuencia.toFixed(0) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.circuloOctava {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgb(133, 104, 202);
}

.frecuencia {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgb(133, 104, 202);
}
.frecuenciablanca {
  background-color: white;
  color: black;
}

.frecuencianegra {
  background-color: black;
  color: white;
  font-weight: bold;
}

.viendoFrecuencia {
  z-index: 10;
  font-weight: bold;
  color: red;
  background-color: white;
  border: 1px solid red;
  border-radius: 15px;
}

.clsEscala {
  font-weight: bold;
  color: rgb(248, 245, 245);
  border: 4px solid rgb(0, 140, 255);
  border-radius: 15px;
  z-index: 5;
}
.clsAcorde {
  z-index: 8;
  font-weight: bold;
  font-size: larger;
  color: rgb(248, 245, 245);
  border: 5px solid rgb(231, 64, 13);
  border-radius: 15px;
}
</style>
