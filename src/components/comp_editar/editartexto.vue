<script setup lang="ts">
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion'
import { EditarHelper } from './editarHelper'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const contentAcordes = ref('')
function updateContent() {
  const textoCancion = (document.querySelector('.divEditable') as HTMLElement)
    .innerHTML
  const partes = textoCancion.split('<div>')
  const nt = partes.map((parte) => parte.replace('</div>', '')).join('<br>')
  const fondo = EditarHelper.ArmarFondoEditarAcordes(nt, props.cancion)
  contentAcordes.value = fondo
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault() // Evitar el comportamiento predeterminado
  const text = event.clipboardData?.getData('text/plain') // Obtener solo el texto sin formato
  if (text) {
    document.execCommand('insertText', false, text) // Insertar el texto en la posición del cursor
  }
}
</script>

<template>
  <div
    class="divEditable"
    id="divEditable"
    contenteditable="true"
    @input="updateContent"
    @paste="handlePaste"
    v-html="
      props.cancion.letras.renglones.flat().join('|').replace(/\/n/g, '<br>')
    "
  ></div>

  <div
    class="divAcordes"
    style="display: flex; flex-wrap: wrap"
    v-html="contentAcordes"
  ></div>
</template>
<style scoped></style>
