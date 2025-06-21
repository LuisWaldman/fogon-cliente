<script setup lang="ts">
import { ref } from 'vue'
import { Noticia } from '../../modelo/noticia'
import rendernoticia from './rendernoticia.vue'

const mostrarMas = ref(false)

const props = defineProps<{
  noticia: Noticia
}>()
</script>

<template>
  <div class="noticia">
    <h2>{{ props.noticia.titulo }}</h2>
    
    <rendernoticia :texto="props.noticia.texto"></rendernoticia>
    <span v-if="props.noticia.mastexto" @click="mostrarMas = !mostrarMas">
      {{ mostrarMas ? '-' : '+' }}
    </span>
    <rendernoticia
    v-if="mostrarMas && props.noticia.mastexto"
      :texto="props.noticia.mastexto"
    >


    </rendernoticia>
    
  </div>
</template>

<style scoped>
.noticia {
  padding: 1em;
  margin: 1em 0;
}
.cancion {
  background: #f9f9f9;
  padding: 0.5em;
  margin: 0.5em 0;
  border-left: 3px solid #2196f3;
}
button {
  margin-top: 1em;
}
</style>
