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
const editorDisplay = ref<EditCompasPentagrama>(
  new EditCompasPentagrama('C4', false),
)

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

  const AcordeActual = ref(
    props.cancion.acordes.GetTodosLosAcordes()[props.compas],
  )
  if (refCompasEnPentagrama.value) {
    refEsBatera.value = props.cancion.pentagramas[
      props.pentagramaId
    ].instrumento
      .toLowerCase()
      .includes('batería')
    editorDisplay.value = helper.getDisplayEditCompas(
      refCompasEnPentagrama.value,
      AcordeActual.value,
      refEsBatera.value,
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
  const val = editorDisplay.value.acordespatron[rIndex].patrones[aIndex]
  if (val === 'x') {
    editorDisplay.value.acordespatron[rIndex].patrones[aIndex] = 'o'
  } else {
    editorDisplay.value.acordespatron[rIndex].patrones[aIndex] = 'x'
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
  editorDisplay.value.acorde.Calcular()
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

const instroBateria = EditAcordePentagrama.InstrumentosBateria
</script>
<template>
  <div>
    {{ editorDisplay.acorde.acorde }}
    <input
      v-model="editorDisplay.acorde.octava"
      style="width: 30px"
      type="number"
      @change="CambioOctava"
      min="1"
      max="8"
    />
  </div>
  <div>
    <div style="display: flex">
      <div class="divNotaEdit"></div>
      <div
        class="divRitmo"
        v-for="(r, index) in editorDisplay.ritmo"
        :key="index"
        @click="clickEditarRitmo(index)"
        :class="{ EditandoRitmo: editandoRitmo === index }"
      >
        <div>{{ r }}</div>
        <div
          style="width: 50px; position: relative"
          v-if="editandoRitmo === index"
        >
          <div
            style="position: absolute; left: 10px"
            class="btnRitmo"
            v-if="puedeUnirPrev"
            @click="clickUnirRitmo(index)"
          >
            +
          </div>
          <div
            style="position: absolute; left: 30px"
            class="btnRitmo"
            v-if="puedeDivider"
            @click="clickDividirRitmo(index)"
          >
            /
          </div>
          <div
            style="position: absolute; left: 60px"
            class="btnRitmo"
            v-if="puedeUnirPost"
            @click="clickUnirRitmo(index + 1)"
          >
            +
          </div>
          <div>&nbsp;</div>
        </div>
      </div>
    </div>
    <div
      style="display: flex"
      v-for="(a, aIndex) in editorDisplay.acorde.notas"
      :key="aIndex"
    >
      <div class="divNotaEdit" v-if="!refEsBatera">
        {{ a }}
      </div>
      <div class="divNotaEdit" v-if="refEsBatera">
        {{ instroBateria[aIndex] }}
      </div>
      <div
        class="divPatronRitmo"
        v-for="(_r, index) in editorDisplay.ritmo"
        :key="index"
        @click="clickPatron(aIndex, index)"
      >
        {{ editorDisplay.acordespatron[index].patrones[aIndex] }}
      </div>
    </div>
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
</style>
