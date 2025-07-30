<script setup lang="ts">
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion'
import { useAppStore } from '../../stores/appStore'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const contentAcordes = ref('')
const contentMetricaEs = ref('')
const refTextoEditable = ref('')

var fondoAcordes = new BuildFondoAcordes()

function updateContent() {
  console.log('updateContent')
  const textoCancion = (document.querySelector('.divEditable') as HTMLElement)
    .innerHTML
  contentAcordes.value = fondoAcordes.build(props.cancion, textoCancion)
}

const appStore = useAppStore()

function handlePaste(event: ClipboardEvent) {
  event.preventDefault() // Evitar el comportamiento predeterminado
  const text = event.clipboardData?.getData('text/plain') // Obtener solo el texto sin formato
  if (text) {
    document.execCommand('insertText', false, text) // Insertar el texto en la posición del cursor
  }
}

// Watch for changes in editandoCancion
import { watch } from 'vue'
import { BuildFondoAcordes, BuildFondoMetricaES } from './buildFondo'

// Set up a watcher that calls updateContent when editandoCancion changes
watch(
  () => props.cancion,
  () => {
    refTextoEditable.value = fondoAcordes.hacerTexto(props.cancion)
    updateContent()
  },
)

// Expose updateContent to parent components
defineExpose({
  updateContent,
})

// On component mount, initialize the text
import { onMounted } from 'vue'

onMounted(() => {
  refTextoEditable.value = fondoAcordes.hacerTexto(props.cancion)
  updateContent()
})
</script>

<template>
  <div class="divEditableContainer">
    <div
      style="z-index: 200"
      class="divEditable"
      id="divEditable"
      contenteditable="true"
      @input="updateContent"
      @paste="handlePaste"
      v-html="refTextoEditable"
    ></div>

    <div
      class="divAcordes divEditable"
      style="display: flex; flex-wrap: wrap"
      v-html="contentAcordes"
    ></div>

    <div
      class="divMetricaEs divEditable"
      style="display: flex; flex-wrap: wrap"
      v-html="contentMetricaEs"
    ></div>
  </div>
</template>
<style scoped>
.divEditable {
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: auto;
  min-height: 100px;
  position: absolute;
  font-size: 24px;
  font-family: 'Roboto Mono', monospace;
  padding: 12px;
  top: 24px;
  width: 100%;
  height: 100%;
}

.divAcordes {
  top: 0px;
  color: red;
}
.divAcordes div {
  display: inline-block;
  width: auto;
}

.divAcordes .saltolinea {
  width: 100%;
  display: block;
}

.divMetricaEs {
}

.divEditableContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
