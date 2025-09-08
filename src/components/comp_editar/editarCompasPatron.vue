<script lang="ts" setup>
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import type { EditCompasPentagrama } from '../../modelo/pentagrama/editPentagrama/editCompasPentagrama'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'
import { HelperEditPentagrama } from '../../modelo/pentagrama/editPentagrama/helperEditCompasPentagrama'

const emit = defineEmits(['actualizoPentagrama'])
const props = defineProps<{
  pentagramaId: number
  cancion: Cancion
  compas: number
  editorDisplay: EditCompasPentagrama
}>()

function setRitmo() {
  if (nuevoRitmo.value === 'otro' && nuevoRitmoEdit.value.trim() === '') {
    alert('Escribe el ritmo separado por comas')
    return
  }
  const ritmo =
    nuevoRitmo.value === 'otro' ? nuevoRitmoEdit.value : nuevoRitmo.value
  props.editorDisplay.SetNewRitmo(ritmo.split(',').map((x) => x))
}
function HacerPatron(
  cambiarRitmo: boolean,
  agregarNotasAcorde: boolean,
  agregaGuitarreo: boolean,
  acordeAgregar: string,
  octavaAgregar: number,
  agregandoPatronBateria: boolean,
) {
  if (cambiarRitmo) {
    setRitmo()
  }

  if (agregarNotasAcorde) {
    const musica = new MusicaHelper()
    const notasAcorde = musica.GetNotasdeacorde(acordeAgregar, octavaAgregar)
    props.editorDisplay.SetNotas(notasAcorde)
  }
  if (agregandoPatronBateria) {
    if (agregandoPatronBateriaIndice.value === 1) {
      // Rock
      props.editorDisplay.SetNewRitmo([8, 8, 8, 8, 8, 8, 8, 8])
      props.editorDisplay.SetNotas(['D4', 'E5', 'F4'])
      props.editorDisplay.patron[0] = [true, true, false]
      props.editorDisplay.patron[1] = [false, true, true]
      props.editorDisplay.patron[2] = [true, true, false]
      props.editorDisplay.patron[3] = [false, true, true]
      props.editorDisplay.patron[4] = [false, true, false]
      props.editorDisplay.patron[5] = [false, true, false]
      props.editorDisplay.patron[6] = [false, true, false]
      props.editorDisplay.patron[7] = [false, true, false]
    }

    if (agregandoPatronBateriaIndice.value === 2) {
      // Balada rock
      props.editorDisplay.SetNewRitmo([4, 4, 8, 8, 8, 8])
      props.editorDisplay.SetNotas(['D4', 'F4', 'E5'])
      props.editorDisplay.patron[0] = [true, false, false]
      props.editorDisplay.patron[1] = [false, true, false]
      props.editorDisplay.patron[2] = [true, true, true]
      props.editorDisplay.patron[3] = [false, true, false]
      props.editorDisplay.patron[4] = [true, true, true]
      props.editorDisplay.patron[5] = [false, true, false]
    }
  }
  if (agregaGuitarreo) {
    console.log('Agregar guitarreo')
    const ritmonuevo: number[] = []
    const connota: boolean[] = []
    for (let i = 0; i < 4; i++) {
      const pri = guitarreo.value[i * 2]
      const seg = guitarreo.value[i * 2 + 1]
      if (!seg) {
        ritmonuevo.push(4)
        connota.push(pri)
      } else {
        ritmonuevo.push(8)
        ritmonuevo.push(8)
        connota.push(pri)
        connota.push(seg)
      }
    }
    props.editorDisplay.SetNewRitmo(ritmonuevo)
    for (let i = 0; i < ritmonuevo.length; i++) {
      for (let j = 0; j < props.editorDisplay.patron[i].length; j++) {
        props.editorDisplay.patron[i][j] = connota[i]
      }
    }
  }
}
function clickOkPatron() {
  const todosAcordes = props.cancion.acordes.GetTodosLosAcordes()
  const acordeEdit = todosAcordes[props.compas]
  HacerPatron(
    cambiandoRitmo.value,
    agregandoNotasAcorde.value,
    agregaGuitarreo.value,
    acordeEdit,
    parseInt(agregandoNotasAcordeOctava.value),
    agregandoPatronBateria.value,
  )
  emit('actualizoPentagrama')
}
function clickEnTodos() {
  const todosAcordes = props.cancion.acordes.GetTodosLosAcordes()
  const editHelper = new HelperEditPentagrama()
  for (
    let i = 0;
    i < props.cancion.pentagramas[props.pentagramaId].compases.length;
    i++
  ) {
    const acordeEdit = todosAcordes[i]
    HacerPatron(
      cambiandoRitmo.value,
      agregandoNotasAcorde.value,
      agregaGuitarreo.value,
      acordeEdit,
      parseInt(agregandoNotasAcordeOctava.value),
      agregandoPatronBateria.value,
    )
    props.cancion.pentagramas[props.pentagramaId].compases[i] =
      editHelper.getCompas(props.editorDisplay)
  }
  emit('actualizoPentagrama')
}

