<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Media } from '../../modelo/cancion/media'

const emit = defineEmits(['cerrar'])
const props = defineProps<{
  cancion: Cancion
}>()

const id = ref<string>('')
const delay = ref<number>(0)
if (props.cancion.medias.length > 0) {
  id.value = props.cancion.medias[0].id
  delay.value = props.cancion.medias[0].delay
}
const duracionGolpe = ref<number>(props.cancion.duracionGolpe * 1000)
const exid = ref<string>(id.value)
const exlength = ref<number>(props.cancion.medias.length)
const exdelay = ref<number>(delay.value)

// Calculo los valores
const delayGolpe = ref<number>(Math.floor(delay.value / duracionGolpe.value))
const sobranteDelay = ref<number>(
  Math.floor(delay.value - delayGolpe.value * duracionGolpe.value),
)

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
  delay.value =
    delayGolpe.value * duracionGolpe.value + sobranteDelay.value
  if (props.cancion.medias.length == 0) {
    const media = new Media('youtube', id.value, delay.value)
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
    <input v-model="id" placeholder="ID de Youtube" @change="cambiarDatos" />


    <div class="itemctrl">
      GOLPES
      <input
        type="number"
        v-model="delayGolpe"
        style="border: 6px; width: 5ch; text-align: right"
        @change="cambiarDatos"
      />
    </div>

    <div class="itemctrl">
      SOBRAN
      <input
        type="number"
        v-model="sobranteDelay"
        style="border: 6px; width: 5ch; text-align: right"
        @change="cambiarDatos"
      /> Ms
    </div>
    <div>
      <button class="lblCabecera" @click="clickOkCambiarDatos">✔️</button>
      <button class="lblCabecera" @click="clickCancelarCambiarDatos">❌</button>
    </div>
  </div>

  <div></div>
</template>
<style scoped>
.ctrlEditar input {
  font-size: large;
}
.ctrlEditar {
  display: flex;
  align-items: center;
}
.contentCompases {
  display: flex;
  align-items: center;
}
.compasDelay {
  font-size: large;
  margin-right: 8px;
  border: 1px solid;
  padding: 5px;
}
</style>
