<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'
import { HelperDisplay } from '../../modelo/display/helperDisplay'
import { Display } from '../../modelo/display/display'
import { HelperDisplayEditTexto } from '../../modelo/displayEditTexto/helperDisplayEditTexto'
import type { textoResumen } from '../../modelo/displayEditTexto/textoResumen'

const pantalla = new Pantalla()
const configuracionPantalla = pantalla.getConfiguracionPantalla()
const props = defineProps<{
  compas: number
  cancion: Cancion
  verAcordes: boolean
  verMetricaEs: boolean
}>()

const helperTexto = new HelperDisplayEditTexto()
const refTextoResumido = ref<textoResumen>(
  helperTexto.getResumen(props.cancion.letras),
)
function ActualizarCancion(cancion: Cancion) {
  refTextoResumido.value = helperTexto.getResumen(cancion.letras)
  props.cancion.letras.renglones = [
    refTextoEditable.value.replace(/\r?\n/g, '/n').split('|'),
  ]
}

const emit = defineEmits(['cerrar'])
const refTextoEditable = ref('')
const cancionActualizada = Cancion.GetDefault('EDITCONSOLA')
cancionActualizada.acordes = props.cancion.acordes
watch(
  refTextoEditable,
  (newValue) => {
    const renglonesActualizados = newValue.replace(/\r?\n/g, '/n').split('|')
    cancionActualizada.letras.renglones = [renglonesActualizados]
    ActualizarCancion(cancionActualizada)
  },
  { immediate: false },
)

const refTextarea = ref<HTMLTextAreaElement>()
const refPreview = ref<HTMLDivElement>()
const refPreviewVerso = ref<HTMLDivElement>()

onMounted(() => {
  refTextoEditable.value = props.cancion.letras.renglones
    .flat()
    .join('|')
    .replace(/\/n/g, '\n')
})

function onTextareaScroll() {
  if (refTextarea.value && refPreview.value) {
    refPreview.value.scrollTop = refTextarea.value.scrollTop
    refPreviewVerso.value.scrollTop = refTextarea.value.scrollTop
  }
}

function clickCancelarConsola() {
  emit('cerrar')
}

function clickConfirmar() {
  props.cancion.letras.renglones = [
    refTextoEditable.value.replace(/\r?\n/g, '/n').split('|'),
  ]
}
</script>

<template>
  <div class="barraInformacion">
    <div class="resVerso">
      <span>Versos: <b>12</b></span>
    </div>
    <div class="resVerso">
      <span>Versos: <b>12</b></span>
    </div>
  </div>
  <div>
    <div class="divLetraConteiner">
      <div class="preview" ref="refPreview">
        <div v-for="(verso, index) in refTextoResumido.renglones" :key="index">
          <div class="acordeconsola" v-if="verso.nroRenglon == -1">♪</div>
          <div class="acordeconsola" v-else>{{ verso.nroRenglon }}</div>
        </div>
      </div>
      <div style="height: 800px">
        <textarea
          class="textArea"
          ref="refTextarea"
          @scroll="onTextareaScroll"
          v-model="refTextoEditable"
          :cols="configuracionPantalla.columnas"
        ></textarea>
      </div>
      <div class="preview" ref="refPreviewVerso">
        <div v-for="(verso, index) in refTextoResumido.renglones" :key="index">
          <div class="acordeconsola" v-if="verso.ultimaSilaba.trim() != ''">
            {{ verso.ultimaSilaba }} -
            {{ verso.letraRima }}
            {{ verso.silabas }} {{ verso.diferenciaSilabas }}
          </div>
          <div v-else>&nbsp;</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.textArea {
  height: 100%;
  width: 1000px;
  overflow-x: auto; /* Scroll horizontal si es necesario */
  overflow-y: auto; /* Scroll vertical si es necesario */
  white-space: pre; /* No hacer wrap automático */
  font-family: monospace;
  font-size: var(--tamanio-letra);
  border: none;
  padding: 10px;
  color: white;
  background-color: #222; /* Opcional para contraste */
}
.preview {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: var(--tamanio-letra);
  padding: 10px;
  overflow: hidden;
  height: 100%;
}
.acordeconsola {
  margin-right: 4px;
}
.barraInformacion {
  display: flex;
  background-color: #333333;
  color: var(--color-texto-secciones);
  padding: 5px;
}
.resVerso {
  margin-left: 10px;
  margin-right: 10px;
}
.divLetraConteiner {
  display: flex;
  gap: 0px;
  overflow: hidden;
  height: 800px;
}
</style>
