<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import { ResumenSecuencia } from '../../modelo/cancion/ResumenSecuencia'
import { helperEditarAcorde } from './helperEditarAcorde'
const refAcordesEditando = ref('')
const refEditandoSecuencia = ref(-1)
const refNombreEditando = ref('')

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

function clickEditarsecuencia(index: number) {
  refEditandoSecuencia.value = index
  const editandoParte = resumenSecuencia.value?.resumenPartes[index].parteId
  refNombreEditando.value = props.cancion.acordes.partes[editandoParte].nombre
  refAcordesEditando.value = helperEditarAcorde.AcordesToRenglon(
    props.cancion.acordes.partes[editandoParte].acordes,
  )
}

function clickSieditarsecuencia() {
  const editandoParte =
    resumenSecuencia.value?.resumenPartes[refEditandoSecuencia.value].parteId
  props.cancion.acordes.partes[editandoParte].acordes =
    helperEditarAcorde.RenglonToAcordes(refAcordesEditando.value)
  refEditandoSecuencia.value = -1
  emit('cambioCompas', props.compas)
}

function clickNoeditarsecuencia() {
  refEditandoSecuencia.value = -1
}

const emit = defineEmits(['cambioCompas'])
function cambiarCompas(compas: number) {
  emit('cambioCompas', compas)
  //currentCompas.value = compas
}

const resumenSecuencia = ref<ResumenSecuencia>(
  ResumenSecuencia.GetResumen(props.cancion),
)

function Actualizar(cancion: Cancion) {
  if (cancion == undefined) {
    cancion = props.cancion
  }
  resumenSecuencia.value = ResumenSecuencia.GetResumen(cancion)
}

onMounted(() => {
  Actualizar(props.cancion)
})

watch(
  () => props.cancion,
  (newCancion) => {
    Actualizar(newCancion)
  },
)

watch(
  () => props.compas,
  (newCompas) => {
    resumenSecuencia.value?.ActualizarCompas(newCompas)
  },
)

let actualizadoAsk = false
function Actualizado() {
  if (actualizadoAsk) {
    actualizadoAsk = true
    Actualizar(props.cancion)
  }

  return false
}
function ClickActualizarSecuencia() {
  resumenSecuencia.value?.SetCancion(props.cancion)
  Actualizar(props.cancion)
  cambiarCompas(props.compas)
}
Actualizar(props.cancion)
const refActualizandoSecuencia = ref(false)
function ActualizarSecuencia() {
  refActualizandoSecuencia.value = true
}

function CancelarActualizarSecuencia() {
  refActualizandoSecuencia.value = false
}

const ParteNuevaSecuencia = ref(0)
function clickAgregarSecuencia(index: number) {
  resumenSecuencia.value?.AgregarSecuencia(
    props.cancion,
    index,
    ParteNuevaSecuencia.value,
  )
  refActualizandoSecuencia.value = false
  Actualizar(props.cancion)
}
function CortarSecuencia() {
  resumenSecuencia.value?.ActualizarCompas(props.compas)
  resumenSecuencia.value?.CortarSecuencia(props.cancion)
  refActualizandoSecuencia.value = false
  Actualizar(props.cancion)
}

defineExpose({ Actualizar })
</script>

