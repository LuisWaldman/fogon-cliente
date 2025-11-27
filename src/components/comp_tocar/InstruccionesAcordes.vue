<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import InstruccionesAcordesGuitarra from './InstruccionesAcordesGuitarra.vue'
import InstruccionesAcordesUkelele from './InstruccionesAcordesUkelele.vue'
import InstruccionesAcordesTeclado from './InstruccionesAcordesTeclado.vue'
import InstruccionesAcordesGuitarraMelodica from './InstruccionesAcordesGuitarraMelodica.vue'

const props = defineProps<{
  compas: number
  cancion: Cancion
  viendoInstrucciones: string
}>()

const componenteActual = computed(() => {
  switch (props.viendoInstrucciones) {
    case 'guitarra':
      return markRaw(InstruccionesAcordesGuitarra)
    case 'ukelele':
      return markRaw(InstruccionesAcordesUkelele)
    case 'teclado':
      return markRaw(InstruccionesAcordesTeclado)
    case 'guitarra-melodica':
      return markRaw(InstruccionesAcordesGuitarraMelodica)
    default:
      return null
  }
})
</script>

<template>
  <component
    :is="componenteActual"
    v-if="componenteActual"
    :cancion="cancion"
    :compas="compas"
  />
</template>

<style scoped>
</style>
