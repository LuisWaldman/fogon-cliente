<script lang="ts" setup>
import type { Cancion } from '../../modelo/cancion/cancion';
import subirmidi from './subirmidi.vue'
const props = defineProps<{
  cancion: Cancion
}>()


const emit = defineEmits(['cerrar'])

function clickCancelarEdit() {
  emit('cerrar')
}


function clickConfirmarEdit() {
  emit('cerrar')
}


</script>
<template>

    
  <div>
    <span @click="clickCancelarEdit">[Cancelar]</span>
    <span @click="clickConfirmarAcorde">[Confirmar]</span>
    <subirmidi></subirmidi>
  </div>
</template>
