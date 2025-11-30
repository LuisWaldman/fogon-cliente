<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import { InstrumentoMidi } from '../modelo/midi/InstrumentoMidi'

const props = withDefaults(
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

const appStore = useAppStore()
const perfil = computed(() => appStore.perfil)
const categorias = ref(InstrumentoMidi.GetCategoria())
const instrumentos = ref(InstrumentoMidi.GetInstrumentos())

const categoriasExpandidas = ref<string[]>([])

const instrumentosPorCategoria = computed(() => {
  const map: { [key: string]: InstrumentoMidi[] } = {}
  instrumentos.value.forEach((inst) => {
    if (!map[inst.categoria]) map[inst.categoria] = []
    map[inst.categoria].push(inst)
  })
  return map
})

function getCategoriaDeInstrumento(instNombre: string): string | null {
  for (const cat of categorias.value) {
    if (
      instrumentosPorCategoria.value[cat].some(
        (inst) => inst.nombre === instNombre,
      )
    ) {
      return cat
    }
  }
  return null
}

function expandirCategoriaSiNecesario(inst: string) {
  if (perfil.value.instrumentosFavoritos.includes(inst)) return
  const cat = getCategoriaDeInstrumento(inst)
  if (cat && !categoriasExpandidas.value.includes(cat)) {
    categoriasExpandidas.value = [cat]
  }
}

onMounted(() => {
  expandirCategoriaSiNecesario(props.modelValue)
})

watch(
  () => props.modelValue,
  (newVal) => {
    expandirCategoriaSiNecesario(newVal)
  },
)

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  if (value.startsWith('cat-')) {
    const cat = value.slice(4)
    categoriasExpandidas.value = [cat]
    // No emitir, solo expandir
  } else {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <select :value="modelValue" @input="handleChange">
    <optgroup label="Favoritos">
      <option
        v-for="fav in perfil.instrumentosFavoritos"
        :key="fav"
        :value="fav"
      >
        {{ fav }}
      </option>
    </optgroup>
    <optgroup v-for="cat in categoriasExpandidas" :key="cat" :label="cat">
      <option
        v-for="inst in instrumentosPorCategoria[cat]"
        :key="inst.nombre"
        :value="inst.nombre"
      >
        {{ inst.nombre }}
      </option>
    </optgroup>
    <optgroup label="Categorías">
      <option v-for="cat in categorias" :key="cat" :value="'cat-' + cat">
        {{ '+' + cat }}
      </option>
    </optgroup>
  </select>
</template>

<style scoped></style>
