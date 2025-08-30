<script lang="ts" setup>
import { watch } from 'vue'
import type { NotaSonido } from '../../modelo/sonido/notaSonido'

const emit = defineEmits(['verfrecuencia'])

const props = defineProps<{
  notasSonido: NotaSonido[]
  frecuencia: number
  ancho: number
  mostrandoNota: number
}>()
// Watch for changes in tipoAfinacion and cantidadNotas to recalculate notes

watch(
  () => props.frecuencia,
  (newFrecuencia) => {
    if (newFrecuencia > 0) {
      const contenedor = document.getElementById('contenedorFrecuenciometro')
      if (contenedor) {
        let scroll = props.mostrandoNota * 50 - 300
        if (scroll < 0) scroll = 0
        contenedor.scrollLeft = scroll // Ajusta el desplazamiento horizontal
      }
    }
  },
)

function clickVerFrecuencia(frecuencia: NotaSonido) {
  emit('verfrecuencia', frecuencia)
}

function StyleNotaLinea(frecuencia: NotaSonido) {
  let fontSize = 18
  let backgroundColor = 'white'
  let color = 'black'
  if (frecuencia.nota.includes('#')) {
    backgroundColor = 'black'
    color = 'white'
  }

  const ancho = 50
  return {
    'font-size': fontSize + 'px',
    'background-color': backgroundColor,
    color: color,
    width: ancho + 'px',
    'min-width': ancho + 'px',
    'max-width': ancho + 'px',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
    'padding-top': '-12px',
  }
}
</script>
<template>
  <div class="clsFrecuencia" id="contenedorFrecuenciometro">
    <div
      v-for="(nota, index) in notasSonido"
      @click="clickVerFrecuencia(nota)"
      :key="index"
      :style="StyleNotaLinea(nota)"
      :class="{
        notaMostrada: props.mostrandoNota === index,
        clsNota: true,
      }"
    >
      <div>{{ nota.frecuencia.toFixed(0) }}</div>
      <div>{{ nota.nota }}</div>
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
  border: 5px solid rgb(190, 46, 46);
}
</style>
