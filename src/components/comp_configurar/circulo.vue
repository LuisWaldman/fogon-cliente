<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { NotaSonido } from '../../modelo/sonido/notaSonido'
import type { FrecuenciaDetectada } from '../../modelo/sonido/FrecuenciaDetectada'
const octavasCirculo = ref(6)
const DesdeOctavasCirculo = ref(4)

const props = defineProps<{
  notasSonido: NotaSonido[]
  clasenotasSonido: string[]
  frecuencia: number
  otrasNotas?: FrecuenciaDetectada[]
  tocarNota?: (nota: string) => void
  soltarNota?: (nota: string) => void
}>()
const esCelular = window.innerWidth < 768
const maxRadio = esCelular ? 300 : 500
const minRadio = esCelular ? 100 : 180
const centroLeft = esCelular ? 120 : 300
const centroTop = esCelular ? 130 : 230
const multiplicadorRadio = esCelular ? 1 : 1.8
const multiplicadorLargo = esCelular ? 1.3 : 1
const viendoFrecuencia = ref<NotaSonido>({ nota: '', frecuencia: 0, octava: 0 })
watch(
  () => props.frecuencia,
  (newFrecuencia) => {
    if (newFrecuencia > 0) {
      viendoFrecuencia.value.frecuencia = newFrecuencia
    }
  },
)

function StyleFrecuencia(frecuencia: NotaSonido) {
  let backgroundColor = 'white'
  let color = 'black'
  if (frecuencia.nota.includes('#')) {
    backgroundColor = 'black'
    color = 'white'
  }

  const calculoFrecuencia = frecuencia.frecuencia
  let enOctava =
    Math.floor(Math.log2(calculoFrecuencia / 440)) + DesdeOctavasCirculo.value

  const baseOctava =
    440 * Math.pow(2, Math.floor(Math.log2(calculoFrecuencia / 440)))
  const portentajeEnOctava = (calculoFrecuencia - baseOctava) / baseOctava
  let calcularDesde = portentajeEnOctava * 100 + 56.5
  if (calcularDesde > 100) {
    calcularDesde = calcularDesde - 100
  }
  calcularDesde = calcularDesde / 100

  if (enOctava < 0) {
    enOctava = 0
  }
  // Calcular el porcentaje de la octava
  const radio =
    minRadio +
    ((maxRadio - minRadio) / (octavasCirculo.value - 1)) * (enOctava - 1)
  const left =
    centroLeft +
    Math.cos(calcularDesde * 2 * Math.PI) * (radio / 2) * multiplicadorRadio
  const top =
    centroTop +
    Math.sin(calcularDesde * 2 * Math.PI) * (radio / 2) * multiplicadorLargo

  return {
    top: top + 'px',
    left: left + 'px',
    'background-color': backgroundColor,
    color: color,
  }
}

function TocarNota(nota: string) {
  if (props.tocarNota) {
    props.tocarNota(nota)
  }
}

function SoltarNota(nota: string) {
  if (props.soltarNota) {
    props.soltarNota(nota)
  }
}
</script>
<template>
  <div style="position: relative">
    <div class="circulodiv" style="display: flex; width: 800px">
      <div
        v-for="(nota, index) in notasSonido"
        :key="index"
        class="frecuencia nota"
        :class="clasenotasSonido[index]"
        :style="StyleFrecuencia(nota)"
      >
        <div
          @mousedown="TocarNota(nota.nota + nota.octava)"
          @mouseup="SoltarNota(nota.nota + nota.octava)"
          @touchstart="TocarNota(nota.nota + nota.octava)"
          @touchend="SoltarNota(nota.nota + nota.octava)"
          style="cursor: pointer"
        >
          {{ nota.nota }} - {{ nota.octava }}
        </div>
      </div>

      <div
        v-if="Number(viendoFrecuencia.frecuencia) > 0"
        :style="StyleFrecuencia(viendoFrecuencia)"
        class="frecuencia viendoFrecuencia"
      >
        &nbsp;
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
  padding: 5px;
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
  background-color: rgb(33, 151, 3) !important;
  border: 1px solid rgb(3, 151, 10);
  border-radius: 50%;
  width: 21px;
  height: 21px;
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
.invisible {
  opacity: 0.3;
}
@media (max-width: 768px) {
  .nota {
    font-size: 16px;
    padding: 0px;
  }
}
</style>
