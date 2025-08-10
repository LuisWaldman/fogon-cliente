<script setup lang="ts">
import { ref } from 'vue';
import { Pantalla } from '../../modelo/pantalla';

const pantalla = new Pantalla()
const ancho = pantalla.getAnchoPantalla() * 0.7
const alto = pantalla.getAltoPantalla()
const tipoAfinacion = ref(440) // 440 Hz por defecto
const cantidadNotas = ref(12) // Cantidad de notas en la afinación
const muestraNotas = ref(14) // Cantidad de notas en la afinación
const muestraNotasAnteriores = ref(5) // Cantidad de notas en la afinación
const Notas = ref<number[]>([]) // Cantidad de notas en la afinación
const ClaseNotas = ref<string[]>([])
const NotasAnteriores = ref<number[]>([]) // Cantidad de notas en la afinación
const ClaseNotasAnteriores = ref<string[]>([])

function calcularNotas() {
  Notas.value = []
  ClaseNotas.value = []
  NotasAnteriores.value = []
  ClaseNotasAnteriores.value = []
  
  // Calcular notas anteriores (frecuencias menores)
  for (let i = 1; i < muestraNotasAnteriores.value; i++) {
    const afina = tipoAfinacion.value * Math.pow(2, -i / cantidadNotas.value)
    NotasAnteriores.value.unshift(afina) // unshift para mantener el orden ascendente
    const ratio = tipoAfinacion.value / afina
    
    // Verificar si es octava (múltiplos de 2)
    if (Math.abs(ratio - Math.round(ratio)) < 0.001 && Math.round(ratio) > 1) {
      ClaseNotasAnteriores.value.unshift('octava')
    } 
    // Verificar si es quinta (séptimo semitono en 12-TET)
    else if (i % cantidadNotas.value === 7) {
      ClaseNotasAnteriores.value.unshift('quinta')
    } 
    else {
      ClaseNotasAnteriores.value.unshift(`Nota -${i}`)
    }
  }
  
  // Calcular notas posteriores (frecuencias mayores) - código existente
  for (let i = 1; i < muestraNotas.value; i++) {
    const afina = tipoAfinacion.value * Math.pow(2, i / cantidadNotas.value)
    Notas.value.push(afina)
    const ratio = afina / tipoAfinacion.value
    
    // Verificar si es octava (múltiplos de 2)
    if (Math.abs(ratio - Math.round(ratio)) < 0.001 && Math.round(ratio) > 1) {
      ClaseNotas.value.push('octava')
    } 
    // Verificar si es quinta (séptimo semitono en 12-TET)
    else if (i % cantidadNotas.value === 7) {
      ClaseNotas.value.push('quinta')
    } 
    else {
      ClaseNotas.value.push(`Nota ${i}`)
    }
  }
}

calcularNotas()

function styleDivAfinador() {
  return {
    height: alto + 'px',
    width: ancho + 'px',
  }
}
</script>

<template>
  <div :style="styleDivAfinador()" class="divAfinador">
      <div style="display: flex;">
                <div v-for="(nota, index) in NotasAnteriores" :key="index" :class="ClaseNotasAnteriores[index]" class="clsNota">
          {{ nota.toFixed(2) }} 
        </div>
        <input type="number" v-model="tipoAfinacion" min="1" max="999" @change="calcularNotas" />
        <div v-for="(nota, index) in Notas" :key="index" :class="ClaseNotas[index]" class="clsNota">
          {{ nota.toFixed(2) }} 
        </div>
      </div>

  </div>
</template>

<style scoped>
.divAfinador {
  border: 1px solid blue;
}

.quinta {
  font-size: larger;
}
.octava {
  font-size: x-large;
}
.clsNota {
  margin-right: 5px;
  padding: 2px;
  border: 1px solid;
}
</style>
