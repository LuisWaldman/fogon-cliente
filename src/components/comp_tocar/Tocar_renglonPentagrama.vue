<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Renderer } from 'vexflow'
import type { DisplayRenglonPentagrama } from '../../modelo/pentagrama/DisplayRenglonPentagrama'
import type { Cancion } from '../../modelo/cancion/cancion'

const props = defineProps<{
  renglon: DisplayRenglonPentagrama
  cancion: Cancion
}>()

const scoreContainer = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!scoreContainer.value) return

  const renderer = new Renderer(scoreContainer.value, Renderer.Backends.SVG)
  renderer.resize(900, 100)
  const context = renderer.getContext()

  // Establecer los colores ANTES de crear y dibujar el pentagrama
  context.setFillStyle('#a9a8f6')
  context.setStrokeStyle('#a9a8f6')

  for (const pentagrama of props.renglon.pentagramas) {
    pentagrama.getStave(context)
  }
})
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
