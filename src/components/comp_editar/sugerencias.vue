<script lang="ts" setup>
import type { Cancion } from '../../modelo/cancion/cancion'
import { ref } from 'vue'
import type { Sugerencia } from '../../modelo/sugerencias/sugerencia'
import { BuilderSugerencias } from '../../modelo/sugerencias/builderSugerencias'
const props = defineProps<{
  cancion: Cancion
}>()

// Watch for changes in cancion.escala and recalculate suggestions
import { watch } from 'vue'
const emit = defineEmits(['actualizarCancion'])

watch(
  () => props.cancion.escala,
  () => {
    sugerencias.value = BuilderSugerencias.generarSugerencias(props.cancion)
  },
  { deep: true },
)

const sugerencias = ref([] as Sugerencia[])
sugerencias.value = BuilderSugerencias.generarSugerencias(props.cancion)
function aplicarSugerencia(index: number) {
  sugerencias.value[index].aplicarSugerencia(props.cancion)
  emit('actualizarCancion')
}
</script>
<template>
  <div>
    <div
      v-for="(sugerencia, index) in sugerencias"
      :key="index"
      @click="aplicarSugerencia(index)"
      class="sugerencia-item"
    >
      {{ sugerencia.descripcion }}
    </div>
    <!-- Aquí puedes agregar más contenido o componentes según sea necesario -->
  </div>
</template>
<style scoped>
.sugerencia-item {
  border: 1px solid;
  width: fit-content;
  padding: 8px;
  margin: 8px 0;
  border-radius: 4px;
}
</style>
