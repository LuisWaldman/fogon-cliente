<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { DisplaySistemaPentagrama } from '../../modelo/pentagrama/DisplaySistemaPentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { HelperEditPentagrama } from '../../modelo/pentagrama/editPentagrama/helperEditCompasPentagrama'
import type { EditCompasPentagrama } from '../../modelo/pentagrama/editPentagrama/editCompasPentagrama'

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
}
const cambiandoRitmo = ref(false)
const nuevoRitmo = ref('1')
const nuevoRitmoEdit = ref('')
function cambiarRitmo() {
  cambiandoRitmo.value = true
}
</script>
<template>
  <div>
    <span @click="cambiarRitmo">[Cambiar ritmo]</span>
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

    <span @click="clickOkPatron">[Ok]</span>
  </div>
</template>
<style scoped></style>
