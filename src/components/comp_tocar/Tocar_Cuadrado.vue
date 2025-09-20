<script setup lang="ts">
import { ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { MidiPlayer } from '../../modelo/midi/MidiPlayer'
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

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
const soloEscala = ref<boolean>(false)
const soloAcorde = ref<boolean>(false)
const desdeIndex = ref<number>(3)
const desdeAcorde = ref<boolean>(false)
const desdeEscala = ref<boolean>(true)
function calcularNotas() {
  let toMost: string[] = notas.value
  if (soloEscala.value) {
    toMost = notasescala.value
  }
  if (soloAcorde.value) {
    toMost = notasacorde.value
  }
  desdeIndex.value = 0
  if (desdeAcorde.value) {
    const indexAcorde = toMost.indexOf(notasacorde.value[0])
    if (indexAcorde >= 0) {
      desdeIndex.value = indexAcorde
    }
  }
  if (desdeEscala.value) {
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
</script>
<template>
  <div style="display: flex;">
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
          </div>
          <div style="display: flex">
            <input
              type="checkbox"
              v-model="desdeEscala"
              @change="calcularNotas"
            />
            Desde Escala
            <input
              type="checkbox"
              v-model="desdeAcorde"
              @change="calcularNotas"
            />
            Desde acorde
            <input
              type="checkbox"
              v-model="soloEscala"
              @change="calcularNotas"
            />
            Solo escala
            <input
              type="checkbox"
              v-model="soloAcorde"
              @change="calcularNotas"
              style="margin-left: 10px"
            />
            Solo acorde
          </div>
          <span v-if="CargandoMidi">Cargando instrumento...</span>
  </div>
  <table class="tabla-cuadrado">
    <thead>
      <tr>
        <th>

        </th>
        <th v-for="nota in muestranotas" :key="nota">{{ nota }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="octava in muestraoctavas" :key="octava">
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
          <div style="text-align: center">{{ nota + octava }}</div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.tabla-cuadrado {
  width: 100%;
  height: 100%;
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
</style>
