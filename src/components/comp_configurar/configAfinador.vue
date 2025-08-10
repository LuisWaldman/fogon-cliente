
<script setup lang="ts">
import { Pantalla } from '../../modelo/pantalla';

const pantalla = new Pantalla()
const ancho = pantalla.getAnchoPantalla() * 0.7
const alto = pantalla.getAltoPantalla()
function styleDivAfinador() {
  return {
    height: alto + 'px',
    width: ancho + 'px',
  }
}
</script>

<template>
  <div :style="styleDivAfinador()" class="divAfinador">
      Afinador
  </div>
</template>

<style scoped>
.divAfinador {
  border: 1px solid blue;
}
</style>
