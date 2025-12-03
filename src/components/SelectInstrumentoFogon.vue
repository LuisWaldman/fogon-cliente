<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'teclado',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Opciones de instrumentos Fogón
const instrumentosFogon = [
  { value: 'teclado', label: 'Teclado', tieneVariantes: true },
  { value: 'guitarra', label: 'Guitarra', tieneVariantes: true },
  { value: 'ukelele', label: 'Ukelele', tieneVariantes: true },
  { value: 'bajo', label: 'Bajo' },
  { value: 'armonica', label: 'Armónica' },
  { value: 'percusion', label: 'Percusión' },
]

const instrumentoBase = ref('')
const varianteInstrumento = ref('')

// Detectar el instrumento base y variante del valor actual
function detectarInstrumentoYVariante() {
  const instrActual = props.modelValue

  if (instrActual.includes('guitarra')) {
    instrumentoBase.value = 'guitarra'
    if (instrActual.includes('ritmica')) {
      varianteInstrumento.value = 'ritmica'
    } else if (instrActual.includes('melodica')) {
      varianteInstrumento.value = 'melodica'
    } else {
      varianteInstrumento.value = ''
    }
  } else if (instrActual.includes('ukelele')) {
    instrumentoBase.value = 'ukelele'
    if (instrActual.includes('ritmica')) {
      varianteInstrumento.value = 'ritmica'
    } else if (instrActual.includes('melodica')) {
      varianteInstrumento.value = 'melodica'
    } else {
      varianteInstrumento.value = ''
    }
  } else if (instrActual.includes('teclado')) {
    instrumentoBase.value = 'teclado'
    if (instrActual.includes('ritmica')) {
      varianteInstrumento.value = 'ritmica'
    } else if (instrActual.includes('melodica')) {
      varianteInstrumento.value = 'melodica'
    } else {
      varianteInstrumento.value = ''
    }
  } else {
    instrumentoBase.value = instrActual || 'teclado'
    varianteInstrumento.value = ''
  }
}

function actualizarInstrumento() {
  let nuevoInstrumento = instrumentoBase.value

  if (
    (instrumentoBase.value === 'guitarra' ||
      instrumentoBase.value === 'ukelele' ||
      instrumentoBase.value === 'teclado') &&
    varianteInstrumento.value
  ) {
    nuevoInstrumento = `${instrumentoBase.value}-${varianteInstrumento.value}`
  }

  emit('update:modelValue', nuevoInstrumento)
}

const mostrarVariantes = computed(
  () =>
    instrumentoBase.value === 'guitarra' ||
    instrumentoBase.value === 'ukelele' ||
    instrumentoBase.value === 'teclado',
)

// Inicializar al montar
detectarInstrumentoYVariante()

// Observar cambios en el modelValue
watch(
  () => props.modelValue,
  () => {
    detectarInstrumentoYVariante()
  },
)
</script>

<template>
  <div class="select-instrumento-fogon">
    <select
      id="instrumento-fogon"
      v-model="instrumentoBase"
      @change="actualizarInstrumento"
    >
      <option
        v-for="inst in instrumentosFogon"
        :key="inst.value"
        :value="inst.value"
      >
        {{ inst.label }}
      </option>
    </select>

    <!-- Selector de variante para instrumentos que lo soportan -->
    <select
      v-if="mostrarVariantes"
      v-model="varianteInstrumento"
      @change="actualizarInstrumento"
      style="margin-top: 0.5rem"
    >
      <option value="">Normal</option>
      <option value="ritmica">Rítmico</option>
      <option value="melodica">Melódico</option>
    </select>
  </div>
</template>

<style scoped>
.select-instrumento-fogon {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

select {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 2px solid rgba(169, 168, 246, 0.3);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  outline: none;
}

select:focus {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 0 15px rgba(169, 168, 246, 0.2);
  background: rgba(0, 0, 0, 0.8);
}

select:hover {
  border-color: rgba(169, 168, 246, 0.6);
  background: rgba(0, 0, 0, 0.7);
}

select option {
  background: rgba(0, 0, 0, 0.9);
  color: #a9a8f6;
  padding: 6px;
}

select option:hover {
  background: rgba(169, 168, 246, 0.2);
}
</style>
