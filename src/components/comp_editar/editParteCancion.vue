<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Parte } from '../../modelo/cancion/acordes'

const props = defineProps<{
  parte: Parte
  acordes: string[]
  quitando: boolean
  moviendo: boolean
  indexparte: number
}>()
const compaces = ref<string[][]>([])
function CargarCancion() {
  const ncompaces = []
  for (const acordesStr of props.parte.acordes) {
    ncompaces.push(acordesStr.split(' '))
  }
  compaces.value = ncompaces
}

onMounted(() => {
  CargarCancion()
})

const emit = defineEmits<{
  'quitar-ok': [parteIndex: number]
}>()

defineOptions({
  name: 'EditParteCancion',
})

function handleQuitarOk(parteIndex: number) {
  emit('quitar-ok', parteIndex)
}

const editandoParte = ref(false)

// Función para manejar cambios en el combo de notas
function manejarCambioNota(
  event: Event,
  compasIndex: number,
  notaIndex: number,
) {
  const target = event.target as HTMLSelectElement
  const nuevoValor = target.value

  if (nuevoValor === 'borrar') {
    // Borrar la nota del compás
    compaces.value[compasIndex].splice(notaIndex, 1)

    // Si el compás quedó vacío, borrarlo también
    if (compaces.value[compasIndex].length === 0) {
      compaces.value.splice(compasIndex, 1)
    }
  }
  // Reamar props.parte.acordes
  props.parte.acordes = compaces.value.map((compas) => compas.join(' '))
}

// Función para finalizar la edición
function finalizarEdicion() {
  editandoParte.value = false
}
onMounted(() => {
  CargarCancion()
})

const agregandoAcorde = ref('acorde')
function actualizarParteAcorde() {
  props.parte.acordes = compaces.value.map((compas) => compas.join(' '))
}

function agregarAcordeaCompas(compasIndex: number, notaIndex?: number) {
  if (notaIndex !== undefined) {
    // Insertar en posición específica dentro del compás
    compaces.value[compasIndex].splice(notaIndex, 0, agregandoAcorde.value)
  } else {
    // Agregar al final del compás
    compaces.value[compasIndex].push(agregandoAcorde.value)
  }
  actualizarParteAcorde()
}

function agregarCompas(compasIndex?: number) {
  const nuevoCompas = [agregandoAcorde.value]
  if (compasIndex !== undefined) {
    // Insertar en posición específica
    compaces.value.splice(compasIndex, 0, nuevoCompas)
  } else {
    // Agregar al final
    compaces.value.push(nuevoCompas)
  }
  actualizarParteAcorde()
}

// Funciones para drag and drop
function onDragStart(event: DragEvent, nota: string) {
  agregandoAcorde.value = nota
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', nota)
    event.dataTransfer.effectAllowed = 'copy'
  }
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

function onDropNuevoCompas(event: DragEvent, compasIndex?: number) {
  event.preventDefault()
  agregarCompas(compasIndex)
}

function onDropIntoCompas(
  event: DragEvent,
  compasIndex: number,
  notaIndex?: number,
) {
  event.preventDefault()
  agregarAcordeaCompas(compasIndex, notaIndex)
}

const agregarAcordes = ref(false)
</script>

