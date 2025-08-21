<script setup lang="ts">
import renglonPentagrama from './Tocar_renglonPentagrama.vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'

import { DisplayPentagrama } from '../../modelo/pentagrama/DisplayPentagrama'
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
  
  <div class="componenteMusical">
    <div v-for="(renglon, index) in display.renglones" :key="index">
      <renglonPentagrama
        :renglon="renglon"
        :cancion="props.cancion"
      ></renglonPentagrama>
    </div>
  </div>
</template>

<style scoped>
.componenteMusical {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
