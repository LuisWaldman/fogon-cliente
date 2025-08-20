<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { Renderer, Stave, StaveNote, Formatter, Beam, StaveConnector } from 'vexflow'

const scoreContainer = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!scoreContainer.value) return

  const renderer = new Renderer(scoreContainer.value, Renderer.Backends.SVG)
  renderer.resize(800, 300) // Aumenté la altura para dar más espacio
  const context = renderer.getContext()

  // Establecer los colores ANTES de crear y dibujar el pentagrama
  context.setFillStyle('violet')
  context.setStrokeStyle('violet')

  const stave = new Stave(10, 40, 700) // Pentagrama superior
  stave.addClef('treble').addTimeSignature('4/4')
  stave.setContext(context).draw()

  const bassStave = new Stave(10, 120, 700) // Más separación entre pentagramas
  bassStave.addClef('bass').addTimeSignature('4/4')
  bassStave.setContext(context).draw()

  // Dibujar el conector ANTES de las notas
  const connector = new StaveConnector(stave, bassStave)
  connector.setType(StaveConnector.type.BRACE) // Cambié a BRACE que es más común para piano
  connector.setContext(context).draw()

  const notes = [
    new StaveNote({ keys: ['g/4', 'b/4', 'd/5'], duration: '4' }), // Acorde de Sol mayor (media nota)
    new StaveNote({ keys: ['g/4', 'b/4', 'd/5'], duration: '2' }), // Acorde de Sol mayor (negra)
    new StaveNote({ keys: ['g/4'], duration: '16' }), // Fusa - Sol
    new StaveNote({ keys: ['b/3'], duration: '16' }), // Fusa - Si
    new StaveNote({ keys: ['d/5'], duration: '16' }), // Fusa - Re
    new StaveNote({ keys: ['g/4'], duration: '16' }), // Fusa - Sol (cuarta nota)
  ]

  // Crear la barra lateral para las 4 fusas
  const beam = new Beam([notes[2], notes[3], notes[4], notes[5]])

  Formatter.FormatAndDraw(context, stave, notes)

  const notesBass = [
    new StaveNote({ keys: ['g/2'], duration: 'h', clef: 'bass' }), // Sol en octava 3 para clave de fa
    new StaveNote({ keys: ['g/2'], duration: 'h', clef: 'bass' }), // Sol en octava 3 para clave de fa
  ]

  Formatter.FormatAndDraw(context, bassStave, notesBass)

  // Dibujar la barra lateral
  beam.setContext(context).draw()
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
