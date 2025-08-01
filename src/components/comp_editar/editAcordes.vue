<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion'
import { Parte } from '../../modelo/acordes'
import { EditarAcordesToTextoHelper } from './editarAcordesToTextoHelper'
import { editarAcordesHelper } from './editarAcordesHelper'
import { EditarMusicaHelper } from './editarMusicaHelper'

const props = defineProps<{ cancion: Cancion }>()
const refMixeando = ref(false)
const refSpliteando = ref(false)

const refLeyendo = ref(true)
const refBorrandoParteSecuencia = ref(false)
const refAgregandoParteSecuencia = ref(false)
const refAgregandoParte = ref(false)

const acordes_editando = ref('')

const refEditantoOrdenParte = ref(-1)
const emit = defineEmits(['actualizo_cancion'])

function click_editarparte(index: number) {
  acordes_editando.value = props.cancion.acordes.partes[
    props.cancion.acordes.ordenPartes[index]
  ].acordes
    .join('|')
    .trim()
  refEditantoOrdenParte.value = index
}

const refEditandoTextoAcordes = ref('')

function click_okeditarparte(index: number) {
  const toana = acordes_editando.value
    .toUpperCase()
    .replace(/M/g, 'm')
    .replace(/SUS/g, 'sus')
    .replace(/MAJ/g, 'maj')

  props.cancion.acordes.partes[
    props.cancion.acordes.ordenPartes[index]
  ].acordes = toana.split('|')
  refEditantoOrdenParte.value = -1
  emit('actualizo_cancion')
}

function actualizarOrdenPartes(index: number) {
  console.log(index)
  props.cancion.acordes.ordenPartes = props.cancion.acordes.ordenPartes.filter(
    (parte) => parte !== -1,
  )
  emit('actualizo_cancion')
}

function click_acorde(parte: number, acorde: number) {
  if (refMixeando.value) {
    editarAcordesHelper.mixAcorde(props.cancion, parte, acorde)
    emit('actualizo_cancion')
    refMixeando.value = false
  }
  if (refSpliteando.value) {
    editarAcordesHelper.splitearParte(props.cancion, parte, acorde)
    emit('actualizo_cancion')
    refSpliteando.value = false
  }
}

const refEditandoAcordes = ref(false)
const refEditando = ref(false)
function click_editaracordes() {
  refEditandoAcordes.value = !refEditandoAcordes.value
  refLeyendo.value = !refEditandoAcordes.value
}

function click_mixacorde() {
  refMixeando.value = !refMixeando.value
  if (refMixeando.value) {
    refEditando.value = false
    refSpliteando.value = false
    refBorrandoParteSecuencia.value = false
    refAgregandoParteSecuencia.value = false
    refAgregandoParte.value = false
  }
}

function representa_acorde(parte: number, acorde: number) {
  let cont = 0
  let sum = 0
  while (cont < parte && props.cancion.acordes.ordenPartes.length > cont) {
    sum =
      sum +
      props.cancion.acordes.partes[props.cancion.acordes.ordenPartes[cont]]
        .acordes.length
    cont++
  }
  return sum + acorde
}

let actualizo = false
function sobre_acorde(parte: number, acorde: number) {
  if (!actualizo) {
    emit('actualizo_cancion')
    actualizo = true
  }

  const spanAcorde = document.getElementById(
    'span_acorde-' + representa_acorde(parte, acorde).toString(),
  )
  if (spanAcorde) {
    //spanAcorde.style.backgroundColor = 'red';
    spanAcorde.classList.add('acorde_resaltado')
  }
}

function dejasobre_acorde(parte: number, acorde: number) {
  const spanAcorde = document.getElementById(
    'span_acorde-' + representa_acorde(parte, acorde).toString(),
  )
  if (spanAcorde) {
    spanAcorde.style.backgroundColor = ''
    spanAcorde.classList.remove('acorde_resaltado')
  }
}

function click_splitacorde() {
  refSpliteando.value = !refSpliteando.value
  if (refSpliteando.value) {
    refMixeando.value = false
    refBorrandoParteSecuencia.value = false
    refAgregandoParteSecuencia.value = false
    refAgregandoParte.value = false
  }
}

const drag_parte = ref(-1)
function dragstart_ordenparte(index: number) {
  drag_parte.value = index
}

function dragover_ordenparte(ev: DragEvent, index: number) {
  ev.preventDefault()
}

function drop_ordenparte(index: number) {
  if (drag_parte.value !== -1) {
    const temp = props.cancion.acordes.ordenPartes[index]
    props.cancion.acordes.ordenPartes[index] =
      props.cancion.acordes.ordenPartes[drag_parte.value]
    props.cancion.acordes.ordenPartes[drag_parte.value] = temp
    emit('actualizo_cancion')
  }
}

