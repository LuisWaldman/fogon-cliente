<script lang="ts" setup>
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { Parte } from '../../modelo/cancion/acordes'
import EditParteCancion from './editParteCancion.vue'
import EditParteCancionSoloLectura from './editParteCancionSoloLectura.vue'

const props = defineProps<{
  cancion: Cancion
  acordesCancion: string[]
}>()

const editandoParte = ref(-1)
function agregar() {
  props.cancion.acordes.partes.push(new Parte('Nueva Parte', []))
}
const quitando = ref(false)
const reordenando = ref(false)

function quitar() {
  editandoParte.value = -1
  quitando.value = !quitando.value
}

function reordenar() {
  editandoParte.value = -1
  reordenando.value = !reordenando.value
}

const dragrandoOrden = ref(false)
const dragenterOrden = ref(false)

function onDragStartOrdenParte(event: DragEvent, indexparte: number) {
  dragrandoOrden.value = true
  event.dataTransfer!.setData('text/plain', indexparte.toString())
}

function onDragEndOrdenParte() {
  dragrandoOrden.value = false
}

function onDragOverParte(event: DragEvent) {
  event.preventDefault()
}

function onDragEnterOrdenParte() {
  dragenterOrden.value = true
}

function onDragLeaveOrdenParte() {
  dragenterOrden.value = false
}

function AlternarParte(parteIndex: number, porParteIndex: number) {
  // No hacer nada si es la misma posición
  if (parteIndex === porParteIndex) {
    return
  }

  // Crear una copia del array de partes para reordenar
  const partesReordenadas = [...props.cancion.acordes.partes]

  // Extraer la parte que se está moviendo
  const parteMovida = partesReordenadas.splice(parteIndex, 1)[0]

  // Insertar en la nueva posición
  partesReordenadas.splice(porParteIndex, 0, parteMovida)

  // Actualizar el array de partes
  props.cancion.acordes.partes = partesReordenadas

  // Crear un mapa de índices antiguos a nuevos índices
  const mapaIndices = new Map<number, number>()

  // Calcular los nuevos índices después del movimiento
  for (let i = 0; i < props.cancion.acordes.partes.length; i++) {
    if (i < Math.min(parteIndex, porParteIndex)) {
      // Índices antes del área afectada no cambian
      mapaIndices.set(i, i)
    } else if (i === porParteIndex) {
      // La nueva posición recibe el índice de la parte movida
      mapaIndices.set(parteIndex, i)
    } else if (parteIndex < porParteIndex) {
      // Moviendo hacia adelante: los índices entre parteIndex y porParteIndex se mueven hacia atrás
      if (i > parteIndex && i <= porParteIndex) {
        mapaIndices.set(i, i - 1)
      } else {
        mapaIndices.set(i, i)
      }
    } else {
      // Moviendo hacia atrás: los índices entre porParteIndex y parteIndex se mueven hacia adelante
      if (i >= porParteIndex && i < parteIndex) {
        mapaIndices.set(i, i + 1)
      } else {
        mapaIndices.set(i, i)
      }
    }
  }

  // Actualizar ordenPartes usando el mapa de índices
  props.cancion.acordes.ordenPartes = props.cancion.acordes.ordenPartes.map(
    (indiceViejo) => {
      return mapaIndices.get(indiceViejo) ?? indiceViejo
    },
  )
}