function clickEnParte() {
  let totalCompases = 0
  let mostrandoParte = 0

  for (let i = 0; i < props.cancion.acordes.ordenPartes.length; i++) {
    let compasesxparte =
      props.cancion.acordes.partes[props.cancion.acordes.ordenPartes[i]].acordes
        .length
    if (props.compas < totalCompases + compasesxparte) {
      mostrandoParte = i
      break
    }
    totalCompases += compasesxparte
  }

  const todosAcordes = props.cancion.acordes.GetTodosLosAcordes()
  const editHelper = new HelperEditPentagrama()
  let cont = 0
  for (let i = 0; i < props.cancion.acordes.ordenPartes.length; i++) {
    for (
      let j = 0;
      j <
      props.cancion.acordes.partes[props.cancion.acordes.ordenPartes[i]].acordes
        .length;
      j++
    ) {
      if (props.cancion.acordes.ordenPartes[i] === mostrandoParte) {
        const acordeEdit = todosAcordes[cont]
        HacerPatron(
          cambiandoRitmo.value,
          agregandoNotasAcorde.value,
          agregaGuitarreo.value,
          acordeEdit,
          parseInt(agregandoNotasAcordeOctava.value),
          agregandoPatronBateria.value,
        )
        props.cancion.pentagramas[props.pentagramaId].compases[cont] =
          editHelper.getCompas(props.editorDisplay)
      }

      cont++
    }
  }

  emit('actualizoPentagrama')
}

function clickEnAcordeParte() {
  let totalCompases = 0
  let mostrandoParte = 0
  let mostrandoCompasparte = 0

  for (let i = 0; i < props.cancion.acordes.ordenPartes.length; i++) {
    let compasesxparte =
      props.cancion.acordes.partes[props.cancion.acordes.ordenPartes[i]].acordes
        .length
    if (props.compas < totalCompases + compasesxparte) {
      mostrandoParte = i
      mostrandoCompasparte = props.compas - totalCompases
      break
    }
    totalCompases += compasesxparte
  }

  const todosAcordes = props.cancion.acordes.GetTodosLosAcordes()
  const editHelper = new HelperEditPentagrama()
  let cont = 0
  for (let i = 0; i < props.cancion.acordes.ordenPartes.length; i++) {
    for (
      let j = 0;
      j <
      props.cancion.acordes.partes[props.cancion.acordes.ordenPartes[i]].acordes
        .length;
      j++
    ) {
      if (
        props.cancion.acordes.ordenPartes[i] === mostrandoParte &&
        mostrandoCompasparte === j
      ) {
        const acordeEdit = todosAcordes[cont]
        HacerPatron(
          cambiandoRitmo.value,
          agregandoNotasAcorde.value,
          agregaGuitarreo.value,
          acordeEdit,
          parseInt(agregandoNotasAcordeOctava.value),
          agregandoPatronBateria.value,
        )
        props.cancion.pentagramas[props.pentagramaId].compases[cont] =
          editHelper.getCompas(props.editorDisplay)
      }

      cont++
    }
  }

  emit('actualizoPentagrama')
}

