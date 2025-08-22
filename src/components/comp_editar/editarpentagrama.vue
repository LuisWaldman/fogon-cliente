<script lang="ts" setup>
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import subirmidi from './subirmidi.vue'
import { Pentagrama } from '../../modelo/cancion/pentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
const props = defineProps<{
  cancion: Cancion
}>()

const emit = defineEmits(['cerrar', 'actualizoPentagrama'])
const idPentagramaEditando = ref(0)
function clickCancelarEdit() {
  emit('cerrar')
}

function clickAgregarPentagrama() {
  const nPentagrama = new Pentagrama()
  nPentagrama.instrumento = 'Nuevo Instrumento'
  props.cancion.pentagramas.push(nPentagrama)
}

function clickGenerarPentagrama() {
  const helpPenta = new HelperPentagramas()
  props.cancion.pentagramas[idPentagramaEditando.value] =
    helpPenta.creaPentagrama(props.cancion)
  emit('actualizoPentagrama')
}
</script>
<template>
  <div>
    <span @click="clickCancelarEdit">[Cancelar]</span>

    <subirmidi :cancion="cancion"></subirmidi>
  </div>
  <div>
    Pentagramas
    <select>
      <option
        v-for="(pentagrama, index) in props.cancion.pentagramas"
        :key="index"
        :value="pentagrama"
      >
        {{ pentagrama.instrumento }}
      </option>
    </select>
    <span @click="clickAgregarPentagrama">[Agregar]</span>
  </div>
  <div>
    <span @click="clickGenerarPentagrama">[Generar Pentagrama]</span>
  </div>
</template>
