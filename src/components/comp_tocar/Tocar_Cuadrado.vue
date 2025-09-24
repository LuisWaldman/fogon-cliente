<script setup lang="ts">
import { ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { MidiPlayer } from '../../modelo/midi/MidiPlayer'
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'
import { InstrumentosRitmos } from './instrumentosritmos'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import { useAppStore } from '../../stores/appStore'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const helper = HelperDisplayAcordesLatino.getInstance()
const appStore = useAppStore()
helper.latino = appStore.perfil.CifradoLatino
const musicaHelper = new MusicaHelper()
const acordes = ref<string[]>(props.cancion.acordes.GetTodosLosAcordes())
const acordeActual = ref<string>(acordes.value[props.compas])
const notas = ref<string[]>(musicaHelper.GetNotas())
const notasescala = ref<string[]>(
  musicaHelper.GetNotasdeescala(props.cancion.escala),
)
const notasacorde = ref<string[]>(
  musicaHelper
    .GetNotasdeacorde(acordeActual.value, 0)
    .map((n) => n.slice(0, -1)),
)
const muestranotas = ref<string[]>([])
const desdeIndex = ref<number>(3)
const desdeOctava = ref<number>(2)
const hastaOctava = ref<number>(4)
const muestraNota = ref<string>('acorde')
const desdeNota = ref<string>('acorde')
const refInstrumentosRitmos = ref<InstrumentosRitmos[]>([])
refInstrumentosRitmos.value.push(
  new InstrumentosRitmos('BOMBO', 'C1', 40, 20, 15, 70, true),
)
refInstrumentosRitmos.value.push(
  new InstrumentosRitmos('CAJA', 'E4', 40, 20, 45, 70, false),
)
refInstrumentosRitmos.value.push(
  new InstrumentosRitmos('PLATILLO CERR', 'C#3', 10, 40, 15, 40, true),
)
refInstrumentosRitmos.value.push(
  new InstrumentosRitmos('PLATILLO', 'D#3', 10, 40, 15, 30, true),
)
refInstrumentosRitmos.value.push(
  new InstrumentosRitmos('MATRACA', 'A#3', 10, 10, 40, 10, true, '26px'),
)
refInstrumentosRitmos.value.push(
  new InstrumentosRitmos('TRIANGULO', 'G#4', 10, 10, 55, 10, true),
)
refInstrumentosRitmos.value.push(
  new InstrumentosRitmos('Silbato', 'C5', 10, 10, 70, 10, true),
)
refInstrumentosRitmos.value.push(
  new InstrumentosRitmos('Crash', 'F6', 10, 10, 85, 10, true),
)

function calcularNotas() {
  let toMost: string[] = notas.value
  if (muestraNota.value == 'escala') {
    toMost = notasescala.value
  }
  if (muestraNota.value == 'acorde') {
    toMost = notasacorde.value
  }
  desdeIndex.value = 0
  if (desdeNota.value == 'acorde') {
    const indexAcorde = toMost.indexOf(notasacorde.value[0])
    if (indexAcorde >= 0) {
      desdeIndex.value = indexAcorde
    }
  }
  if (desdeNota.value == 'escala') {
    const indexEscala = toMost.indexOf(notasescala.value[0])
    if (indexEscala >= 0) {
      desdeIndex.value = indexEscala
    }
  }
  let toMost2 = toMost.slice(desdeIndex.value, toMost.length)
  toMost2 = toMost2.concat(toMost.slice(0, desdeIndex.value))
  muestranotas.value = toMost2
}
calcularNotas()

const muestraoctavas = ref<string[]>(['2', '3', '4', '5', '6'])
const tocandoNotas = ref<string[]>([])
watch(
  () => props.compas,
  (newCompas) => {
    const toEr = tocandoNotas.value.map((n) => n)
    toEr.map((n) => SoltarNota(n))

    acordeActual.value = acordes.value[newCompas]
    notasacorde.value = musicaHelper
      .GetNotasdeacorde(acordeActual.value, 0)
      .map((n) => n.slice(0, -1))
    calcularNotas()
  },
)

const refInstrumentos = ref(InstrumentoMidi.GetInstrumentos())
const instrumento = ref('piano.json')
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
      CargandoMidi.value = false
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
iniciar()

function TocarNota(nota: string) {
  if (!midiCargado.value) {
    return
  }
  if (!tocandoNotas.value.includes(nota)) {
    tocandoNotas.value.push(nota)
  }
  midiPlayer.tocarNota(nota)
}

function SoltarNota(nota: string) {
  if (!midiCargado.value) {
    return
  }
  const index = tocandoNotas.value.indexOf(nota)
  if (index > -1) {
    tocandoNotas.value.splice(index, 1)
  }
  midiPlayer.soltarNota(nota)
}

function styleInstrumentoRitmo(instrumento: InstrumentosRitmos) {
  return {
    top: instrumento.top + '%',
    left: instrumento.left + '%',
    width: instrumento.ancho + '%',
    height: instrumento.alto + '%',
    borderRadius: instrumento.circulo ? '50%' : '0%',
    fontSize: instrumento.size,
  }
}
</script>
<template>
  <div style="display: flex">
    <div>
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
      Mostrando
      <select v-model="muestraNota" @change="calcularNotas">
        <option value="">Todas</option>
        <option value="escala">Escala</option>
        <option value="acorde">Acorde</option>
        <option value="ritmo">Ritmo</option>
      </select>
      Desde
      <select v-model="desdeNota" @change="calcularNotas">
        <option value="acorde">Acorde</option>
        <option value="escala">Escala</option>
        <option value="">C</option>
      </select>
    </div>
    <span v-if="CargandoMidi">Cargando instrumento...</span>
  </div>
  <table v-if="muestraNota != 'ritmo'" class="tabla-cuadrado noselect">
    <thead>
      <tr>
        <th style="width: 120px">
          <input type="number" min="1" max="7" v-model.number="desdeOctava" />-
          <input type="number" min="2" max="8" v-model.number="hastaOctava" />
        </th>
        <th v-for="nota in muestranotas" :key="nota">
          {{ helper.GetAcorde(nota) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="octava in muestraoctavas.filter(
          (o) => Number(o) >= desdeOctava && Number(o) <= hastaOctava,
        )"
        :key="octava"
      >
        <td>{{ octava }}</td>
        <td
          v-for="nota in muestranotas"
          :key="nota"
          @mousedown="TocarNota(nota + octava)"
          @mouseup="SoltarNota(nota + octava)"
          @touchstart="TocarNota(nota + octava)"
          @touchend="SoltarNota(nota + octava)"
          :class="{
            'tocando-nota': tocandoNotas.includes(nota + octava),
            notaEscala: notasescala.includes(nota),
            primeraAcorde: notasacorde.includes(nota) && notasacorde[0] == nota,
            notaAcorde: notasacorde.includes(nota),
          }"
        >
          <div style="text-align: center">
            {{ helper.GetAcorde(nota) + octava }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="muestraNota === 'ritmo'" class="ritmo-cuadrado noselect">
    <div
      v-for="(instrumento, index) in refInstrumentosRitmos"
      :key="index"
      @mousedown="TocarNota(instrumento.nota)"
      @mouseup="SoltarNota(instrumento.nota)"
      @touchstart="TocarNota(instrumento.nota)"
      @touchend="SoltarNota(instrumento.nota)"
      :class="{ 'tocando-nota': tocandoNotas.includes(instrumento.nota) }"
      class="instrumento"
      :style="styleInstrumentoRitmo(instrumento)"
    >
      {{ instrumento.texto }}
    </div>
  </div>
</template>

<style scoped>
.instrumento {
  position: absolute;
  border: 1px solid #ccc;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ritmo-cuadrado {
  width: 100%;
  height: 99%;
  position: relative;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: xx-large;
  font-weight: bold;
  color: #555;
}
.tabla-cuadrado {
  width: 100%;
  height: 80%;
  border: 1px solid #ccc;
}

.tabla-cuadrado td,
th {
  border: 1px solid #ccc;
}

.notaEscala {
  background-color: #d2d3d3;
  font-size: x-large;
}
.notaAcorde {
  background-color: #ada641;
  font-weight: bold;
  font-size: x-large;
}
.primeraAcorde {
  background-color: #b32f2f !important;
  font-weight: bold;
  font-size: x-large;
}

.tocando-nota {
  background-color: #ffcc00 !important;
  font-size: x-large;
}
.noselect {
  user-select: none;
  -webkit-user-select: none; /* Safari/Chrome */
  -ms-user-select: none; /* IE/Edge */
}
</style>