<template>
  <div class="clsParte">
    <div v-if="!editandoParte" class="parteHeader">
      <span class="parteNombre">{{ parte.nombre }}</span>
      <div class="botonesAccion">
        <button @click="editandoParte = true" class="btnEditar">
          ✏️ EDITAR
        </button>
        <button
          @click="handleQuitarOk(indexparte)"
          v-if="quitando"
          class="btnQuitar"
        >
          🗑️ QUITAR
        </button>
      </div>
    </div>
    <div v-else>
      <div class="editHeader">
        <input v-model="parte.nombre" />
        <button @click="finalizarEdicion()" class="btnGuardar">✓ Listo</button>
      </div>
      <div class="ctrlMandoEdit">
        <button
          @click="agregarAcordes = true"
          v-if="!agregarAcordes"
          class="btnGuardar"
        >
          + ACORDES
        </button>
        <button
          @click="agregarAcordes = false"
          v-if="agregarAcordes"
          class="btnGuardar"
        >
          ✓ Listo
        </button>
        <div v-if="agregarAcordes" style="display: flex">
          <div
            class="notaCompas"
            v-for="nota in acordes"
            :key="nota"
            draggable="true"
            @dragstart="onDragStart($event, nota)"
          >
            {{ nota }}
          </div>
        </div>
      </div>
    </div>

    <div class="conteinerCompases">
      <div
        class="conteinerCompas"
        v-for="(compas, compasindex) in compaces"
        :key="compasindex"
      >
        <div
          v-if="agregarAcordes"
          class="nuevoCompas"
          @dragover="onDragOver"
          @drop="onDropNuevoCompas($event, compasindex)"
        >
          +
        </div>
        <div class="compas">
          <div
            class="notaContainer"
            v-for="(nota, notindex) in compas"
            :key="notindex"
          >
            <div
              v-if="agregarAcordes"
              class="intoCompas"
              @dragover="onDragOver"
              @drop="onDropIntoCompas($event, compasindex, notindex)"
            >
              +
            </div>
            <div class="notaCompas">
              <select
                v-model="compaces[compasindex][notindex]"
                v-if="editandoParte"
                @change="manejarCambioNota($event, compasindex, notindex)"
              >
                <option v-for="acorde in acordes" :key="acorde" :value="acorde">
                  {{ acorde }}
                </option>
                <option value="borrar">🗑️</option>
              </select>
              <span v-else>{{ nota }}</span>
            </div>
          </div>
          <div
            v-if="agregarAcordes"
            class="intoCompas"
            @dragover="onDragOver"
            @drop="onDropIntoCompas($event, compasindex)"
          >
            +
          </div>
        </div>
      </div>
      <div
        v-if="agregarAcordes"
        class="nuevoCompas"
        @dragover="onDragOver"
        @drop="onDropNuevoCompas($event)"
      >
        +
      </div>
    </div>
  </div>
</template>

<style scoped>
.destinoOrdenParte {
  border: 1px rgb(225, 226, 168) solid;
  height: 7px;
  background-color: #757061;
}

.destinoOrdenPartehover {
  border: 2px rgb(225, 226, 168) solid;
  height: 9px;
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

.editHeader {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.editHeader input {
  flex: 1;
  padding: 5px;
  border: 1px solid #a9a8f6;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.7);
  color: #a9a8f6;
}

/* Estilos para el header de la parte */
.parteHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.parteNombre {
  font-size: 1.1rem;
  font-weight: bold;
  color: #a9a8f6;
}

.botonesAccion {
  display: flex;
  gap: 8px;
}

/* Estilos de botones copiados del contenedor */
.btnEditar,
.btnGuardar,
.btnQuitar,
.btnAgregar {
  padding: 8px 16px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 6px;
  background: rgba(169, 168, 246, 0.1);
  color: #a9a8f6;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(10px);
}

.btnEditar:hover,
.btnGuardar:hover,
.btnQuitar:hover,
.btnAgregar:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.3);
  color: #fff;
}

.btnEditar:active,
.btnGuardar:active,
.btnQuitar:active,
.btnAgregar:active {
  transform: translateY(0);
}

/* Estilos específicos para cada tipo de botón */
.btnGuardar {
  background: rgba(169, 168, 246, 0.3);
  border-color: #a9a8f6;
}

.btnGuardar:hover {
  background: rgba(169, 168, 246, 0.4);
  box-shadow: 0 0 15px rgba(169, 168, 246, 0.5);
}

.btnQuitar {
  background: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.5);
  color: #dc3545;
}

.btnQuitar:hover {
  background: rgba(220, 53, 69, 0.2);
  border-color: rgba(220, 53, 69, 0.8);
  color: #fff;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.btnAgregar {
  border: 1px dashed #a9a8f6;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notaContainer {
  display: flex;
}

/* Estilos para elementos de agregar acordes */
.intoCompas {
  padding: 4px 8px;
  margin: 2px;
  background: rgba(169, 168, 246, 0.1);
  border: 1px dashed rgba(169, 168, 246, 0.3);
  border-radius: 4px;
  color: #a9a8f6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
  font-size: 0.9rem;
  user-select: none;
}

.intoCompas:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.6);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.2);
}

.intoCompas:active {
  transform: scale(0.95);
}

.nuevoCompas {
  padding: 8px 12px;
  margin: 4px;
  background: rgba(169, 168, 246, 0.08);
  border: 2px dashed rgba(169, 168, 246, 0.4);
  border-radius: 6px;
  color: #a9a8f6;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  font-size: 1.2rem;
  user-select: none;
  backdrop-filter: blur(5px);
}

.nuevoCompas:hover {
  background: rgba(169, 168, 246, 0.15);
  border-color: rgba(169, 168, 246, 0.7);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(169, 168, 246, 0.3);
}

.nuevoCompas:active {
  transform: translateY(0) scale(0.98);
}
</style>
