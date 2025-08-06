<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { EditarAcordesToTextoHelper } from './editarAcordesToTextoHelper'

const props = defineProps<{ cancion: Cancion }>()
const emit = defineEmits(['cerrar'])

const refEditandoTextoAcordes = ref('')

function clickOkeditacorde() {
  console.log('click_okeditacorde')

  let helper = new EditarAcordesToTextoHelper()
  props.cancion.acordes = helper.textoToAcordes(refEditandoTextoAcordes.value)

  emit('cerrar')
}
function clickCancelareditacorde() {
  console.log('click_cancelareditacorde')
  emit('cerrar')
}

refEditandoTextoAcordes.value = EditarAcordesToTextoHelper.acordesToTexto(
  props.cancion.acordes,
)
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
  <div class="divTextArea">
    <textarea
      v-model="refEditandoTextoAcordes"
      style="width: 100%; height: 200px; resize: none"
    ></textarea>
  </div>
</template>

<style scoped>
.divTextArea textarea {
  color: rgb(233, 221, 223);
  font-size: x-large;
}
.contAcordes {
  display: flex;
  flex-wrap: wrap;
}

.btnSeleccionado {
  background-color: #a9a8f6;
  color: white !important;
}
.acorde_edicion {
  font-size: x-large;
  border: 1px solid #a9a8f6;
  padding: 10px;
  border-left: none;
}
.acorde_split:hover {
  border: 2px solid #a9a8f6;
  margin-left: 30px;
}

.acorde_mixiando:hover {
  border: 2px solid #a9a8f6;
  color: rgb(158, 52, 52);
  border-right: none;
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
.seleccionada {
  background-color: #a9a8f6;
  color: white !important;
  border: 2px solid #a9a8f6;
}
</style>
