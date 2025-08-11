<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import type { Parte } from '../../modelo/cancion/acordes'
defineProps<{
  parte: Parte
}>()
</script>
<template>
  <div>
    {{ parte.nombre }}
  </div>
</template>
