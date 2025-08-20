<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { BuildFondo } from './buildFondo'
import { Pantalla } from '../../modelo/pantalla'
import { HelperDisplay } from '../../modelo/display/helperDisplay'
import { Display } from '../../modelo/display/display'

const pantalla = new Pantalla()
const configuracionPantalla = pantalla.getConfiguracionPantalla()
const props = defineProps<{
  compas: number
  cancion: Cancion
  verAcordes: boolean
  verMetricaEs: boolean
}>()

const helperDisplay = new HelperDisplay()
const displayRef = ref(new Display(configuracionPantalla.columnas))
function ActualizarCancion(cancion: Cancion) {
  displayRef.value = helperDisplay.getDisplay(
    cancion,
    configuracionPantalla.columnas,
  )
}

const emit = defineEmits(['cerrar'])
const refTextoEditable = ref('')
const cancionActualizada = Cancion.GetDefault("EDITCONSOLA")
cancionActualizada.acordes = props.cancion.acordes
watch(refTextoEditable, (newValue) => {
  const renglonesActualizados = newValue.replace(/\r?\n/g, '/n').split('|');
  cancionActualizada.letras.renglones = [renglonesActualizados];
  ActualizarCancion(cancionActualizada);
}, { immediate: false });

const refTextarea = ref<HTMLTextAreaElement>()
const refPreview = ref<HTMLDivElement>()

onMounted(() => {
  refTextoEditable.value = props.cancion.letras.renglones.flat().join('|').replace(/\/n/g, '\n')
})

function onTextareaScroll() {
  if (refTextarea.value && refPreview.value) {
    refPreview.value.scrollTop = refTextarea.value.scrollTop
    refPreview.value.scrollLeft = refTextarea.value.scrollLeft
  }
}

function clickCancelarConsola() {
  emit('cerrar')
}

function clickConfirmarAcorde() {
  
  props.cancion.letras.renglones = [ refTextoEditable.value.replace(/\r?\n/g, '/n').split('|') ]
  emit('cerrar')
}
</script>

<template>
  <div>
    <span @click="clickCancelarConsola">[Cancelar]</span>
    <span @click="clickConfirmarAcorde">[Confirmar]</span>
  </div>
  <div>
    <div style="display: flex;  overflow: hidden;height: 400px;">
      <div  style="height: 400px;">
        <textarea
    class="textArea"
    ref="refTextarea"
    @scroll="onTextareaScroll"
    v-model="refTextoEditable" :cols="configuracionPantalla.columnas"></textarea>

      </div>
      <div class="preview" ref="refPreview">
        <template v-for="(verso, index) in displayRef.Versos" :key="index">
          <div v-for="(renglon, rIndex) in verso.renglonesDisplay" :key="rIndex"
          style="display: flex;"
          >
            <div v-for="(acorde, aIndex) in renglon.acordes" :key="aIndex" class="acordeconsola">
              {{ acorde.contenido }}
            </div>
          </div>
        </template>
        
      </div>
    </div>



  </div>
</template>
<style scoped>
.textArea {
  height: 100%;
  font-family: monospace;
  font-size: var(--tamanio-letra);
  border: none;
  padding: 10px;
  color: white;
  font-size: var(--tamanio-letra);
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
</style>
