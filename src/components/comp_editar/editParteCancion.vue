<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import type { Parte } from '../../modelo/cancion/acordes';


const props = defineProps<{
  parte: Parte
  acordes: string[]
  quitando: boolean
  moviendo: boolean
  indexparte: number
}>()
const compaces = ref<string[][]>([]);
function CargarCancion() {
  const ncompaces = []
  for (const acordesStr of props.parte.acordes) {
    // Si acordesStr es un string, lo dividimos por espacios
    if (typeof acordesStr === 'string') {
      ncompaces.push(acordesStr.split(' ').filter(acorde => acorde.trim() !== ''))
    } else if (Array.isArray(acordesStr)) {
      // Si ya es un array, lo usamos directamente
      ncompaces.push(acordesStr)
    }
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
  name: 'EditParteCancion'
})

function handleQuitarOk(parteIndex: number) {
  emit('quitar-ok', parteIndex)
}

const editandoParte = ref(false)
const dragenterAdd = reactive(new Map<string, boolean>())

// Funciones de drag and drop
function onDragStartAcorde(event: DragEvent, nota: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', nota)
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDragEndAcorde() {
  // Limpiar el estado de drag
}

function onDragOverAdd(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onDropAdd(event: DragEvent, compasIndex: number) {
  event.preventDefault()
  const nota = event.dataTransfer?.getData('text/plain')
  if (nota && compaces.value[compasIndex]) {
    // Agregar la nota al compás en la vista
    compaces.value[compasIndex].push(nota)
    actualizarAcordes()
  }
  // Limpiar estado de drag
  dragenterAdd.clear()
}

function onDragEnterAdd(parteIndex: number, compasIndex: number) {
  dragenterAdd.set(`${parteIndex}-${compasIndex}`, true)
}

function onDragLeaveAdd(parteIndex: number, compasIndex: number) {
  dragenterAdd.set(`${parteIndex}-${compasIndex}`, false)
}

// Función para actualizar los acordes en el modelo cuando se cambia en la vista
function actualizarAcordes() {
  for (let i = 0; i < compaces.value.length; i++) {
    if (props.parte.acordes[i] !== undefined) {
      // Siempre guardamos como string separado por espacios
      props.parte.acordes[i] = compaces.value[i].join(' ')
    }
  }
}

// Función para agregar una nueva nota a un compás
function agregarNota(compasIndex: number) {
  if (compaces.value[compasIndex] && props.acordes.length > 0) {
    compaces.value[compasIndex].push(props.acordes[0])
    actualizarAcordes()
  }
}

// Función para finalizar la edición
function finalizarEdicion() {
  actualizarAcordes()
  editandoParte.value = false
}

</script>

<template>
  <div class="clsParte">
    <div
      v-if="!editandoParte"
      @click="editandoParte = true"
    >
      {{ parte.nombre }}

      <button @click="handleQuitarOk(indexparte)" v-if="quitando">
        🗑️ QUITAR
      </button>
    </div>
    <div v-else>
      <div class="editHeader">
        <input v-model="parte.nombre" />
        <button @click="finalizarEdicion()" class="btnGuardar">✓ Guardar</button>
      </div>
      <div class="ctrlMandoEdit">
        <div
          class="notaCompas"
          v-for="nota in acordes"
          :key="nota"
          draggable="true"
          @dragstart="(event) => onDragStartAcorde(event, nota)"
          @dragend="onDragEndAcorde"
        >
          {{ nota }}
        </div>
      </div>
    </div>

    <div class="conteinerCompases">
      <div
        class="conteinerCompas"
        v-for="(compas, compasindex) in compaces"
        :key="compasindex"
      >
        <div class="compas">
          <div
            class="notaCompas"
            v-for="(nota, notindex) in compas"
            :key="notindex"
            draggable="true"
            @dragstart="
              (event) => onDragStartAcorde(event, nota)
            "
            @dragend="onDragEndAcorde"
          >
            <select
              v-model="compaces[compasindex][notindex]"
              v-if="editandoParte"
              @change="actualizarAcordes"
            >
              <option v-for="acorde in acordes" :key="acorde" :value="acorde">
                {{ acorde }}
              </option>
            </select>
            <span
              v-else
              >{{ nota }}</span
            >
          </div>
        </div>
        <div 
          class="btnAgregar"
          @click="agregarNota(compasindex)"
          v-if="editandoParte"
        >
          +
        </div>
        <div
          class="destinoOrdenParte destinoOrdenPartehover"
          v-if="dragenterAdd.get(`${indexparte}-${compasindex}`)"
          @dragover="onDragOverAdd"
          @drop="(event) => onDropAdd(event, compasindex)"
          @dragenter="onDragEnterAdd(indexparte, compasindex)"
          @dragleave="onDragLeaveAdd(indexparte, compasindex)"
        >
          +
        </div>
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

.btnGuardar {
  padding: 5px 10px;
  background: #a9a8f6;
  color: #000;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
}

.btnGuardar:hover {
  background: #c4c3f8;
}

.btnAgregar {
  padding: 4px 8px;
  background: rgba(169, 168, 246, 0.3);
  color: #a9a8f6;
  border: 1px dashed #a9a8f6;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
}

.btnAgregar:hover {
  background: rgba(169, 168, 246, 0.5);
}


</style>