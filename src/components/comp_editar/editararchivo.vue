<script setup lang="ts">
import type { Cancion } from '../../modelo/cancion/cancion';

defineProps<{
  cancion: Cancion
}>()

</script>
<template>
  <div style="display: flex; width: 100%">
      {{ cancion.cancion }} -
      {{ cancion.banda }}
    </div>
</template>
<style scoped>
</style>