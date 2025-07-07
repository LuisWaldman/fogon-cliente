<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import RelojControl from './VReloj.vue'
import { ref } from 'vue'
import { Reloj } from '../../modelo/reloj'

const appStore = useAppStore()

const momentoactual = ref(new Date())
const actualizandoMomento = ref(false)
const actualizandoDelay = ref(false)
const delayactualizar = ref(0)

const reloj = new Reloj()
reloj.duracionIntervalo = 1000 // 1 segundo
reloj.setIniciaHandler(() => {
  momentoactual.value = new Date()
})
reloj.setIniciaCicloHandler(() => {
  momentoactual.value = new Date()
  actualizarDelay()
})

function actualizarMomento() {
  actualizandoMomento.value = true
  reloj.iniciar()
}

function dejarActualizarMomento() {
  actualizandoMomento.value = false
  reloj.pausar()
}
function actualizarDelay() {
  actualizandoDelay.value = true
  const mili = momentoactual.value.getMilliseconds()
  delayactualizar.value = 1000 - mili
  if (mili < 20) {
    delayactualizar.value = delayactualizar.value - mili
  }
  reloj.setDelay(delayactualizar.value)
  actualizandoDelay.value = false
}
actualizarMomento()
</script>

<template>
  <div class="divRelojes">
    <h3>RELOJES</h3>
    <div style="display: flex">
      <div style="display: flex">
        Momento Actual: <RelojControl :fecha="momentoactual"></RelojControl>
      </div>
      <div>
        <div>
          <button v-if="!actualizandoMomento" @click="actualizarMomento">
            ⌛
          </button>
          <button v-else @click="dejarActualizarMomento">⏸️</button>
        </div>
        <div>{{ delayactualizar }}</div>
      </div>
    </div>

    <div style="display: flex">
      Recibio Inicio:
      <RelojControl :fecha="appStore.momentoRecibioInicio"></RelojControl>
    </div>
    <div style="border: 1px solid">
      <div style="display: flex">
        Inicio Sesion:
        <RelojControl
          :fecha="appStore.sesSincroCancion.timeInicio"
        ></RelojControl>
        , Duracion: {{ appStore.sesSincroCancion.duracionGolpe }}
      </div>
      <div style="display: flex">
        Desde: {{ appStore.sesSincroCancion.desdeCompas }} , Golpes x compás:
        {{ appStore.sesSincroCancion.golpesxcompas }}
      </div>
    </div>
    <div style="display: flex">
      Golpe: {{ appStore.EstadoSincro.compas }} ,
      {{ appStore.EstadoSincro.golpeEnCompas }}, estado:
      {{ appStore.EstadoSincro.estado }} Delay:
      {{ appStore.EstadoSincro.delay }} ms
    </div>
  </div>
</template>
<style scoped>
.divRelojes {
  position: absolute;
  left: 10%;
  top: 20%;
  font-size: 2em;
  padding: 8px;
  border-radius: 10px;
  z-index: 1000;
  backdrop-filter: blur(2px);
  border: 3px solid #8b4513;
}
</style>
