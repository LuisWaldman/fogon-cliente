<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import RelojControl from './VReloj.vue'
import { ref } from 'vue'
import { Reloj } from '../../modelo/reloj'
import { HelperSincro } from '../../modelo/sincro/HelperSincro'

const emit = defineEmits(['cerrar'])

const appStore = useAppStore()
const helper = HelperSincro.getInstance()

const momentoactual = ref(new Date())
const actualizandoMomento = ref(false)
const actualizandoDelay = ref(false)
const delayactualizar = ref(0)


const reloj = new Reloj()
reloj.duracionIntervalo = 1000 // 1 segundo
reloj.setIniciaHandler(() => {
  momentoactual.value = helper.ObtenerMomento()
})
reloj.setIniciaCicloHandler(() => {
  momentoactual.value = helper.ObtenerMomento()
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
function sincronizar() {
    const helper = HelperSincro.getInstance()
    helper.ActualizarDelayReloj()

} 

function cerrarRelojes() {
  reloj.pausar()
  emit('cerrar')
}
</script>

<template>
  <div class="divRelojes">
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <h3>RELOJES</h3>
    </div>
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
          <button @click="sincronizar">🔄</button> {{ appStore.estadoConexion}}
        </div>
        <div>{{ delayactualizar }}</div>
      </div>
    </div>

    <div style="display: flex"  v-if="appStore.sesSincroCancion.duracionGolpe != 0">
      Calcula Inicio:
      <RelojControl :fecha="appStore.momentoRecibioInicio"></RelojControl>
    </div>
    <div style="border: 1px solid" v-if="appStore.sesSincroCancion.duracionGolpe != 0">
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
    <div style="display: flex"  v-if="appStore.sesSincroCancion.duracionGolpe != 0">
      Golpe: {{ appStore.EstadoSincro.compas }} ,
      {{ appStore.EstadoSincro.golpeEnCompas }}, estado:
      {{ appStore.EstadoSincro.estado }} Delay:
      {{ appStore.EstadoSincro.delay }} ms
    </div>
    <div>
      <button @click="cerrarRelojes">Cerrar</button>
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
