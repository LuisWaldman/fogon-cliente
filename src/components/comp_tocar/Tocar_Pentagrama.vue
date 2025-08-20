<script setup lang="ts">
import renglonPentagrama from './Tocar_renglonPentagrama.vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'

import { DisplayPentagrama } from '../../modelo/pentagrama/displayPentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const display = ref(new DisplayPentagrama())

const helper = new HelperPentagramas()
onMounted(() => {
  display.value = helper.creaDisplayPentagrama(props.cancion)
})

// Also add a watcher in case the cancion prop changes
watch(
  () => props.cancion,
  (newCancion) => {
    display.value = helper.creaDisplayPentagrama(newCancion)
  },
)
</script>
<template>
  <div>
    <div v-for="(renglon, index) in display.renglones" :key="index">
      <renglonPentagrama :renglon="renglon"></renglonPentagrama>
      {{ renglon }}
    </div>
  </div>
</template>

<style scoped></style>
