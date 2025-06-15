<script setup lang="ts">
import { ref } from 'vue'
import { Noticia } from '../../modelo/noticia'

const mostrarMas = ref(false)

const props = defineProps<{
  noticia: Noticia
}>()
</script>

<template>
  <Cancion></Cancion>
  <div class="noticia">
    <h2>{{ props.noticia.titulo }}</h2>
    <div v-html="props.noticia.texto"></div>

    <span v-if="props.noticia.mastexto" @click="mostrarMas = !mostrarMas">
      {{ mostrarMas ? '-' : '+' }}
    </span>
    <div
      v-if="mostrarMas && props.noticia.mastexto"
      v-html="props.noticia.mastexto"
    ></div>
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
