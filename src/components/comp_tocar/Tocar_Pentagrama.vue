<script setup lang="ts">
import renglonPentagrama from './Tocar_renglonPentagrama.vue'
import { ref, onMounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { DisplayPentagrama } from '../../modelo/pentagrama/displayPentagrama'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const display = ref<DisplayPentagrama>(new DisplayPentagrama())

const helper = new HelperPentagramas()
onMounted(() => {
  Actualizar()
})

function Actualizar() {
  console.log('Actualizando display')
  const newDisplay = helper.creaDisplayPentagrama(props.cancion)
  display.value = new DisplayPentagrama()
  display.value = newDisplay
}

watch(
  () => props.cancion,
  () => {
    Actualizar()
  },
)
defineExpose({ Actualizar })
</script>
<template>
  <div class="componenteMusical">
    <div>
      <div v-for="(pentagrama, index) in cancion.pentagramas" :key="index">
        {{ pentagrama.instrumento }}
      </div>
    </div>
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
