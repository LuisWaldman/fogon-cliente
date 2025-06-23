<script setup lang="ts">
import CANCION from './cancionnoticia.vue'
import TEXTO from './textonoticia.vue'
import type { Component } from 'vue'
const componentes: Record<string, Component> = {
  TEXTO,
  CANCION,
}
const props = defineProps({
  texto: {
    type: String,
    required: true,
  },
})
const compos = props.texto.split('|').filter((s) => s.trim() !== '')
const textos = compos.map((s) => s.split(',')[0])
</script>

<template>
  <div class="rendernoticia">
    <component
      v-for="(texto, id) in textos"
      :key="id"
      :is="componentes[texto]"
      :texto="compos[id]"
    />
  </div>
</template>
