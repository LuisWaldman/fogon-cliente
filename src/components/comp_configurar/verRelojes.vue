<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import RelojControl from './VReloj.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { Reloj } from '../../modelo/reloj'
import { HelperSincro } from '../../modelo/sincro/HelperSincro'
import type { DelaySet } from '../../modelo/sincro/DelaySet'

defineProps({
  mostrarCerrar: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cerrar'])

const appStore = useAppStore()
const helper = HelperSincro.getInstance()

const momentoLocal = ref(0)
const momentoSincro = ref(0)
const actualizandoMomento = ref(false)
const delayReloj = ref(helper.delayReloj)
const ErrorReloj = ref(helper.ErrorReloj)
const SincronizadoRTC = ref(helper.SincronizadoRTC)
const delayRelojRTC = ref(helper.delayRelojRTC)
const ErrorRelojRTC = ref(helper.ErrorRelojRTC)

const delayactualizar = ref(0)

const reloj = new Reloj()
reloj.duracionIntervalo = 1000 // 1 segundo
reloj.setIniciaHandler(() => {
  momentoLocal.value = helper.MomentoLocal()
  momentoSincro.value = helper.MomentoSincro()
})
reloj.setIniciaCicloHandler(() => {
  momentoLocal.value = helper.MomentoLocal()
  actualizarDelay()
})

function actualizarDelay() {
  momentoLocal.value = helper.MomentoLocal()
  momentoSincro.value = helper.MomentoSincro()
  delayReloj.value = helper.delayReloj
  ErrorReloj.value = helper.ErrorReloj
  const mili = momentoSincro.value % 1000
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

onMounted(() => {
  actualizarMomento()
})

onUnmounted(() => {
  dejarActualizarMomento()
})
function dejarActualizarMomento() {
  actualizandoMomento.value = false
  reloj.pausar()
}
const detalleCalculo = ref<DelaySet[]>([])
const verDetalle = ref(false)
function calcularDetalle() {
  verDetalle.value = !verDetalle.value
  if (verDetalle.value) {
    const helper = HelperSincro.getInstance()
    detalleCalculo.value = helper.GetDetalleCalculo()
  }
}

function calcularDetalleRTC() {
  verDetalle.value = !verDetalle.value
  if (verDetalle.value) {
    const helper = HelperSincro.getInstance()
    detalleCalculo.value = helper.GetDetalleCalculoRTC()
  }
}

function sincronizar() {
  const helper = HelperSincro.getInstance()
  helper.ActualizarDelayReloj()
  detalleCalculo.value = helper.GetDetalleCalculo()
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
    <div>
      <div>
        <div style="display: flex">
          Hora Local <RelojControl :fecha="momentoLocal"></RelojControl>Hora
          Sincronizada
          <RelojControl :fecha="momentoSincro"></RelojControl>
        </div>
      </div>

      <div>
        <div>
          <div style="display: flex; align-items: center">
            Diferencia con servidor: {{ Math.floor(delayReloj / 1000) }}s
            {{ (delayReloj % 1000).toFixed(0) }}ms +/-
            {{ ErrorReloj.toFixed(2) }}ms
            <div>
              <button @click="sincronizar">🔄</button>
            </div>
            <div>
              <button @click="calcularDetalle">🔍</button>
            </div>
          </div>

          <div v-if="SincronizadoRTC">
            Diferencia con RTC: {{ Math.floor(delayRelojRTC / 1000) }}s
            {{ (delayRelojRTC % 1000).toFixed(0) }}ms +/-
            {{ ErrorRelojRTC.toFixed(2) }}ms
            <button @click="calcularDetalleRTC">🔍</button>
          </div>
          <div>
            Delay Refresh Pantalla: {{ Math.floor(delayactualizar / 1000) }}s
            {{ (delayactualizar % 1000).toFixed(0) }}ms
          </div>
        </div>
      </div>
    </div>
    <div v-if="verDetalle" class="detalleCalculo">
      <div v-for="(detalleCalculoItem, item) in detalleCalculo" :key="item">
        <div :class="{ highlight: detalleCalculoItem.Seleccionada }">
          Delay en Sincro: {{ detalleCalculoItem.Delay }} RTT:
          {{ detalleCalculoItem.Tardo }}
        </div>
      </div>
    </div>

    <div style="display: flex"></div>
    <div style="border: 1px solid">
      <div>Inicio Cancion</div>
      <div style="display: flex">
        <div>
          <RelojControl
            :fecha="appStore.sesSincroCancion.timeInicio"
          ></RelojControl>
          Desde: {{ appStore.sesSincroCancion.desdeCompas }}
        </div>
      </div>
    </div>

    <div style="display: flex">
      Golpe: {{ appStore.EstadoSincro.compas }} ,
      {{ appStore.EstadoSincro.golpeEnCompas }}, estado:
      {{ appStore.EstadoSincro.estado }} Delay:
      {{ appStore.EstadoSincro.delay.toFixed(2) }} ms
    </div>
    <div v-if="mostrarCerrar">
      <button @click="cerrarRelojes">Cerrar</button>
    </div>
  </div>
</template>
<style scoped>
.highlight {
  background-color: #f0f8ff;
  border: 1px solid #000;
  padding: 5px;
  margin: 2px;
}
.divRelojes {
  padding: 8px;
  width: 95%;
  z-index: 1000;
  font-size: xx-large;
}

.detalleCalculo {
  border: 1px solid;
  padding: 5px;
  margin: 2px;
}

@media (max-width: 768px) {
  .divRelojes {
    font-size: inherit;
  }
}
</style>
