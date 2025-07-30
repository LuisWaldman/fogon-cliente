<script setup lang="ts">
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion'
import { EditarHelper } from './editarHelper'
import { useAppStore } from '../../stores/appStore'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const contentAcordes = ref('')
const refTextoEditable = ref('')

function updateContent() {
  refTextoEditable.value = props.cancion.letras.renglones
    .flat()
    .join('|')
    .replace(/\/n/g, '<br>')
  const partes = refTextoEditable.value.split('<div>')
  const nt = partes.map((parte) => parte.replace('</div>', '')).join('<br>')
  const fondo = EditarHelper.ArmarFondoEditarAcordes(nt, props.cancion)
  contentAcordes.value = fondo
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

// Set up a watcher that calls updateContent when editandoCancion changes
watch(
  () => appStore.editandocancion,
  () => {
    updateContent()
  },
)

// Expose updateContent to parent components
defineExpose({
  updateContent,
})
</script>

<template>
  <div class="divEditableContainer">
    <div
      class="divEditable"
      id="divEditable"
      contenteditable="true"
      @input="updateContent"
      @paste="handlePaste"
      v-html="refTextoEditable"
    ></div>

    <div
      class="divAcordes"
      style="display: flex; flex-wrap: wrap"
      v-html="contentAcordes"
    ></div>
  </div>
</template>
<style scoped>
.divEditable {
  min-height: 100px;
  position: absolute;
  top: 25px;
  line-height: 2.5;
  font-size: 20px;
  width: 100%;
  padding: 20px;
}

.divAcordes {
  padding: 20px;
  min-height: 100px;
  position: absolute;
  top: 0px;
  line-height: 2.5;
  font-size: 20px;
  z-index: 1;
  pointer-events: none; /* Para que los eventos de mouse pasen a través de este div */
}

.divEditableContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
