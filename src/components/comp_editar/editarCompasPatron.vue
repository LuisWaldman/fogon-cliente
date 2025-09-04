<script lang="ts" setup>
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import type { EditCompasPentagrama } from '../../modelo/pentagrama/editPentagrama/editCompasPentagrama'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49.js'

const emit = defineEmits(['actualizoPentagrama'])
const props = defineProps<{
  pentagramaId: number
  cancion: Cancion
  compas: number
  editorDisplay: EditCompasPentagrama
}>()

function clickOkPatron() {
  if (cambiandoRitmo.value) {
    if (nuevoRitmo.value === 'otro' && nuevoRitmoEdit.value.trim() === '') {
      alert('Escribe el ritmo separado por comas')
      return
    }
    const ritmo =
      nuevoRitmo.value === 'otro' ? nuevoRitmoEdit.value : nuevoRitmo.value
    props.editorDisplay.SetNewRitmo(ritmo.split(',').map((x) => parseInt(x)))
    emit('actualizoPentagrama')
  } 
  if (agregandoNotasAcorde.value) {
    const musica = new MusicaHelper()
    const todosAcordes = props.cancion.acordes.GetTodosLosAcordes()
    const acordeEdit = todosAcordes[props.compas]
    const notasAcorde = musica.GetNotasdeacorde(
      acordeEdit,
      agregandoNotasAcordeOctava.value,
    )
    props.editorDisplay.SetNotas(notasAcorde)
    emit('actualizoPentagrama')
  }
  if (agregandoPatronBateria.value) {
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
    emit('actualizoPentagrama')
  }
  if (agregaGuitarreo.value) {
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

    emit('actualizoPentagrama')
  }
}
const cambiandoRitmo = ref(false)
const agregaGuitarreo = ref(false)
const agregandoNotasAcorde = ref(false)
const nuevoRitmo = ref('1')
const nuevoRitmoEdit = ref('')
function cambiarRitmo() {
  cambiandoRitmo.value = true
  agregandoNotasAcorde.value = false
  agregandoPatronBateria.value = false
  agregaGuitarreo.value = false
}
const guitarreo = ref([true, true, true, true, true, true, true, true])

function agregarGuitarreo() {
  agregaGuitarreo.value = true
  cambiandoRitmo.value = false
  agregandoNotasAcorde.value = false
  agregandoPatronBateria.value = false
}

const agregandoNotasAcordeOctava = ref(4)
function agregarNota() {
  cambiandoRitmo.value = false
  agregandoNotasAcorde.value = true
  agregandoPatronBateria.value = false
  agregaGuitarreo.value = false
}

const agregandoPatronBateria = ref(false)
const agregandoPatronBateriaIndice = ref(1)
function agregarPatron() {
  cambiandoRitmo.value = false
  agregandoNotasAcorde.value = false
  agregandoPatronBateria.value = true
  agregaGuitarreo.value = false
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
        <option value="1">Rock</option>
        <option value="2">Rock II</option>
        <option value="3">Balada</option>
        <option value="4">Tropical</option>
      </select>
      <div v-if="agregaGuitarreo" style="display: flex">
        <div v-for="(i, index) in guitarreo" :key="index" style="display: flex;">
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
  </div>
</template>
<style scoped></style>
