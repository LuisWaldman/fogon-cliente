<script setup lang="ts">
import renglonPentagrama from './Tocar_renglonPentagrama.vue'
import { ref, onMounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { DisplayPentagrama } from '../../modelo/pentagrama/displayPentagrama'
import type { DisplayModoPentagrama } from '../../modelo/pentagrama/displayModoPentagrama'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const display = ref<DisplayPentagrama>(new DisplayPentagrama())
/*
GetModos
*/
const modos = ref<DisplayModoPentagrama[]>([])

const helper = new HelperPentagramas()
onMounted(() => {
  modos.value = helper.GetModos(props.cancion)

  Actualizar()
})

function Actualizar() {
  const newDisplay = helper.creaDisplayPentagrama(props.cancion, modos.value)
  display.value = newDisplay
}

watch(
  () => props.cancion,
  () => {
    modos.value = helper.GetModos(props.cancion)
    Actualizar()
  },
)
defineExpose({ Actualizar })
</script>
<template>
  <div class="componenteMusical">
    <div>
      <div v-for="(modo, index) in modos" :key="index">
        {{ modo.Instrumento }} <input type="checkbox" v-model="modo.Ver">Ver</input>
        <select v-model="modo.Clave">
          <option value="treble">Treble</option>
          <option value="bass">Bass</option>
        </select>

      </div>
      <div @click="Actualizar">
        [ACTUALIZAR]
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