<template>
  <div v-if="Actualizado()" @click="Actualizar(props.cancion)">
    .. No cargada ..
  </div>
  <div class="botoneraSecuencia">
    <button v-if="!refActualizandoSecuencia" @click="ActualizarSecuencia" class="btnAccion">
      ➕ AGREGAR SECUENCIA
    </button>
    <button
      v-if="refActualizandoSecuencia"
      @click="CancelarActualizarSecuencia"
      class="btnCancelar"
    >
      ❌ CANCELAR
    </button>

    <select v-model="ParteNuevaSecuencia" v-if="refActualizandoSecuencia" class="selectParte">
      <option
        v-for="(parteSelect, parteIndex) in cancion.acordes.partes"
        :key="parteIndex"
        :value="parteIndex"
      >
        {{ parteSelect.nombre }}
      </option>
    </select>
    <button @click="CortarSecuencia" v-if="compas != -1" class="btnCortar">✂️ CORTAR</button>
  </div>
  <div style="display: flex; flex-wrap: wrap">
    <div
      class="secuencia agregarSecuencia"
      v-if="refActualizandoSecuencia"
      @click="clickAgregarSecuencia(-1)"
    >
      +
    </div>

    <div
      v-for="(parte, index) in resumenSecuencia.resumenPartes"
      :key="index"
      style="display: flex"
    >
      <div
        class="secuencia"
        :class="{
          secuencia_actual: resumenSecuencia.parte === index,
        }"
      >
        <div class="parteHeader">
          <div class="parteSelector">
            <select
              v-if="refEditandoSecuencia != index"
              v-model="parte.parteId"
              @change="ClickActualizarSecuencia"
              class="selectParte"
            >
              <option
                v-for="(parteSelect, parteIndex) in cancion.acordes.partes"
                :key="parteIndex"
                :value="parteIndex"
              >
                {{ parteSelect.nombre }}
              </option>
            </select>
            <input
              type="text"
              v-if="refEditandoSecuencia == index"
              v-model="refNombreEditando"
              class="inputNombre"
            />
          </div>
          <div class="ordendiv" v-if="refEditandoSecuencia !== index">
            <span
              class="acordeSecuencia"
              v-for="(acorde, acordeIndex) in cancion.acordes.partes[
                parte.parteId
              ].acordes"
              :key="acordeIndex"
              :class="{
                acordeSeleccionado:
                  resumenSecuencia.compasdeparte === acordeIndex &&
                  resumenSecuencia.parte === index,
              }"
            >
              {{ acorde }}
            </span>

            
            <div class="repeticion">
              <span class="repeticionLabel">x</span>
              <span v-if="resumenSecuencia.parte === index" class="repeticionActual">
                {{ resumenSecuencia.repeticionparte + 1 }} /
              </span>
              <input
                type="number"
                min="0"
                max="50"
                v-model="parte.cantPartes"
                @change="ClickActualizarSecuencia"
                class="inputRepeticion"
              />
            </div>
          </div>
          <div v-if="refEditandoSecuencia == index" class="editandoAcordes">
            <input
              type="text"
              v-model="refAcordesEditando"
              class="inputAcordes"
              placeholder="Ingrese acordes separados por espacios"
            />
            <div class="botonesEdicion">
              <button
                @click="clickSieditarsecuencia()"
                class="btnGuardar"
              >
                ✓ Guardar
              </button>
              <button
                @click="clickNoeditarsecuencia()"
                class="btnCancelar"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="secuencia agregarSecuencia"
        @click="clickAgregarSecuencia(index)"
        v-if="refActualizandoSecuencia"
      >
        +
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Botonera principal */
.botoneraSecuencia {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(169, 168, 246, 0.2);
  flex-wrap: wrap;
  margin-bottom: 16px;
}

/* Botones principales */
.btnAccion,
.btnCancelar,
.btnCortar,
.btnGuardar,
.btnEditarPequeno {
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

.btnAccion:hover,
.btnCancelar:hover,
.btnCortar:hover,
.btnGuardar:hover,
.btnEditarPequeno:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(169, 168, 246, 0.3);
  color: #fff;
}

.btnAccion:active,
.btnCancelar:active,
.btnCortar:active,
.btnGuardar:active,
.btnEditarPequeno:active {
  transform: translateY(0);
}

/* Botón pequeño de editar */
.btnEditarPequeno {
  padding: 6px 10px;
  min-width: 40px;
  font-size: 0.8rem;
}

/* Botón de guardar */
.btnGuardar {
  background: rgba(169, 168, 246, 0.3);
  border-color: #a9a8f6;
}

.btnGuardar:hover {
  background: rgba(169, 168, 246, 0.4);
  box-shadow: 0 0 15px rgba(169, 168, 246, 0.5);
}

/* Botón de cancelar */
.btnCancelar {
  background: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.5);
  color: #dc3545;
}