function click_borrarpartesecuencia() {
  refBorrandoParteSecuencia.value = !refBorrandoParteSecuencia.value
  if (refBorrandoParteSecuencia.value) {
    refAgregandoParteSecuencia.value = false
    refAgregandoParte.value = false
    refMixeando.value = false
    refSpliteando.value = false
  }
}

function click_agregarparte() {
  refAgregandoParte.value = !refAgregandoParte.value
  if (refAgregandoParte.value) {
    refAgregandoParteSecuencia.value = false
    refMixeando.value = false
    refSpliteando.value = false
    refBorrandoParteSecuencia.value = false
  }
}

function click_agregarpartesecuencia() {
  refAgregandoParteSecuencia.value = !refAgregandoParteSecuencia.value
  if (refAgregandoParteSecuencia.value) {
    refAgregandoParte.value = false
    refMixeando.value = false
    refSpliteando.value = false
    refBorrandoParteSecuencia.value = false
  }
}
function click_borrarparte(index: number) {
  props.cancion.acordes.ordenPartes.splice(index, 1)
  emit('actualizo_cancion')
}

function click_enagregarparte(index: number) {
  if (refAgregandoParteSecuencia.value) {
    props.cancion.acordes.partes.push(new Parte('Nueva parte', ['.']))
    props.cancion.acordes.ordenPartes.splice(
      index + 1,
      0,
      props.cancion.acordes.partes.length - 1,
    )
    emit('actualizo_cancion')
  }
  if (refAgregandoParte.value) {
    let n = []

    for (let i = 0; i < props.cancion.acordes.ordenPartes.length; i++) {
      n.push(props.cancion.acordes.ordenPartes[i])
      if (i == index) {
        n.push(props.cancion.acordes.ordenPartes[i])
      }
    }
    props.cancion.acordes.ordenPartes = n
    emit('actualizo_cancion')
  }
}
const refMostrandoParteSecuencia = ref(false)
const refMostrandoParteSecuenciaIndex = ref(-1)
const refPartesSeleccionadas = ref([] as number[])
const refPartesMostrar = ref([] as number[])

function click_mostrarpartespaxim(index: number) {
  console.log(index, props.cancion.acordes.ordenPartes[index])
  let part_ind = []

  refMostrandoParteSecuenciaIndex.value = index
  let mixeando_parte =
    props.cancion.acordes.ordenPartes[refMostrandoParteSecuenciaIndex.value]
  for (let i = 0; i < props.cancion.acordes.ordenPartes.length - 1; i++) {
    if (props.cancion.acordes.ordenPartes[i] == mixeando_parte) {
      part_ind.push(props.cancion.acordes.ordenPartes[i + 1])
    }
  }
  part_ind = [...new Set(part_ind)]
  let mostr = []
  for (let i = 0; i < part_ind.length; i++) {
    mostr.push(part_ind[i])
  }
  refPartesMostrar.value = mostr
  refMostrandoParteSecuencia.value = true
}

function click_mostrarpartespaquitar_de(index: number) {
  refMostrandoParteSecuencia.value = true
  refMostrandoParteSecuenciaIndex.value = index
}

function click_mostrarpartespaquitar(index: number) {
  if (refPartesSeleccionadas.value.includes(refPartesMostrar.value[index])) {
    const idx = refPartesSeleccionadas.value.indexOf(
      refPartesMostrar.value[index],
    )
    if (idx !== -1) {
      refPartesSeleccionadas.value.splice(idx, 1)
    }
  } else {
    refPartesSeleccionadas.value.push(refPartesMostrar.value[index])
  }
}
function click_okcambiopartes() {
  props.cancion.acordes = EditarMusicaHelper.mixear(
    props.cancion.acordes,
    refMostrandoParteSecuenciaIndex.value,
    refPartesSeleccionadas.value,
  )
  refMostrandoParteSecuenciaIndex.value = -1
  refMostrandoParteSecuencia.value = false
}
</script>

