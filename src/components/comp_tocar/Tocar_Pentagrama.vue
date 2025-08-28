<script setup lang="ts">
import renglonPentagrama from './Tocar_renglonPentagrama.vue'
import { ref, onMounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { DisplayPentagrama } from '../../modelo/pentagrama/displayPentagrama'
import type { DisplayModoPentagrama } from '../../modelo/pentagrama/displayModoPentagrama'

const emit = defineEmits(['clickCompas'])
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

watch(
  modos,
  () => {
    Actualizar()
  },
  { deep: true },
)

defineExpose({ Actualizar })
</script>
<template>
  <div class="componenteMusical">
    <div class="dropdown dropdown-superior-derecha">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="bi bi-eye"></i>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li v-for="(modo, index) in modos" :key="index">
          <input type="checkbox" v-model="modo.Ver" />{{ modo.Instrumento }}
        </li>
      </ul>
    </div>

    <div v-for="(renglon, index) in display.renglones" :key="index">
      <renglonPentagrama
        :compas="props.compas"
        :renglon="renglon"
        :cancion="props.cancion"
        @clickCompas="emit('clickCompas', $event)"
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
  position: relative;
}

.dropdown-superior-derecha {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 5;
}
</style>