.btnCancelar:hover {
  background: rgba(220, 53, 69, 0.2);
  border-color: rgba(220, 53, 69, 0.8);
  color: #fff;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

/* Botón de cortar */
.btnCortar {
  background: rgba(255, 165, 0, 0.1);
  border-color: rgba(255, 165, 0, 0.5);
  color: #ffa500;
}

.btnCortar:hover {
  background: rgba(255, 165, 0, 0.2);
  border-color: rgba(255, 165, 0, 0.8);
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 165, 0, 0.3);
}

/* Select y inputs */
.selectParte {
  padding: 8px 12px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.7);
  color: #a9a8f6;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  min-width: 120px;
}

.selectParte:focus {
  border-color: #a9a8f6;
  outline: none;
  box-shadow: 0 0 10px rgba(169, 168, 246, 0.3);
}

.inputNombre,
.inputAcordes {
  padding: 8px 12px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.7);
  color: #a9a8f6;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  width: 100%;
}

.inputNombre:focus,
.inputAcordes:focus {
  border-color: #a9a8f6;
  outline: none;
  box-shadow: 0 0 10px rgba(169, 168, 246, 0.3);
}

.inputRepeticion {
  padding: 4px 8px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: #a9a8f6;
  font-size: 0.8rem;
  width: 60px;
  text-align: center;
}

.inputRepeticion:focus {
  border-color: #a9a8f6;
  outline: none;
}

/* Contenedor principal de secuencias */
.secuencia {
  margin: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(169, 168, 246, 0.4);
  border-radius: 8px;
  min-width: 200px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.secuencia:hover {
  border-color: rgba(169, 168, 246, 0.6);
  box-shadow: 0 4px 12px rgba(169, 168, 246, 0.2);
}

.secuencia_actual {
  background: rgba(169, 168, 246, 0.2);
  border: 2px solid #a9a8f6;
  box-shadow: 0 0 20px rgba(169, 168, 246, 0.4);
}

/* Header de cada parte */
.parteHeader {
  margin-bottom: 12px;
}

.parteSelector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

/* Acordes de la secuencia */
.ordendiv {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
}

.acordeSecuencia {
  padding: 4px 8px;
  margin: 2px;
  background: rgba(169, 168, 246, 0.2);
  border-radius: 4px;
  font-weight: 600;
  color: #a9a8f6;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.acordeSecuencia:hover {
  background: rgba(169, 168, 246, 0.3);
  transform: translateY(-1px);
}

.acordeSeleccionado {
  background: #a9a8f6;
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(169, 168, 246, 0.5);
}

/* Repeticiones */
.repeticion {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(169, 168, 246, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(169, 168, 246, 0.3);
}

.repeticionLabel {
  font-weight: bold;
  color: #a9a8f6;
  font-size: 0.9rem;
}

.repeticionActual {
  color: #fff;
  font-weight: bold;
  background: rgba(169, 168, 246, 0.3);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.8rem;
}

/* Botón agregar secuencia */
.agregarSecuencia {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  min-height: 80px;
  margin: 8px;
  background: rgba(169, 168, 246, 0.1);
  border: 2px dashed rgba(169, 168, 246, 0.4);
  border-radius: 8px;
  color: #a9a8f6;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.agregarSecuencia:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.7);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(169, 168, 246, 0.3);
}

/* Contenedor de edición de acordes */
.editandoAcordes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.botonesEdicion {
  display: flex;
  gap: 8px;
}

.botonesEdicion button {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .botoneraSecuencia {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }

  .botoneraSecuencia button {
    width: 100%;
    font-size: 0.8rem;
    padding: 10px 16px;
    min-width: unset;
  }

  .secuencia {
    margin: 6px;
    padding: 10px;
    min-width: 150px;
  }

  .ordendiv {
    gap: 4px;
    padding: 6px;
  }

  .acordeSecuencia {
    font-size: 0.8rem;
    padding: 3px 6px;
  }

  .parteSelector {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .botonesEdicion {
    flex-direction: column;
  }
}

/* Títulos */
.tituloSecuencia {
  font-size: 1.5rem;
  color: #a9a8f6;
  margin: 16px 0;
  font-weight: bold;
}
</style>
