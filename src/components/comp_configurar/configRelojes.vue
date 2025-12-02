<script setup lang="ts">
import RelojControl from './VReloj.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { HelperSincro } from '../../modelo/sincro/HelperSincro'
import type { DelaySet } from '../../modelo/sincro/DelaySet'

defineProps({
  mostrarCerrar: {
    type: Boolean,
    default: false,
  },
})

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
          Segundo Local <RelojControl :fecha="momentoLocal"></RelojControl>Segundo
          Sincronizado
          <RelojControl :fecha="momentoSincro"></RelojControl>
        </div>
      </div>

      <div>
        <div>
          <div style="display: flex; align-items: center">
            🗄️ Diferencia con servidor: {{ Math.floor(delayReloj / 1000) }}s
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
            🔥 Diferencia con RTC: {{ Math.floor(delayRelojRTC / 1000) }}s
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

  </div>
</template>
<style scoped>
/* Contenedor principal con diseño moderno */
.divRelojes {
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.12) 0%, rgba(0, 0, 0, 0.8) 100%);
  border: 1px solid rgba(169, 168, 246, 0.4);
  border-radius: 12px;
  padding: 20px 25px;
  margin: auto;
  width: 100%;
  max-width: 800px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.1);
  font-size: 1.2rem;
  color: #ffffff;
  z-index: 1000;
}

/* Secciones internas */
.divRelojes > div {
  margin-bottom: 15px;
}

.divRelojes > div:last-child {
  margin-bottom: 0;
}

/* Flexbox containers mejorados */
.divRelojes div[style*="display: flex"] {
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

/* Texto de información */
.divRelojes div {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  line-height: 1.4;
}

/* Labels destacados */
.divRelojes > div > div > div:first-child {
  background: rgba(169, 168, 246, 0.1);
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 10px;
  border: 1px solid rgba(169, 168, 246, 0.3);
}

/* Sección de diferencias de tiempo */
.divRelojes > div:nth-child(3) > div > div {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 10px 15px;
  margin: 8px 0;
  border: 1px solid rgba(169, 168, 246, 0.2);
  font-size: 1rem;
}

/* Botones mejorados */
button {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  color: #ffffff;
  padding: 8px 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 3px;
}

button:hover {
  background: linear-gradient(135deg, #a9a8f6 0%, #8b7cf6 100%);
  border-color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(169, 168, 246, 0.3);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(169, 168, 246, 0.2);
}

/* Detalle de cálculo mejorado */
.detalleCalculo {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(169, 168, 246, 0.4);
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  backdrop-filter: blur(3px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.detalleCalculo > div {
  margin: 6px 0;
}

/* Elemento destacado en detalle */
.highlight {
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.3) 0%, rgba(207, 218, 65, 0.2) 100%);
  border: 1px solid #a9a8f6;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 4px 0;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(169, 168, 246, 0.2);
}

.detalleCalculo div:not(.highlight) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 4px;
  padding: 6px 10px;
  margin: 2px 0;
  color: #cbd5e0;
  font-size: 0.95rem;
}

/* Sección de relojes con mejor espaciado */
.divRelojes > div:nth-child(2) > div > div {
  background: rgba(169, 168, 246, 0.08);
  border-radius: 10px;
  padding: 15px;
  margin: 10px 0;
  border: 1px solid rgba(169, 168, 246, 0.25);
}

/* Responsive design */
@media (max-width: 768px) {
  .divRelojes {
    padding: 15px 18px;
    font-size: 1rem;
    margin: 8px 0;
  }
  
  .divRelojes div[style*="display: flex"] {
    gap: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .divRelojes > div:nth-child(3) > div > div {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
  
  button {
    padding: 6px 10px;
    font-size: 1rem;
    min-width: 35px;
    height: 35px;
  }
  
  .detalleCalculo {
    padding: 12px;
    font-size: 0.9rem;
  }
  
  .highlight {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .divRelojes {
    padding: 12px 15px;
    font-size: 0.95rem;
  }
  
  .divRelojes > div:nth-child(3) > div > div {
    font-size: 0.85rem;
    padding: 6px 10px;
  }
  
  button {
    padding: 5px 8px;
    font-size: 0.9rem;
    min-width: 30px;
    height: 30px;
  }
  
  .detalleCalculo {
    padding: 10px;
    font-size: 0.85rem;
  }
  
  .highlight {
    padding: 5px 8px;
    font-size: 0.85rem;
  }
}

/* Animaciones sutiles */
.divRelojes {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efectos hover para secciones */
.divRelojes > div:nth-child(2) > div > div:hover {
  border-color: rgba(169, 168, 246, 0.4);
  background: rgba(169, 168, 246, 0.12);
  transition: all 0.2s ease;
}

.detalleCalculo:hover {
  border-color: rgba(169, 168, 246, 0.6);
  transition: all 0.2s ease;
}
</style>
