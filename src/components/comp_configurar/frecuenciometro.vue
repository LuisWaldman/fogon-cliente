<script lang="ts" setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['verfrecuencia'])
const FrecuenciaNotas = ref<number[]>([]) // Cantidad de notas en la afinación
const NombreNotas = ref<string[]>([])
const mostrandoNota = ref<number>(0)

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

const props = defineProps<{
  frecuencia: number
  tipoAfinacion: number
  cantidadNotas: number
  ancho: number
}>()
// Watch for changes in tipoAfinacion and cantidadNotas to recalculate notes
watch([() => props.tipoAfinacion, () => props.cantidadNotas], () => {
  calcularNotas()
})
watch(
  () => props.frecuencia,
  (newFrecuencia) => {
    if (newFrecuencia > 0) {
      const index = CorrespondeNota(newFrecuencia)
      mostrandoNota.value = FrecuenciaNotas.value[index]

      const contenedor = document.getElementById('contenedorFrecuenciometro')
      if (contenedor) {
        let scroll = index * 50 - 300
        if (scroll < 0) scroll = 0
        contenedor.scrollLeft = scroll // Ajusta el desplazamiento horizontal
      }
    }
  },
)

function clickVerFrecuencia(frecuencia: number) {
  emit('verfrecuencia', frecuencia)
}

function calcularNotas() {
  FrecuenciaNotas.value = []
  NombreNotas.value = []
  const desdeNota = props.tipoAfinacion / 8
  // cantidadNotas es la cantidad de notas en la octava
  const desdeEscala = 1
  for (let i = 0; i < props.cantidadNotas * 8; i++) {
    const nota = desdeNota * Math.pow(2, i / props.cantidadNotas)
    FrecuenciaNotas.value.push(nota)
    NombreNotas.value.push(
      notas[i % notas.length] + Math.floor(i / notas.length + desdeEscala),
    )
  }
}
calcularNotas()

mostrandoNota.value = FrecuenciaNotas.value[CorrespondeNota(props.frecuencia)]
function StyleFrecuenciaLinea(frecuencia: number) {
  let fontSize = 18
  let backgroundColor = ''
  let border = '1px solid'
  let color = 'white'

  // Calcular en qué octava está la frecuencia relativa a tipoAfinacion
  const octavasDesdeBase = Math.log2(frecuencia / props.tipoAfinacion)
  const octavaCompleta = Math.floor(octavasDesdeBase)
  const baseOctava = props.tipoAfinacion * Math.pow(2, octavaCompleta)
  const portentajeEnOctava = (frecuencia - baseOctava) / baseOctava

  // Determine styling based on the remainder
  if (
    Math.abs(portentajeEnOctava - 0) < 0.01 ||
    Math.abs(portentajeEnOctava - 1) < 0.01
  ) {
    color = 'red'
    border = '1px solid;'
  } else if (Math.abs(portentajeEnOctava - 0.5) < 0.02) {
    border = '1px solid;'
  } else if (Math.abs(portentajeEnOctava - 1 / 3) < 0.02) {
    border = '1px solid;'
  } else if (Math.abs(portentajeEnOctava - 2 / 3) < 0.02) {
    border = '1px solid;'
  }
  const ancho = 50
  return {
    'font-size': fontSize + 'px',
    'background-color': backgroundColor,
    color: color,
    border: border,
    width: ancho + 'px',
    'min-width': ancho + 'px',
    'max-width': ancho + 'px',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
    'padding-top': '-12px',
  }
}

function CorrespondeNota(frecuencia: number): number {
  for (let i = 0; i < FrecuenciaNotas.value.length; i++) {
    if (frecuencia < FrecuenciaNotas.value[i]) {
      if (i == 0) {
        return i
      }
      if (
        Math.abs(frecuencia - FrecuenciaNotas.value[i - 1]) <
        Math.abs(frecuencia - FrecuenciaNotas.value[i])
      ) {
        return i - 1
      }
      return i
    }
  }
  return 0
}
</script>
<template>
  <div
    
    class="clsFrecuencia"
    id="contenedorFrecuenciometro"
  >
    <div
      v-for="(nota, index) in FrecuenciaNotas"
      @click="clickVerFrecuencia(nota)"
      :key="index"
      :class="[mostrandoNota === nota ? 'notaMostrada' : '']"
      :style="StyleFrecuenciaLinea(nota)"
    >
      <div>{{ nota.toFixed(0) }}</div>
      <div>{{ NombreNotas[index] }}</div>
    </div>
  </div>
</template>
<style scoped>
.clsFrecuencia {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
  scrollbar-gutter: stable;
  align-items: flex-start;
  padding-bottom: 10px; /* Add padding at bottom for the scrollbar */
  margin-bottom: 5px;
  /* Force scrollbar to bottom */
  scrollbar-position: bottom;
  overflow: -moz-scrollbars-horizontal;
  -ms-overflow-style: -ms-autohiding-scrollbar;
}

/* For Webkit browsers (Chrome, Safari) */
.clsFrecuencia::-webkit-scrollbar {
  height: 8px;
  position: absolute;
  bottom: 0;
}

.clsFrecuencia::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.clsFrecuencia::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.clsNota {
}
.notaMostrada {
  background-color: rgba(255, 255, 0, 0.5);
  border: 1px solid black;
}
</style>
