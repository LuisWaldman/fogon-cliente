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
    ></div>
    <div style="display: flex">
      <div>
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
          <div>
            Delay en Sincro: {{ Math.floor(delaySincroReloj / 1000) }}s
            {{ (delaySincroReloj % 1000).toFixed(0) }}ms +/-
            {{ ErrorReloj.toFixed(2) }}ms
          </div>
          <div>
            Delay actualizando: {{ Math.floor(delayactualizar / 1000) }}s
            {{ (delayactualizar % 1000).toFixed(0) }}ms
          </div>
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
    <div>Inicio Cancion</div>
      <div style="display: flex">
        
        <div>
        
        <RelojControl
          :fecha="appStore.sesSincroCancion.timeInicio"
        ></RelojControl>
        Desde: {{ appStore.sesSincroCancion.desdeCompas }} 
        </div>
        <div>
        Duracion Compas : {{ appStore.sesSincroCancion.duracionGolpe.toFixed(2) }} ms x {{ appStore.sesSincroCancion.golpesxcompas }} golpes = 
        {{  (appStore.sesSincroCancion.duracionGolpe * appStore.sesSincroCancion.golpesxcompas).toFixed(2) }} ms  
      </div>
      </div>
    </div>


    <div
      style="display: flex"
      v-if="appStore.sesSincroCancion.duracionGolpe != 0"
    >
      Golpe: {{ appStore.EstadoSincro.compas }} ,
      {{ appStore.EstadoSincro.golpeEnCompas }}, estado:
      {{ appStore.EstadoSincro.estado }} Delay:
      {{ appStore.EstadoSincro.delay.toFixed(2) }} ms
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
