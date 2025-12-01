<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Renderer } from 'vexflow'
import { DisplaySistemaPentagrama } from '../../modelo/pentagrama/DisplaySistemaPentagrama'
import { Cancion } from '../../modelo/cancion/cancion'

const props = defineProps<{
  renglon: DisplaySistemaPentagrama
  cancion: Cancion
  compas: number
}>()

const scoreContainer = ref<HTMLDivElement | null>(null)

watch(
  () => props.renglon,
  () => {
    Dibujar()
  },
)

watch(
  () => props.compas,
  (newCompas, oldCompas) => {
    if (props.renglon.pentagramas.length === 0) return
    const desdecompas = props.renglon.pentagramas[0].compases[0].nroCompas
    const hastacompas =
      props.renglon.pentagramas[0].compases[
        props.renglon.pentagramas[0].compases.length - 1
      ].nroCompas

    if (
      (oldCompas >= desdecompas && oldCompas <= hastacompas) ||
      (newCompas >= desdecompas && newCompas <= hastacompas)
    ) {
      Dibujar()
    }
  },
)

const anchoPrimerStave = 60
const anchoCompasStave = 200
const refDibujado = ref<string>('')
function Dibujar() {
  if (!scoreContainer.value) return
  scoreContainer.value.innerHTML = ''

  const renderer = new Renderer(scoreContainer.value, Renderer.Backends.SVG)
  const ancho = props.renglon.pentagramas.length * 100
  renderer.resize(900, ancho)
  const context = renderer.getContext()
  context.setFillStyle('#a9a8f6')
  context.setStrokeStyle('#a9a8f6')
  refDibujado.value = 'normal'

  let x = 0
  for (const pentagrama of props.renglon.pentagramas) {
    pentagrama.getStave(context, props.cancion, x, props.compas)
    x += 100
  }
}

const emit = defineEmits(['clickCompas'])
function handleClick(event: MouseEvent) {
  const compas = Math.floor(
    (event.offsetX - anchoPrimerStave) / anchoCompasStave,
  )
  emit(
    'clickCompas',
    props.renglon.pentagramas[0].compases[0].nroCompas + compas,
  )
}

onMounted(() => {
  Dibujar()
})

defineExpose({ Dibujar })
</script>
<template>
  <div>
    <div ref="scoreContainer" @click="handleClick" class="score"></div>
  </div>
</template>

<style scoped>
.score svg path,
.score svg text {
  fill: violet;
  stroke: violet;
}
</style>
