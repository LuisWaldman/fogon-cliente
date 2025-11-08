<script setup lang="ts">
import type { textoResumen } from '../../modelo/displayEditTexto/textoResumen'

defineProps<{
  silabas: textoResumen['silabas']
}>()
</script>

<template>
  <span>
    <b v-if="silabas.length == 0">Irregular</b>
    <b v-else-if="silabas.length == 1">
      {{ silabas[0].base }}
      <span v-if="silabas[0].diferencia > 0"
        >+/-{{ silabas[0].diferencia }}</span
      >
    </b>
    <b v-else>
      {{ silabas[0].base }}
      <span v-if="silabas[0].diferencia > 0"
        >+/-{{ silabas[0].diferencia }}</span
      >
      y {{ silabas[1].base }}
      <span v-if="silabas[1].diferencia > 0"
        >+/-{{ silabas[1].diferencia }}</span
      >
    </b>
  </span>
</template>
