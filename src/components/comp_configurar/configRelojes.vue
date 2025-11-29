<script setup lang="ts">
import RelojControl from './VReloj.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { HelperSincro } from '../../modelo/sincro/HelperSincro'
import type { DelaySet } from '../../modelo/sincro/DelaySet'
import { SincroSesion } from '../../modelo/sincro/SincroSesion'
import { EstadoSincroCancion } from '../../modelo/sincro/EstadoSincroCancion'

defineProps({
  mostrarCerrar: {
    type: Boolean,
    default: false,
  },
})

const helper = HelperSincro.getInstance()

const sesSincroCancion = ref<SincroSesion>(new SincroSesion(0, 0))
const EstadoSincro = ref<EstadoSincroCancion>(
  new EstadoSincroCancion(-1, 0, '-', 0),
)

const momentoLocal = ref(0)
const momentoSincro = ref(0)
const actualizandoMomento = ref(false)
const delayReloj = ref(helper.delayReloj)
const ErrorReloj = ref(helper.ErrorReloj)
const SincronizadoRTC = ref(helper.SincronizadoRTC)
const delayRelojRTC = ref(helper.delayRelojRTC)
const ErrorRelojRTC = ref(helper.ErrorRelojRTC)

const delayactualizar = ref(0)

momentoLocal.value = helper.MomentoLocal()
momentoSincro.value = helper.MomentoSincro()

let rafId: number | null = null

async function EmpezarLoop() {
  // reset counter when starting
  const loop = async () => {
    // stop if state changed
    actualizarDelay()
    rafId = requestAnimationFrame(loop)
  }
  // avoid multiple loops
  if (rafId == null) {
    rafId = requestAnimationFrame(loop)
  }
}

function PararLoop() {
  if (rafId != null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

onUnmounted(() => {
  PararLoop()
})

function actualizarDelay() {
  const momentosincroActual = helper.MomentoSincro()
  if (
    Math.floor(momentosincroActual / 1000) ===
    Math.floor(momentoSincro.value / 1000)
  ) {
    return
  }
  momentoLocal.value = helper.MomentoLocal()
  momentoSincro.value = helper.MomentoSincro()
  delayReloj.value = helper.delayReloj
  ErrorReloj.value = helper.ErrorReloj
  const mili = momentoSincro.value % 1000
  delayactualizar.value = mili
  /*
  if (mili < 20) {
    delayactualizar.value = delayactualizar.value - mili
  }*/
}

function actualizarMomento() {
  actualizandoMomento.value = true
}

onMounted(() => {
  actualizarMomento()
  EmpezarLoop()
})

onUnmounted(() => {
  dejarActualizarMomento()
})
function dejarActualizarMomento() {
  actualizandoMomento.value = false
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
          <RelojControl :fecha="sesSincroCancion.timeInicio"></RelojControl>
          Desde: {{ sesSincroCancion.desdeCompas }}
        </div>
      </div>
    </div>

    <div style="display: flex">
      Golpe: {{ EstadoSincro.compas }} , {{ EstadoSincro.golpeEnCompas }},
      estado: {{ EstadoSincro.estado }} Delay:
      {{ EstadoSincro.delay.toFixed(2) }} ms
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
