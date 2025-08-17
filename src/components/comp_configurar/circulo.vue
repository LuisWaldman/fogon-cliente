<script lang="ts" setup>
import { ref, watch } from 'vue'
const octavasCirculo = ref(7)
const DesdeOctavasCirculo = ref(4)

const props = defineProps<{
  frecuencia: number
  tipoAfinacion: number
  cantidadNotas: number
  ancho: number
  mostrarEscala: number[]
  mostrarAcorde: number[]
}>()

// Watch for changes in tipoAfinacion and cantidadNotas to recalculate notes
watch([() => props.tipoAfinacion, () => props.cantidadNotas], () => {
  calcularNotas()
})
const maxRadio = 500
const minRadio = 100
const centroLeft = 300
const centroTop = 230
const FrecuenciaNotas = ref<number[]>([]) // Cantidad de notas en la afinación
const NombreNotas = ref<string[]>([])

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
function calcularNotas() {
  FrecuenciaNotas.value = []
  NombreNotas.value = []
  const desdeNota = props.tipoAfinacion / 7
  // cantidadNotas es la cantidad de notas en la octava
  const desdeEscala = 1
  for (let i = 0; i < props.cantidadNotas * 7; i++) {
    const nota = desdeNota * Math.pow(2, i / props.cantidadNotas)
    FrecuenciaNotas.value.push(nota)
    NombreNotas.value.push(
      notas[i % notas.length] + Math.floor(i / notas.length + desdeEscala),
    )
  }
}
calcularNotas()

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
    Math.floor(Math.log2(frecuencia / props.tipoAfinacion)) +
    DesdeOctavasCirculo.value
  const baseOctava =
    props.tipoAfinacion *
    Math.pow(2, Math.floor(Math.log2(frecuencia / props.tipoAfinacion)))
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
  }
}
</script>
<template>
  <div style="position: relative">
    <div class="circulodiv" style="display: flex; width: 800px">
      <div v-for="i in octavasCirculo" :key="i">
        <div :style="StyleOctava(i)" class="circuloOctava"></div>
      </div>

      <div
        v-for="(nombre, index) in NombreNotas"
        :key="index"
        class="frecuencia"
        :style="StyleFrecuencia(Number(FrecuenciaNotas[index]))"
      >
        <div class="clsAcorde" v-if="mostrarAcorde.includes(index % 12)">
          {{ nombre }}
        </div>
      </div>
      <div
        v-for="(nombre, index) in NombreNotas"
        :key="index"
        class="frecuencia"
        :style="StyleFrecuencia(Number(FrecuenciaNotas[index]))"
      >
        <div class="clsEscala" v-if="mostrarEscala.includes(index % 12)">
          {{ nombre }}
        </div>
      </div>

      <div
        v-if="Number(frecuencia) > 0"
        :style="StyleFrecuencia(Number(frecuencia.toFixed(0)))"
        class="frecuencia viendoFrecuencia"
      >
        {{ frecuencia.toFixed(0) }}
      </div>

      <div
        v-for="(nombre, index) in NombreNotas"
        :key="index"
        class="frecuencia"
        :class="{
          frecuencianegra: nombre.includes('#'),
          frecuenciablanca: !nombre.includes('#'),
        }"
        :style="StyleFrecuencia(Number(FrecuenciaNotas[index]))"
      >
        {{ nombre }}
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
