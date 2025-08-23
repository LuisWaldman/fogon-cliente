<script setup lang="ts">
//import ChordBox from 'vexchords'
import { onMounted, ref, watch } from 'vue'
import {
  AcordesGuitarra,
  AcordesGuitarraHelper,
} from '../../modelo/GuitarAcordes'

const props = defineProps<{
  acorde: string
}>()

const controlDiv = ref<HTMLElement | null>(null) // Ref to the div

//console.log('Acorde.vue', props.acorde)
const refAcorde = ref<AcordesGuitarra | null>(null)

// Función para actualizar el acorde
const updateAcorde = () => {
  refAcorde.value = AcordesGuitarraHelper.getAcorde(props.acorde)
}

onMounted(() => {
  updateAcorde()
})

// Watch para detectar cambios en la prop acorde
watch(
  () => props.acorde,
  () => {
    updateAcorde()
  },
)
</script>

<template>
  <div>
    <div id="divponerAcorde" ref="controlDiv"></div>
    <div class="">{{ acorde }}</div>
    {{ refAcorde }}
  </div>
</template>

<style scoped>
.acordesPantalla {
  color: red;
  font-size: 200px;
}
</style>
