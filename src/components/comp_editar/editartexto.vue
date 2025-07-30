<script setup lang="ts">
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion'
import { useAppStore } from '../../stores/appStore'

const props = defineProps<{
  compas: number
  cancion: Cancion
  viendoAcordes: boolean
  viendoMetricaEs: boolean
}>()

const contentAcordes = ref('')
const contentMetricaEs = ref('')
const refTextoEditable = ref('')

function updateContent() {
  // Actualizar el contenido de los acordes

  const textoCancion = (document.querySelector('.divEditable') as HTMLElement)
    .innerHTML
  var fondoAcordes = new BuildFondoAcordes()
  contentAcordes.value = fondoAcordes.build(props.cancion, textoCancion)
  console.log('contentAcordes', contentAcordes.value)
  var fondoMetricaEs = new BuildFondoMetricaES()
  contentMetricaEs.value = fondoMetricaEs.build(props.cancion, textoCancion)
  /**/
  /*
  refTextoEditable.value = props.cancion.letras.renglones
    .flat()
    .join('|')
    .replace(/\/n/g, '<br>')
  const partes = refTextoEditable.value.split('<div>')
  const nt = partes.map((parte) => parte.replace('</div>', '')).join('<br>')
  const fondo = EditarHelper.ArmarFondoEditarAcordes(nt, props.cancion)
  contentAcordes.value = fondo*/
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
  () => appStore.editandocancion.letras.renglones,
  () => {
    refTextoEditable.value = props.cancion.letras.renglones
      .flat()
      .join('|')
      .replace(/\/n/g, '<br>')

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
  overflow-y: hidden;
  min-height: 100px;
  position: absolute;
  font-size: 20px;
  font-family: 'Roboto Mono', monospace;
  padding: 12px;
  top: 0px;
  width: 100%;
}

.divAcordes {
}

.divMetricaEs {
}

.divEditableContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
