<script setup lang="ts">
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'

const props = defineProps<{
  compas: number
  cancion: Cancion
  verAcordes: boolean
  verMetricaEs: boolean
}>()

const contentAcordes = ref('')
const contentMetricaEs = ref('')
const refTextoEditable = ref('')

var fondoAcordes = new BuildFondoAcordes()
var fondoMetricaEs = new BuildFondoMetricaES()

function updateContent() {
  console.log('updateContent')
  const textoCancion = (document.querySelector('.divEditable') as HTMLElement)
    .innerHTML
  if (props.verAcordes) {
    contentAcordes.value = fondoAcordes.build(props.cancion, textoCancion)
  } else {
    contentAcordes.value = ''
  }
  if (props.verMetricaEs) {
    contentMetricaEs.value = fondoMetricaEs.build(props.cancion, textoCancion)
  } else {
    contentMetricaEs.value = ''
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault() // Evitar el comportamiento predeterminado
  const text = event.clipboardData?.getData('text/plain') // Obtener solo el texto sin formato
  if (text) {
    document.execCommand('insertText', false, text) // Insertar el texto en la posición del cursor
  }
}

// Watch for changes in editandoCancion
import { watch } from 'vue'
import { BuildFondo } from './buildFondo'

// Set up a watcher that calls updateContent when editandoCancion changes
watch(
  () => props.cancion,
  () => {
    refTextoEditable.value = BuildFondo.hacerTexto(props.cancion)
    updateContent()
  },
)

function clickOkeditacorde() {
  const textoCancion = (document.querySelector('.divEditable') as HTMLElement)
    .innerHTML
  props.cancion.letras.renglones = [
    textoCancion
      .replace('&nbsp;', ' ')
      .replace('<div>', '/n')
      .replace('</div>', '')
      .replace(/<br>/g, '/n')
      .split('|'),
  ]
  emit('cerrar')
}

function clickCancelareditacorde() {
  emit('cerrar')
  updateContent()
}

// Expose updateContent to parent components
defineExpose({
  updateContent,
})
// Event to notify parent when the editor should close
const emit = defineEmits(['cerrar'])

// On component mount, initialize the text
import { onMounted } from 'vue'
import { BuildFondoAcordes } from './buildFondoAcordes'
import { BuildFondoMetricaES } from './buildFondeMetrica'

onMounted(() => {
  refTextoEditable.value = BuildFondo.hacerTexto(props.cancion)
  updateContent()
})
</script>

<template>
  <div>
    <div class="btnEditAcorde" @click="clickOkeditacorde">
      <span class="bi bi-check-circle"></span> Ok
    </div>
    <div class="btnEditAcorde" @click="clickCancelareditacorde">
      <span class="bi bi-x-circle"></span> Cancelar
    </div>
  </div>
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

  color: white;
  font-size: var(--tamanio-letra);
  padding: 12px;
  top: 24px;
  width: 100%;
  height: 100%;
}

.divAcordes {
  color: #a9a8f6;
  top: 0px;
}
.divAcordes div {
  display: inline-block;
  width: auto;
}

.btnEditAcorde {
  border: 1px solid;
  color: #a9a8f6;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  padding: 10px 24px;
}
.divAcordes .saltolinea {
  width: 100%;
  display: block;
}

.divMetricaEs {
  color: #e69c49;
  z-index: 100;
}

.divEditableContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
