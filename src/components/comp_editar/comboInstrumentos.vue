<script lang="ts" setup>
import { ref, watch } from 'vue'
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi'

const props = defineProps<{
  instrumento: string
}>()

const emit = defineEmits(['changeInstrumento'])

const refInstrumentos = ref(InstrumentoMidi.GetInstrumentos())

// referencia local que sí podemos mutar
const selected = ref(props.instrumento)

// si el padre cambia el prop, sincronizamos la ref local
watch(
  () => props.instrumento,
  (v) => {
    selected.value = v
  },
)

// cuando la ref local cambia emitimos al padre
watch(selected, (v) => {
  emit('changeInstrumento', v)
})
</script>
<template>
  <!-- muestra el valor del prop actual -->
  <select v-model="selected">
    <option
      v-for="(inst, index) in refInstrumentos"
      :key="index"
      :value="inst.nombre"
    >
      {{ inst.nombre }}
    </option>
  </select>
</template>
<style scoped></style>
