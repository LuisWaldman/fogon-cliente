<script setup lang="ts">
import { ref } from 'vue'
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
const micHelper = new MicHelper()
const musicaHelper = new MusicaHelper()
const refMicEstado = ref('')
const notasAfinar = ref([] as NotaAfinar[])
notasAfinar.value.push(new NotaAfinar('Sexta Cuerda', 'E2', 82.41))
notasAfinar.value.push(new NotaAfinar('Quinta Cuerda', 'A2', 110.0))
notasAfinar.value.push(new NotaAfinar('Cuarta Cuerda', 'D3', 146.83))
notasAfinar.value.push(new NotaAfinar('Tercera Cuerda', 'G3', 196.0))
notasAfinar.value.push(new NotaAfinar('Segunda Cuerda', 'B3', 246.94))
notasAfinar.value.push(new NotaAfinar('Primera Cuerda', 'E4', 329.63))

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
const clsNotas = ref<string[]>([])
const notasSonido = ref<NotaSonido[]>([])
const EscuchandoAcorde = ref<string>('')

const mostrarEscala = ref(false)
const escalaMenor = ref(false)
const refViendoEscala = ref(0)
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

function calcularEscala() {
  for (var i = 0; i < notasSonido.value.length; i++) {
    clsNotas.value[i] = ''
  }
  if (!mostrarEscala.value) {
    return
  }
  const modo = escalaMenor.value ? 'menor' : 'mayor'
  let notaCont: number = refViendoEscala.value
  for (let i = 0; notaCont < notasSonido.value.length; i++) {
    console.log(`Calculando nota ${i} en modo ${modo} con notaCont ${notaCont}`)
    clsNotas.value[notaCont] = 'clsEscala'
    notaCont += modos[modo][i % modos[modo].length]
  }
}

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
  EscuchandoAcorde.value =
    musicaHelper.GetAcordeDeNotas(
      notasSonido.value[mostrandoNota.value].nota +
        notasSonido.value[mostrandoNota.value].octava,
      otrasNotas.value,
    ).nombre || ''

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
    console.error('Error al obtener el estado del micrófono:', error)
    useAppStore().errores.push(
      new Error(`Error al obtener el estado del micrófono: ${error}`),
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
      console.error('Error al solicitar permiso del micrófono:', error)
      useAppStore().errores.push(
        new Error(`Error al solicitar permiso del micrófono: ${error}`),
      )
      refMicEstado.value = 'Error'
    })
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
import { FrecuenciaDetectada } from '../../modelo/sonido/FrecuenciaDetectada'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'
import { useAppStore } from '../../stores/appStore'

onMounted(() => {
  Solicitar()
  CalcularNotas()
})

onUnmounted(() => {
  micHelper.detectar = false
  DejarEscuchar()
})

const mostrandoNota = ref<number>(0)

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
</script>

<template>
  <div :style="styleDivAfinador()" class="divAfinador" id="divAfinador">
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
      <div style="display: flex">
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

      <div
        v-for="(nota, index) in mostrandoNotas"
        :key="index"
        style="display: flex; height: 80px; border: 1px solid;|"
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
    <div style="display: flex" v-if="viendoAfindado === 'circulo'">
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
        :mostrandoNota="mostrandoNota"
        :notasSonido="notasSonido"
        :frecuencia="frequency"
        :ancho="ancho"
      ></frecuen>
    </div>
    <div style="display: flex" v-if="viendoAfindado === 'circulo'">
      <div>
        <div>
          <input
            type="checkbox"
            v-model="mostrarEscala"
            @change="calcularEscala"
          />
          <span>Mostrar Escala</span>
          <select
            v-model="refViendoEscala"
            v-if="mostrarEscala"
            @change="calcularEscala"
          >
            <option v-for="(nota, index) in notas" :key="index" :value="index">
              {{ nota }}
            </option>
          </select>
        </div>
      </div>
      <circulo
        :notasSonido="notasSonido"
        :clasenotasSonido="clsNotas"
        :otrasNotas="otrasFrecuencias"
        :frecuencia="frequency"
      ></circulo>
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
.divAfinador {
  position: relative;
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
