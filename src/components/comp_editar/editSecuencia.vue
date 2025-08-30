<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import { ResumenSecuencia } from '../../modelo/cancion/ResumenSecuencia'
import { helperEditarAcorde } from './helperEditarAcorde'

/*<span @click="click_editarsecuencia(index)" v-if="refEditandoSecuencia != index">🔄</span>
        <span @click="click_Sieditarsecuencia(index)" v-if="refEditandoSecuencia == index">[Si]</span>
        <span @click="click_Noeditarsecuencia(index)" v-if="refEditandoSecuencia == index">[No]</span>
*/

const refAcordesEditando = ref('')
const refEditandoSecuencia = ref(-1)
const refNombreEditando = ref('')
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

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

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
  <div>
    <span v-if="!refActualizandoSecuencia" @click="ActualizarSecuencia"
      >[AGREGAR SECUENCIA]</span
    >
    <span v-if="refActualizandoSecuencia" @click="CancelarActualizarSecuencia"
      >[CANCELAR]</span
    >

    <select v-model="ParteNuevaSecuencia" v-if="refActualizandoSecuencia">
      <option
        v-for="(parteSelect, parteIndex) in cancion.acordes.partes"
        :key="parteIndex"
        :value="parteIndex"
      >
        {{ parteSelect.nombre }}
      </option>
      <option value="-1">Nueva</option>
    </select>
    <span @click="CortarSecuencia" v-if="compas != -1">[CORTAR]</span>
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
        <div>
          <div>
            <select
              v-if="refEditandoSecuencia != index"
              v-model="parte.parteId"
              @change="ClickActualizarSecuencia"
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
            />

            <div class="repeticion">
              x
              <span v-if="resumenSecuencia.parte === index"
                >&nbsp;{{ resumenSecuencia.repeticionparte + 1 }} /</span
              >
              <input
                type="number"
                min="0"
                max="50"
                v-model="parte.cantPartes"
                @change="ClickActualizarSecuencia"
              />
            </div>
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

            <span
              @click="clickEditarsecuencia(index)"
              v-if="refEditandoSecuencia != index"
              >🔄</span
            >
          </div>
          <input
            type="text"
            v-if="refEditandoSecuencia == index"
            v-model="refAcordesEditando"
          />
          <span
            @click="clickSieditarsecuencia()"
            v-if="refEditandoSecuencia == index"
            >[Si]</span
          >
          <span
            @click="clickNoeditarsecuencia()"
            v-if="refEditandoSecuencia == index"
            >[No]</span
          >
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
.read-the-docs {
  color: #888;
}
.acordeSecuencia {
  color: #a9a8f6;
  font-size: var(--tamanio-parte);
  margin-right: 5px;
}
.secuencia {
  font-size: var(--tamanio-parte);
  flex-wrap: wrap;
  border: 1px solid;
  margin: 1px;
  padding: 5px;
  border-radius: 5px;
}
.acordeSeleccionado {
  background-color: #a9a8f6;
  color: black;
}

.ordendiv {
  margin: 1px;
  padding: 5px;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
  margin-right: 10px;
}

.acordediv {
  font-size: var(--tamanio-acorde-parte);
  margin: 1px;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;

  margin-right: 10px;
}

.tituloSecuencia {
  font-size: xx-large;
  color: #a9a8f6;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .ordendiv {
    margin: 2px;
    width: 30px;
    overflow: hidden;
    white-space: nowrap;
  }
  .acordediv {
    margin: 2px;
    padding: 2px;
    width: 40px;
    overflow: hidden;
    white-space: nowrap;
  }
}
.partediv {
  display: flex;
  flex-wrap: wrap;
}

.secuencia_actual {
  background-color: rgb(156, 125, 125);
  color: white;
}

.domi {
  color: #497aff;
}

/*
  Tonica
  color: #a9a8f6;
  Semi Dominante:
  color: blue;
  Dominante
  background-color: red;
*/
.repeticion {
  display: inline-block;
  margin: 4px;
}
.acordesPantalla {
  border: 1px solid;
  padding: 10px;
  border-radius: 2%;
}

.tituloSecuencia {
  color: #a9a8f6;
  margin-top: 10px;
}
.agregarSecuencia {
  width: 20px;
  height: 100%;
}
</style>