const cambiandoRitmo = ref(false)
const agregaGuitarreo = ref(false)
const agregandoNotasAcorde = ref(false)
const nuevoRitmo = ref('1')
const nuevoRitmoEdit = ref('')
function cambiarRitmo() {
  cambiandoRitmo.value = !cambiandoRitmo.value
}
const guitarreo = ref([true, true, true, true, true, true, true, true])

function agregarGuitarreo() {
  agregaGuitarreo.value = !agregaGuitarreo.value
}

const agregandoNotasAcordeOctava = ref('4')
function agregarNota() {
  agregandoNotasAcorde.value = !agregandoNotasAcorde.value
}

const viendoMasQueOk = ref(false)
function clickMasPatron() {
  viendoMasQueOk.value = !viendoMasQueOk.value
}

const agregandoPatronBateria = ref(false)
const agregandoPatronBateriaIndice = ref(1)
function agregarPatron() {
  agregandoPatronBateria.value = !agregandoPatronBateria.value
}
function clickParteGuitarreo(index: number) {
  guitarreo.value[index] = !guitarreo.value[index]
}
</script>
<template>
  <div>
    <div>
      <span @click="cambiarRitmo">[Cambiar ritmo]</span>
      <span @click="agregarNota">[Agregar Notas Acorde]</span>
      <span @click="agregarPatron">[Bateria]</span>
      <span @click="agregarGuitarreo">[Guitarreo]</span>
    </div>
    <div>
      <select v-model="nuevoRitmo" v-if="cambiandoRitmo">
        <option value="1">Una redonda</option>
        <option value="2,2">Dos blancas</option>
        <option value="2d,4">Blanca con puntilla</option>
        <option value="4,4,4">4 negras</option>
        <option value="2,4,4">2 y 4</option>
        <option value="4,4,2">4 y 2</option>
        <option value="8,8,8,8,8,8,8,8">Corcheas</option>
        <option value="16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16">
          Semi Corcheas
        </option>
        <option value="otro">Otro</option>
      </select>
      <input
        v-if="nuevoRitmo === 'otro'"
        v-model="nuevoRitmoEdit"
        placeholder="Escribe el ritmo separado por comas"
      />
      <select v-model="agregandoNotasAcordeOctava" v-if="agregandoNotasAcorde">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>
      <select
        v-model="agregandoPatronBateriaIndice"
        v-if="agregandoPatronBateria"
      >
        <option :value="1">Rock</option>
        <option :value="2">Rock II</option>
        <option :value="3">Balada</option>
        <option :value="4">Tropical</option>
      </select>
      <div v-if="agregaGuitarreo" style="display: flex">
        <div v-for="(i, index) in guitarreo" :key="index" style="display: flex">
          <div @click="clickParteGuitarreo(index)">
            <span v-if="!i">*</span>
            <span v-if="i && index % 2 === 0">⬇️</span>
            <span v-if="i && index % 2 !== 0">⬆️</span>
            <span v-if="index % 2 !== 0 && index < 7">-</span>
          </div>
        </div>
      </div>
    </div>
    <span @click="clickOkPatron">[Ok]</span>
    <span @click="clickMasPatron">[+]</span>
    <span @click="clickEnTodos" v-if="viendoMasQueOk">[En todos]</span>
    <span @click="clickEnParte" v-if="viendoMasQueOk">[En parte]</span>
    <span @click="clickEnAcordeParte" v-if="viendoMasQueOk"
      >[En acorde de partes]</span
    >
  </div>
</template>
<style scoped></style>
