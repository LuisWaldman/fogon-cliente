<script lang="ts" setup>
import { ref } from 'vue';
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi';


const props = defineProps<{
  instrumento: string
}>()

const emit = defineEmits(['changeInstrumento'])

const refInstrumentos = ref(InstrumentoMidi.GetInstrumentos())

</script>
<template>
        <select
          v-model="props.instrumento"
            @change="$emit('changeInstrumento')"
    >
      <option
        v-for="(inst, index) in refInstrumentos"
        :key="index"
        :value="inst.nombre"
      >
        {{ inst.nombre }}
      </option>
    </select>
</template>
<style scoped>
</style>