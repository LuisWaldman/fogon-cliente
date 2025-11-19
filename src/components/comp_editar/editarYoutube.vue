<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Media } from '../../modelo/cancion/media'
import { OrigenCancion } from '../../modelo/cancion/origencancion'

const emit = defineEmits(['cerrar'])
const props = defineProps<{
  cancion: Cancion
  origen: OrigenCancion
}>()

const id = ref<string>("")
const delay = ref<number>(0)
if (props.cancion.medias.length > 0) {
  id.value = props.cancion.medias[0].id
  delay.value = props.cancion.medias[0].delay
}
const exid = ref<string>(id.value)
const exlength = ref<number>(props.cancion.medias.length)
const exdelay = ref<number>(delay.value)

function clickCancelarCambiarDatos() {
  if (exlength.value == 0) {
    props.cancion.medias = []    
    emit('cerrar')
    return
  }
  if (props.cancion.medias.length > 0) {
    props.cancion.medias[0].id = exid.value
    props.cancion.medias[0].delay = exdelay.value
    emit('cerrar')
  }
}

function cambiarDatos() {
  
  if (props.cancion.medias.length == 0) {
    const media = new Media("youtube", id.value, delay.value)
    props.cancion.medias.push(media)
  } else {
    props.cancion.medias[0].id = id.value
    props.cancion.medias[0].delay = delay.value
  }
}

function clickOkCambiarDatos() {
  cambiarDatos()
  emit('cerrar')
}

</script>
<template>
  <div class="ctrlEditar">
    <input v-model="id" placeholder="ID de Youtube" @change="cambiarDatos"/>
    <div>
      <button class="lblCabecera" @click="clickOkCambiarDatos">✔️</button>
      <button class="lblCabecera" @click="clickCancelarCambiarDatos">❌</button>
    </div>
    </div>
    
  
</template>
<style scoped>
.ctrlEditar input {
  font-size: large;
}
.ctrlEditar {
  display: flex;
  align-items: center;
}
</style>
