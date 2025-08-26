<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Renderer } from 'vexflow'
import { DisplaySistemaPentagrama } from '../../modelo/pentagrama/DisplaySistemaPentagrama'
import { Cancion } from '../../modelo/cancion/cancion'

const props = defineProps<{
  renglon: DisplaySistemaPentagrama
  cancion: Cancion
}>()

const scoreContainer = ref<HTMLDivElement | null>(null)

watch(
  () => props.renglon,
  () => {
    Dibujar()
  },
)
function Dibujar() {
  if (!scoreContainer.value) return

  // Limpiar completamente el contenedor antes de crear el nuevo renderer
  scoreContainer.value.innerHTML = ''

  const renderer = new Renderer(scoreContainer.value, Renderer.Backends.SVG)
  renderer.resize(900, 100)
  const context = renderer.getContext()
  
  // Establecer los colores ANTES de crear y dibujar el pentagrama
  context.setFillStyle('#a9a8f6')
  context.setStrokeStyle('#a9a8f6')

  for (const pentagrama of props.renglon.pentagramas) {
    pentagrama.getStave(context)
  }
}

onMounted(() => {
  Dibujar()
})

defineExpose({ Dibujar })
</script>
<template>
  <div>
    <div ref="scoreContainer" class="score"></div>
  </div>
</template>

<style scoped>
.score svg path,
.score svg text {
  fill: violet;
  stroke: violet;
}
</style>