function onDropOrdenParte(event: DragEvent, targetIndex: number) {
  event.preventDefault()
  const draggedIndex = parseInt(event.dataTransfer!.getData('text/plain'))

  AlternarParte(draggedIndex, targetIndex)

  dragenterOrden.value = false
}
</script>
<template>
  <!-- ESTA REORDENANDO-->
  <div v-if="reordenando">
    <div
      v-for="(parte, indexparte) in cancion.acordes.partes"
      :key="indexparte"
    >
      <div
        class="destinoOrdenParte"
        :class="{ destinoOrdenPartehover: dragenterOrden }"
        v-if="dragrandoOrden"
        @dragover="onDragOverParte"
        @drop="(event) => onDropOrdenParte(event, indexparte)"
        @dragenter="onDragEnterOrdenParte"
        @dragleave="onDragLeaveOrdenParte"
      ></div>
      <div
        reordenando="true"
        draggable="true"
        @dragstart="(event) => onDragStartOrdenParte(event, indexparte)"
        @dragend="onDragEndOrdenParte"
      >
        <EditParteCancionSoloLectura
          :parte="parte"
          :quitando="quitando"
          :reordenando="reordenando"
          :acordes="acordesCancion"
          :indexparte="indexparte"
        />
      </div>
    </div>
    <div
      class="destinoOrdenParte"
      :class="{ destinoOrdenPartehover: dragenterOrden }"
      v-if="dragrandoOrden"
      @dragover="onDragOverParte"
      @drop="(event) => onDropOrdenParte(event, cancion.acordes.partes.length)"
      @dragenter="onDragEnterOrdenParte"
      @dragleave="onDragLeaveOrdenParte"
    ></div>
  </div>

  <!-- NO ESTA REORDENANDO -->
  <div v-if="!reordenando">
    <div
      v-for="(parte, indexparte) in cancion.acordes.partes"
      :key="indexparte"
    >
      <div
        draggable="false"
        @dragstart="(event) => onDragStartOrdenParte(event, indexparte)"
        @dragend="onDragEndOrdenParte"
      >
        <EditParteCancion
          :parte="parte"
          :quitando="quitando"
          :moviendo="reordenando"
          :acordes="acordesCancion"
          :indexparte="indexparte"
        />
      </div>
    </div>
  </div>
  <div>
    <div class="botoneraAcordes">
      <button @click="agregar">🎸 AGREGAR</button>
      <button @click="quitar" :class="{ activo: quitando }">🗑️ QUITAR</button>
      <button @click="reordenar" :class="{ activo: reordenando }">
        ↕️ REORDENAR
      </button>
    </div>
  </div>
</template>
<style scoped>
.destinoOrdenParte {
  border: 1px rgb(225, 226, 168) solid;
  height: 13px;
  background-color: #757061;
}

.destinoOrdenPartehover {
  border: 2px rgb(225, 226, 168) solid;
  height: 13px;
  background-color: #a9a8f6;
}

.notaCompas {
  padding: 4px 8px;
  margin: 2px;
  background: rgba(169, 168, 246, 0.2);
  border-radius: 4px;
  font-weight: 600;
  color: #a9a8f6;
  cursor: pointer;
  transition: background 0.3s ease;
}
td,
th {
  border: 1px solid #a9a8f6;
  padding: 6px;
  text-align: center;
}
.notaPosicionada {
  margin: 3px;
  font-weight: bold;
}
th {
  color: #a9a8f6;
}

