<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import renglonpentagrama from '../comp_tocar/Tocar_renglonPentagrama.vue'
import { DisplaySistemaPentagrama } from '../../modelo/pentagrama/DisplaySistemaPentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { HelperEditPentagrama } from '../../modelo/pentagrama/editPentagrama/helperEditCompasPentagrama'
import { EditCompasPentagrama } from '../../modelo/pentagrama/editPentagrama/editCompasPentagrama'
import { EditAcordePentagrama } from '../../modelo/pentagrama/editPentagrama/editAcordePentagrama'

const emit = defineEmits(['actualizoPentagrama'])
const props = defineProps<{
  pentagramaId: number
  cancion: Cancion
  compas: number
}>()

/* DISPLAY */
const refDisplayPentagrama = ref<DisplaySistemaPentagrama>(
  DisplaySistemaPentagrama.GetDefault(),
)
const helpPenta = new HelperPentagramas()
const CtrlrenglonPentagrama = ref()

/**/

const refCompasEnPentagrama = ref(
  props.cancion.pentagramas[props.pentagramaId].compases[props.compas],
)
const editorDisplay = ref<EditCompasPentagrama>(new EditCompasPentagrama())

const editandoRitmo = ref(-1)
const puedeUnirPrev = ref(false)
const puedeUnirPost = ref(false)
const puedeDivider = ref(false)

function clickEditarRitmo(indice: number) {
  editandoRitmo.value = indice
  puedeUnirPrev.value = indice > 0
  puedeUnirPost.value = indice < editorDisplay.value.ritmo.length - 1
  puedeDivider.value = editorDisplay.value.ritmo[indice] < 16
}

const helper = new HelperEditPentagrama()
const refEsBatera = ref(false)
function Actualizar() {
  refCompasEnPentagrama.value =
    props.cancion.pentagramas[props.pentagramaId].compases[props.compas]

  if (refCompasEnPentagrama.value) {
    refEsBatera.value = props.cancion.pentagramas[
      props.pentagramaId
    ].instrumento
      .toLowerCase()
      .includes('batería')
    editorDisplay.value = helper.getDisplayEditCompas(
      refCompasEnPentagrama.value,
    )
    DibujarMuestra()
  }
}
function DibujarMuestra() {
  refDisplayPentagrama.value.pentagramas[0].clave =
    props.cancion.pentagramas[props.pentagramaId].clave
  refDisplayPentagrama.value.pentagramas[0].compases[0] =
    helpPenta.creaCompasPentagrama(refCompasEnPentagrama.value, 0)
  CtrlrenglonPentagrama.value.Dibujar()
}

onMounted(() => {
  Actualizar()
})

watch(
  () => props.compas,
  () => {
    Actualizar()
  },
)

watch(
  () => props.pentagramaId,
  () => {
    Actualizar()
  },
)
function clickPatron(aIndex: number, rIndex: number) {
  const val = editorDisplay.value.patron[rIndex][aIndex]
  if (val) {
    editorDisplay.value.patron[rIndex][aIndex] = false
  } else {
    editorDisplay.value.patron[rIndex][aIndex] = true
  }
  ImpactarCambiosEditor()
}

function ImpactarCambiosEditor() {
  props.cancion.pentagramas[props.pentagramaId].compases[props.compas] =
    helper.getCompas(editorDisplay.value)

  emit('actualizoPentagrama')
  Actualizar()
}
function CambioOctava() {
  // editorDisplay.value.acorde.Calcular()
  ImpactarCambiosEditor()
}

function clickUnirRitmo(indice: number) {
  editorDisplay.value.UnirRitmo(indice)
  editandoRitmo.value = -1
  ImpactarCambiosEditor()
}

function clickDividirRitmo(indice: number) {
  editorDisplay.value.DividirRitmo(indice)
  editandoRitmo.value = -1
  ImpactarCambiosEditor()
}
function estiloRitmo(rIndex: number, aIndex: number) {
  const val = editorDisplay.value.patron[rIndex][aIndex]
  if (val) {
    return 'background-color: black; color: white; cursor: pointer; text-align: center'
  } else {
    return 'background-color: white; color: black; cursor: pointer; text-align: center'
  }
}

const instroBateria = EditAcordePentagrama.InstrumentosBateria
</script>
<template>
  <div>
    <input
      style="width: 30px"
      type="number"
      @change="CambioOctava"
      min="1"
      max="8"
    />
  </div>
  <div>
    <table class="tablaRitmos">
      <thead>
        <tr>
          <th>Nota</th>
          <th
            v-for="(r, index) in editorDisplay.ritmo"
            :key="index"
            :colspan="16 / r"
            @click="clickEditarRitmo(index)"
            :class="{ EditandoRitmo: editandoRitmo === index }"
          >
            {{ r }}

            <div style="display: flex" v-if="editandoRitmo === index">
              <div
                class="btnRitmo"
                v-if="puedeUnirPrev"
                @click="clickUnirRitmo(index)"
              >
                +
              </div>
              <div
                class="btnRitmo"
                v-if="puedeDivider"
                @click="clickDividirRitmo(index)"
              >
                /
              </div>
              <div
                class="btnRitmo"
                v-if="puedeUnirPost"
                @click="clickUnirRitmo(index + 1)"
              >
                +
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- PUNTOS-->
        <tr>
          <td>.</td>
          <td v-for="n in 16" :key="n">.</td>
        </tr>

        <tr v-for="(nota, index) in editorDisplay.notas" :key="index">
          <td v-if="!refEsBatera">{{ nota }}</td>
          <td v-if="refEsBatera">{{ instroBateria[index] }}</td>

          <td
            v-for="(r, ritindex) in editorDisplay.ritmo"
            :key="ritindex"
            @click="clickPatron(index, ritindex)"
            :style="estiloRitmo(ritindex, index)"
            :colspan="16 / r"
          >
            {{ editorDisplay.patron[ritindex][index] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <renglonpentagrama
    ref="CtrlrenglonPentagrama"
    :compas="-1"
    :cancion="cancion"
    :renglon="refDisplayPentagrama"
  />
</template>
<style scoped>
.divNotaEdit {
  width: 130px;
}
.divRitmo {
  width: 80px;
  text-align: center;
}
.divPatronRitmo {
  border: 1px solid;
  margin: 0px;
  width: 80px;
  padding: 2px;
  text-align: center;
}
.EditandoRitmo {
  background-color: rgb(65, 65, 39);
}
.btnRitmo {
  border: 1px solid;
  width: 20px;
  text-align: center;
  cursor: pointer;
}
.tablaRitmos {
  border: 1px solid;
}
.tablaRitmos tr,
td,
th {
  border: 1px solid;
}
.tablaRitmos {
  border: 1px solid;
}
</style>
