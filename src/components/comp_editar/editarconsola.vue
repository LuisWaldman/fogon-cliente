<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'
import { HelperDisplayEditTexto } from '../../modelo/displayEditTexto/helperDisplayEditTexto'
import type { textoResumen } from '../../modelo/displayEditTexto/textoResumen'
import SpanSilabas from './spanSilabas.vue'

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
  const nuevo = helperTexto.getResumen(cancion.letras)
  props.cancion.letras.renglones = [
    refTextoEditable.value.replace(/\r?\n/g, '/n').split('|'),
  ]
  if (
    refTextoResumido.value.versos != nuevo.versos ||
    refTextoResumido.value.silabas.length != nuevo.silabas.length
  ) {
    emit('actualizoTexto')
  }
  refTextoResumido.value = nuevo
}

const emit = defineEmits(['actualizoTexto'])
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
    if (refPreviewVerso.value != null) {
      refPreviewVerso.value.scrollTop = refTextarea.value.scrollTop
    }
  }
}
</script>

<template>
  <div class="barraInformacion">
    <div class="resVerso">
      <span
        >Versos: <b>{{ refTextoResumido.versos }}</b></span
      >
    </div>
    <div class="resVerso">
      <span>Silabas: <SpanSilabas :silabas="refTextoResumido.silabas" /></span>
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
      <div class="divTextConteiner">
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
          <div class="acordeconsola" v-if="verso.Rima.trim() != ''">
            <div
              class="letraRima"
              :class="{ rimaconsonante: verso.tipoRima == 'consonante' }"
            >
              {{ verso.LetraRima.toUpperCase() }}
            </div>
            {{ verso.Rima }} - {{ verso.silabas }} Silabas
            <span class="diferenciaSilabas" v-if="verso.diferenciaSilabas != 0"
              >+/-{{ verso.diferenciaSilabas }}</span
            >
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
  width: 100%;
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
  display: flex;
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
.letraRima {
  border: 1px solid;
  padding-left: 3px;
  padding-right: 3px;
}

.rimaconsonante {
  background-color: rgb(187, 187, 81);
  color: white;
}

.divTextConteiner {
  height: 800px;
  width: 1500px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .divTextConteiner {
    width: 700px;
  }

  .textArea {
    width: 400px;
  }
}
</style>
