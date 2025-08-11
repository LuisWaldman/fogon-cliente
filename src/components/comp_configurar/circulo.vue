<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
const octavasCirculo = ref(7)
const DesdeOctavasCirculo = ref(4)

const props = defineProps<{
  frecuencia: number
  tipoAfinacion: number
  cantidadNotas: number
  ancho: number
}>()
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
  console.log(
    'enOctava',
    enOctava,
    baseOctava,
    'Porcentaje=',
    portentajeEnOctava,
    frecuencia,
    props.tipoAfinacion,
  )
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
          :v-if="props.frecuencia > 0"
            :style="StyleFrecuencia(Number(frecuencia.toFixed(0)))"
            class="frecuencia viendoFrecuencia"
          >
            {{ frecuencia.toFixed(0) }}
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
}
</style>