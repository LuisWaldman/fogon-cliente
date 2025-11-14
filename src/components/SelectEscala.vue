<script setup lang="ts">
import { computed } from 'vue'
import { HelperDisplayAcordesLatino } from '../modelo/display/helperDisplayAcordesLatino'
import { useAppStore } from '../stores/appStore'

withDefaults(
  defineProps<{
    modelValue: string
  }>(),
  {
    modelValue: 'C',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const notas: string[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

const appStore = useAppStore()
const helper = HelperDisplayAcordesLatino.getInstance()
helper.latino = appStore.perfil.CifradoLatino

const escalas = computed(() =>
  [
    ...notas.map((nota) => ({
      value: nota,
      label: `${helper.GetAcorde(nota)} Mayor`,
    })),
    ...notas.map((nota) => ({
      value: `${nota}m`,
      label: `${helper.GetAcorde(nota)} Menor`,
    })),
  ].sort((a, b) =>
    a.value.replace('#', 'z').localeCompare(b.value.replace('#', 'z')),
  ),
)

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <select :value="modelValue" @input="handleChange">
    <option v-for="escala in escalas" :key="escala.value" :value="escala.value">
      {{ escala.label }}
    </option>
  </select>
</template>

<style scoped></style>