/* Modificadores para cabeceras (th) */
th.tonicaprincipal {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #cfda41 100%),
    linear-gradient(to bottom, #cfda41, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

th.tonicarelativa {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #cfda41 100%),
    linear-gradient(to bottom, #ddba59, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

th.subdominante {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #b8651b 100%),
    linear-gradient(to bottom, #d1a442, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

th.dominantesecundaria {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #cc4125 100%),
    linear-gradient(to bottom, #cc4125, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

th.dominante {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #8b0000 100%),
    linear-gradient(to bottom, #8b0000, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

/* Modificadores para celdas (td) */
td.tonicaprincipal {
  background: linear-gradient(to center, rgba(218, 165, 32, 0.1), transparent);
  border: 2px solid #daa520;
}

td.tonicarelativa {
  background: linear-gradient(to center, rgba(184, 134, 11, 0.1), transparent);
  border: 2px solid #b8860b;
}

td.subdominante {
  background: linear-gradient(to center, rgba(210, 105, 30, 0.1), transparent);
  border: 2px solid #b8651b;
}

td.dominantesecundaria {
  background: linear-gradient(to center, rgba(205, 92, 92, 0.1), transparent);
  border: 2px solid #cc4125;
}

td.dominante {
  background: linear-gradient(to center, rgba(160, 82, 45, 0.1), transparent);
  border: 2px solid #8b0000;
}

/* Acordes info styling */
.acordesInfo {
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 8px;
  margin-bottom: 16px;
  color: #a9a8f6;
  font-size: 1rem;
  line-height: 1.4;
}

/* Button Styles - matching previous component style */
.botoneraAcordes {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(169, 168, 246, 0.2);
  flex-wrap: wrap;
}

.botoneraAcordes button {
  padding: 12px 20px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 8px;
  background: rgba(169, 168, 246, 0.1);
  color: #a9a8f6;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  flex: 1;
  min-width: 140px;
}

.botoneraAcordes button:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(169, 168, 246, 0.3);
  color: #fff;
}

.botoneraAcordes button:active {
  transform: translateY(0);
}

.botoneraAcordes button.activo {
  background: rgba(169, 168, 246, 0.4);
  border-color: #a9a8f6;
  color: #fff;
  box-shadow: 0 0 20px rgba(169, 168, 246, 0.6);
  transform: translateY(-1px);
}

.botoneraAcordes button.activo:hover {
  background: rgba(169, 168, 246, 0.5);
  box-shadow: 0 0 25px rgba(169, 168, 246, 0.8);
}

/* Estilos para las partes y compases */
.clsParte {
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  border-left: 4px solid #a9a8f6;
  border-radius: 4px;
}

.clsParte > div:first-child {
  font-size: 1.1rem;
  font-weight: bold;
  color: #a9a8f6;
  margin-bottom: 8px;
}

.conteinerCompases {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: stretch;
}

.compas {
  display: flex;
  min-height: 40px;
  border: 1px solid rgba(169, 168, 246, 0.4);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  align-items: stretch;
  position: relative;
}

/* Compás con acorde entero (simple) */
.compas:has(.parteCompasEntero) {
  min-width: 80px;
  background: rgba(169, 168, 246, 0.1);
  border: 2px solid rgba(169, 168, 246, 0.6);
}

/* Compás con dos mitades (doble) */
.compas:has(.parteCompasMitad) {
  min-width: 120px;
  background: rgba(255, 165, 0, 0.1);
  border: 2px solid rgba(255, 165, 0, 0.6);
}

/* Compás con combinación (cuádruple) */
.compas:has(.parteCompasCuarto) {
  min-width: 160px;
  background: rgba(255, 69, 0, 0.1);
  border: 2px solid rgba(255, 69, 0, 0.6);
}

.parteCompasEntero {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: #a9a8f6;
  background: rgba(169, 168, 246, 0.2);
  border-radius: 2px;
  padding: 8px;
}

.parteCompasMitad {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffb347;
  background: rgba(255, 165, 0, 0.2);
  border-radius: 2px;
  margin: 2px;
  padding: 6px;
  border-right: 1px solid rgba(255, 165, 0, 0.4);
}

.parteCompasMitad:last-child {
  border-right: none;
}

.parteCompasCuarto {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ff6347;
  background: rgba(255, 69, 0, 0.2);
  border-radius: 2px;
  margin: 1px;
  padding: 4px;
  border-right: 1px solid rgba(255, 69, 0, 0.4);
}

.parteCompasCuarto:last-child {
  border-right: none;
}

/* Efectos hover para los acordes */
.parteCompasEntero:hover {
  background: rgba(169, 168, 246, 0.4);
  color: #fff;
}

.parteCompasMitad:hover {
  background: rgba(255, 165, 0, 0.4);
  color: #fff;
}

.parteCompasCuarto:hover {
  background: rgba(255, 69, 0, 0.4);
  color: #fff;
}

/* Responsive design para compases */
@media (max-width: 768px) {
  .conteinerCompases {
    gap: 6px;
  }

  .compas:has(.parteCompasEntero) {
    min-width: 60px;
  }

  .compas:has(.parteCompasMitad) {
    min-width: 100px;
  }

  .compas:has(.parteCompasCuarto) {
    min-width: 140px;
  }

  .parteCompasEntero {
    font-size: 0.9rem;
    padding: 6px;
  }

  .parteCompasMitad {
    font-size: 0.8rem;
    padding: 4px;
  }

  .parteCompasCuarto {
    font-size: 0.7rem;
    padding: 3px;
  }
}

/* Responsive design for buttons */
@media (max-width: 768px) {
  .botoneraAcordes {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }

  .botoneraAcordes button {
    width: 100%;
    font-size: 0.8rem;
    padding: 10px 16px;
    min-width: unset;
  }

  .acordesInfo {
    padding: 12px;
    font-size: 0.9rem;
  }
}
.ctrlMandoEdit {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.conteinerCompas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
