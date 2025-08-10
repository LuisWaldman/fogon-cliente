<script setup lang="ts">
import { ref } from 'vue';
import { Pantalla } from '../../modelo/pantalla';

const pantalla = new Pantalla()
const ancho = pantalla.getAnchoPantalla() * 0.7
const alto = pantalla.getAltoPantalla()
const tipoAfinacion = ref(440) // 440 Hz por defecto
const cantidadNotas = ref(12) // Cantidad de notas en la afinación
const Notas = ref<number[]>([]) // Cantidad de notas en la afinación
const ClaseNotas = ref<string[]>([])
const NotasAnteriores = ref<number[]>([]) // Cantidad de notas en la afinación
const ClaseNotasAnteriores = ref<string[]>([])
const octavasCirculo = ref(8)
const DesdeOctavasCirculo = ref(3)
const refViendoFrecuencia = ref(440)
function clickVerFrecuencia(frecuencia: number) {
  refViendoFrecuencia.value = frecuencia
}
function calcularNotas() {
  Notas.value = []
  NotasAnteriores.value = []
  const desdeNota = tipoAfinacion.value / 4
// cantidadNotas es la cantidad de notas en la octava
  for (let i = 0; i < cantidadNotas.value * 2; i++) {
    const nota = desdeNota * Math.pow(2, i / cantidadNotas.value)
    NotasAnteriores.value.push(nota)
  }
  for (let i = 1; i < cantidadNotas.value * 3; i++) {
    const nota = tipoAfinacion.value * Math.pow(2, i / cantidadNotas.value)
    Notas.value.push(nota)
  }
  }

calcularNotas()

function styleDivAfinador() {
  return {
    height: alto + 'px',
    width: ancho + 'px',
  }
}

  const maxRadio = 500
  const minRadio = 50
  const centroLeft = 300
  const centroTop = 230
function StyleOctava(i: number) {
  const radio = minRadio + ((maxRadio - minRadio) / (octavasCirculo.value - 1)) * (i - 1)
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
  let enOctava = Math.floor(Math.log2(frecuencia / tipoAfinacion.value)) + DesdeOctavasCirculo.value
  const baseOctava = tipoAfinacion.value * Math.pow(2, Math.floor(Math.log2(frecuencia / tipoAfinacion.value)))
  const portentajeEnOctava = (frecuencia - baseOctava) / baseOctava 

  if (enOctava < 0) {
    enOctava = 0
  }
  // Calcular el porcentaje de la octava
  const radio = minRadio + ((maxRadio - minRadio) / (octavasCirculo.value - 1)) * (enOctava - 1)
  const left = centroLeft + Math.cos(portentajeEnOctava * 2 * Math.PI) * (radio / 2)
  const top = centroTop + Math.sin(portentajeEnOctava * 2 * Math.PI) * (radio / 2)
  console.log('enOctava', enOctava,baseOctava, "Porcentaje=",portentajeEnOctava, frecuencia, tipoAfinacion.value)
  return {
    top: top + 'px',
    left: left + 'px',
  }
}

function StyleFrecuenciaLinea(frecuencia: number) {
  let fontSize = 10
  let backgroundColor = ''
  let border = ''
  let color = 'white'
  
  // Calcular en qué octava está la frecuencia relativa a tipoAfinacion
  const octavasDesdeBase = Math.log2(frecuencia / tipoAfinacion.value)
  const octavaCompleta = Math.floor(octavasDesdeBase)
  const baseOctava = tipoAfinacion.value * Math.pow(2, octavaCompleta)
  const portentajeEnOctava = (frecuencia - baseOctava) / baseOctava

  // Determine styling based on the remainder
  if (Math.abs(portentajeEnOctava - 0) < 0.01 || Math.abs(portentajeEnOctava - 1) < 0.01) {
    fontSize = 24
    color = 'red'
    border = '1px solid black'
  } else if (Math.abs(portentajeEnOctava - 0.5) < 0.02) {
    fontSize = 22
    border = '1px solid rgb(102, 64, 64);'
  } else if (Math.abs(portentajeEnOctava - (1/3)) < 0.02) {
    fontSize = 19
    border = '1px solid rgb(102, 64, 64);'
  } else if (Math.abs(portentajeEnOctava - (2/3)) < 0.02) {
    fontSize = 19
    border = '1px solid rgb(102, 64, 64);'
  }
  return {
    'font-size': fontSize + 'px',
    'background-color': backgroundColor,
    color: color,
    border: border,
    'padding-top': '-12px',
  }
}


</script>

<template>
  <div :style="styleDivAfinador()" class="divAfinador">
      
    <div style="display: flex;">
                <div v-for="(nota, index) in NotasAnteriores" @click="clickVerFrecuencia(nota)" :key="index" :style="StyleFrecuenciaLinea(nota)" :class="ClaseNotasAnteriores[index]" class="clsNota">
          {{ nota.toFixed(0) }} 
        </div>
        <input type="number" v-model="tipoAfinacion" min="1" max="999" @focus="clickVerFrecuencia(tipoAfinacion)" @change="calcularNotas" />
        <div v-for="(nota, index) in Notas" @click="clickVerFrecuencia(nota)" :key="index" :class="ClaseNotas[index]" :style="StyleFrecuenciaLinea(nota)"  class="clsNota">
          {{ nota.toFixed(0) }} 
        </div>
      </div>
<div style="display: flex;">
  <div style="position: relative;"><div class="circulodiv" style="display: flex; width: 800px;">



        
        <div v-for="i in octavasCirculo" :key="i" ><div :style="StyleOctava(i)" class="circuloOctava"></div></div>


        <div :style="StyleFrecuencia(Number(refViendoFrecuencia.toFixed(0)))" class="frecuencia viendoFrecuencia">
          {{ refViendoFrecuencia.toFixed(0) }}
        </div>
        <div v-for="k in 3" :key="k" :style="StyleFrecuencia(tipoAfinacion * Math.pow(2, (k-1) * 2))" class="frecuencia">
         {{ (tipoAfinacion * Math.pow(2, (k-1) * 2)).toFixed(0) }}
        </div>
        
        <div  v-for="k in 3" :key="k" :style="StyleFrecuencia(440 * Math.pow(2, (k-1) * 2))" class="frecuencia">
          {{ (440 * Math.pow(2, (k-1) * 2)).toFixed(0) }}
        </div>
        
      
      
      </div></div>
  <div>
<div>
    Viendo: {{ refViendoFrecuencia.toFixed(0) }} Hz</div>
    <div>
    Total de Notas: <input type="number" v-model="cantidadNotas" min="1" max="24" @change="calcularNotas" />
    </div>
  </div>
</div>
      

  </div>
</template>

<style scoped>
.circulodiv {
  position: relative;
}
.circuloOctava {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgb(133, 104, 202);
}
.viendoFrecuencia {
  background-color:  rgb(133, 104, 202);
  color: white;
  padding: 2px;
  border: 1px solid black;
}
.frecuencia {
  position: absolute;
  
}
.divAfinador {
  
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
