<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import RelojControl from './VReloj.vue'
import { ref } from 'vue'
import { Reloj } from '../../modelo/reloj'
import { HelperSincro } from '../../modelo/sincro/HelperSincro'

const emit = defineEmits(['cerrar'])

const appStore = useAppStore()
const helper = HelperSincro.getInstance()

const momentoLocal = ref(0)
const momentoSincro = ref(0)
const actualizandoMomento = ref(false)
const delaySincroReloj = ref(helper.delayReloj)
const ErrorReloj = ref(helper.ErrorReloj)

const delayactualizar = ref(0)

const reloj = new Reloj()
reloj.duracionIntervalo = 1000 // 1 segundo
reloj.setIniciaHandler(() => {
  momentoLocal.value = helper.MomentoLocal()
})
reloj.setIniciaCicloHandler(() => {
  momentoLocal.value = helper.MomentoLocal()
  actualizarDelay()
})

function actualizarDelay() {
  momentoLocal.value = helper.MomentoLocal()
  momentoSincro.value = helper.MomentoSincro()
  delaySincroReloj.value = helper.delayReloj
  ErrorReloj.value = helper.ErrorReloj
  const mili = momentoLocal.value % 1000
  delayactualizar.value = 1000 - mili
  /*
  if (mili < 20) {
    delayactualizar.value = delayactualizar.value - mili
  }*/
  reloj.setDelay(delayactualizar.value)
}

function actualizarMomento() {
  actualizandoMomento.value = true
  reloj.iniciar()
}

function dejarActualizarMomento() {
  actualizandoMomento.value = false
  reloj.pausar()
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
      <div>
        RELOJES
        <div style="display: flex">
          Local <RelojControl :fecha="momentoLocal"></RelojControl> Sincro
          <RelojControl :fecha="momentoSincro"></RelojControl>
        </div>
      </div>

      <div>
        <div style="display: flex">
          <div>
            <button v-if="!actualizandoMomento" @click="actualizarMomento">
              ⌛ Actualizar
            </button>
            <button v-else @click="dejarActualizarMomento">⏸️</button>
          </div>
          <div>
            <button @click="sincronizar">🔄</button>
          </div>
        </div>
        <div>
          <div>Delay: {{ delaySincroReloj }} +/- {{ ErrorReloj }}</div>
          <div>Delay actualizando: {{ delayactualizar }}</div>
        </div>
      </div>
    </div>

    <div
      style="display: flex"
      v-if="appStore.sesSincroCancion.duracionGolpe != 0"
    ></div>
    <div
      style="border: 1px solid"
      v-if="appStore.sesSincroCancion.duracionGolpe != 0"
    >
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
    <div
      style="display: flex"
      v-if="appStore.sesSincroCancion.duracionGolpe != 0"
    >
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