<template>
  <div class="componenteMusical">
    <div>
      <ComponenteMusicalAcordes
        :cancion="cancion"
        :compas="-2"
        :secuencia="true"
        :partes="true"
        :width="300"
        :height="2000"
      ></ComponenteMusicalAcordes>

      <div>
        <div
          class="contAcordes"
          v-for="(parte, index) in cancion.acordes.ordenPartes"
          :key="index"
        >
          <div style="display: flex">
            <div
              class="clsIdParte"
              draggable="true"
              @dragstart="dragstart_ordenparte(index)"
              @dragover="dragover_ordenparte($event, index)"
              @drop="drop_ordenparte(index)"
            >
              <span>{{ index + 1 }}</span>
            </div>
            <div
              class="btnEditAcorde"
              v-if="index != refEditantoOrdenParte && refEditando"
              @click="click_editarparte(index)"
            >
              <span class="bi bi-pencil"></span>
            </div>
            <div
              class="btnEditAcorde"
              @click="click_okeditarparte(index)"
              v-if="index == refEditantoOrdenParte"
            >
              <span>Ok</span>
            </div>

            <input
              type="text"
              v-model="cancion.acordes.partes[parte].nombre"
              :style="{
                width:
                  (1 + cancion.acordes.partes[parte].nombre.length).toString() +
                  'ch',
              }"
              v-if="index == refEditantoOrdenParte"
            />
            <select
              v-model="cancion.acordes.ordenPartes[index]"
              v-if="index != refEditantoOrdenParte"
              @change="actualizarOrdenPartes(index)"
              class="selectParteEnOrden"
            >
              <option
                v-for="(parte, parteIndex) in cancion.acordes.partes"
                :key="parteIndex"
                :value="parteIndex"
              >
                {{ parte.nombre }}
              </option>
            </select>
          </div>
          <div
            style="display: flex; flex-wrap: wrap"
            v-if="
              index != refEditantoOrdenParte && cancion.acordes.partes[parte]
            "
          >
            <div
              class="acorde_edicion"
              :class="{
                acorde_mixiando: refMixeando,
                acorde_split: refSpliteando,
              }"
              @click="click_acorde(index, index_acorde)"
              @pointerover="sobre_acorde(index, index_acorde)"
              @pointerleave="dejasobre_acorde(index, index_acorde)"
              v-for="(acorde, index_acorde) in cancion.acordes.partes[parte]
                .acordes"
              :key="index_acorde"
            >
              {{ acorde }}
            </div>
          </div>
          <input
            type="text"
            :style="{ width: (3 + acordes_editando.length).toString() + 'ch' }"
            v-model="acordes_editando"
            v-if="index == refEditantoOrdenParte"
          />

          <div
            class="btnEditAcorde"
            v-if="refEditando && !refMostrandoParteSecuencia"
            @click="click_mostrarpartespaxim(index)"
          >
            Unir
          </div>

          <div
            class="btnEditAcorde"
            v-if="refEditando && !refMostrandoParteSecuencia"
            @click="click_mostrarpartespaquitar_de(index)"
          >
            QUITAR DE
          </div>

          <div
            v-if="
              refEditando &&
              refMostrandoParteSecuencia &&
              refMostrandoParteSecuenciaIndex == index
            "
          >
            <div
              class="btnEditAcorde"
              v-for="(parte_m, parte_mindex_parte) in refPartesMostrar"
              :key="parte_mindex_parte"
              :class="{
                seleccionada: refPartesSeleccionadas.includes(parte_m),
              }"
              @click="click_mostrarpartespaquitar(parte_mindex_parte)"
            >
              {{ cancion.acordes.partes[parte_m].nombre }}
            </div>
            <div
              v-if="refEditando && refMostrandoParteSecuencia"
              @click="click_okcambiopartes"
              class="btnEditAcorde"
            >
              Ok
            </div>
          </div>
          <div
            class="btnEditAcorde"
            v-if="refBorrandoParteSecuencia"
            @click="click_borrarparte(index)"
          >
            <span class="bi bi-trash"></span>
          </div>

          <div
            class="btnEditAcorde"
            v-if="refAgregandoParte || refAgregandoParteSecuencia"
            @click="click_enagregarparte(index)"
          >
            <span class="bi bi-plus"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contAcordes {
  display: flex;
  flex-wrap: wrap;
}

.btnSeleccionado {
  background-color: #a9a8f6;
  color: white !important;
}
.acorde_edicion {
  font-size: x-large;
  border: 1px solid #a9a8f6;
  padding: 10px;
  border-left: none;
}
.acorde_split:hover {
  border: 2px solid #a9a8f6;
  margin-left: 30px;
}

.acorde_mixiando:hover {
  border: 2px solid #a9a8f6;
  color: rgb(158, 52, 52);
  border-right: none;
}

.btnEditAcorde {
  border: 1px solid;
  color: #a9a8f6;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  padding: 10px 24px;
}
.seleccionada {
  background-color: #a9a8f6;
  color: white !important;
  border: 2px solid #a9a8f6;
}
</style>
