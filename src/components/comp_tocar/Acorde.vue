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
  <div class="divTocarAcorde">
    <div class="">{{ acorde }}</div>

    <div style="display: flex">
      <span>{{ refAcorde?.cejilla }}</span>
      <span v-for="(nota, index) in refAcorde?.cuerda" :key="index">{{
        nota === 'x' ? 'x' : '-'
      }}</span>
    </div>

    <div v-for="n in 4" :key="n" style="display: flex; margin-left: 12px">
      <div
        style="margin: 0px; padding: 0px; height: 25px"
        v-for="(nota, notaid) in refAcorde?.cuerda"
        :key="notaid"
      >
        <span v-if="nota.toString() === n.toString()" class="">O</span>
        <span v-else class="">|</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acordesPantalla {
  color: #a9a8f6;
  font-size: 200px;
}
.divTocarAcorde {
  border: 1px solid #a9a8f6;
  padding: 10px;
}
.divTocarAcorde span {
  font-size: 20px;
  padding: 0px;
}
.sinmargen {
  margin: 0px;
  padding: 0px;
}
</style>
