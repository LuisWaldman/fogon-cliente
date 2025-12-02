<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { Tiempo } from '../../modelo/tiempo'

const tiempo = new Tiempo()

const props = defineProps<{
  cancion: Cancion
}>()

// Variables reactivas para edición
const bpm = ref<number>(0)
const compasCantidad = ref<number>(1)
const compasUnidad = ref<number>(2)
const compas = ref<string>('4_4')

const emit = defineEmits(['cerrar'])

onMounted(() => {
  // Asignar valores actuales y guardar originales
  bpm.value = props.cancion.bpm || 120
  compasCantidad.value = props.cancion.compasCantidad
  compasUnidad.value = props.cancion.compasUnidad
  compas.value = `${compasCantidad.value}_${compasUnidad.value}`
})

function actualizarCompas() {
  const partes = compas.value.split('_')
  props.cancion.compasCantidad = parseInt(partes[0]) || 4
  props.cancion.compasUnidad = parseInt(partes[1]) || 4
}

function clickListo() {
  // Aplicar cambios a la canción
  emit('cerrar')
}

function clickCancelar() {
  // Restaurar valores originales

  props.cancion.bpm = bpm.value
  props.cancion.compasCantidad = compasCantidad.value
  props.cancion.compasUnidad = compasUnidad.value
  emit('cerrar', false)
}
</script>
<template>
  <div></div>
  <div v-if="cancion && props.cancion.bpm" class="ctrlEdit">
    <span class="lblCabecera">BPM:</span>
    <input
      type="range"
      style="background-color: #a9a8f6; color: white"
      v-model="props.cancion.bpm"
      min="30"
      max="240"
    />

    {{ props.cancion.bpm }} -
    <span v-if="props.cancion.bpm >= 40 && props.cancion.bpm <= 60">Largo</span>
    <span v-if="props.cancion.bpm > 60 && props.cancion.bpm <= 66"
      >Largo a Adagio</span
    >
    <span v-if="props.cancion.bpm > 66 && props.cancion.bpm <= 76">Adagio</span>
    <span v-if="props.cancion.bpm > 76 && props.cancion.bpm <= 108"
      >Andante</span
    >
    <span v-if="props.cancion.bpm > 108 && props.cancion.bpm <= 120"
      >Moderato</span
    >
    <span v-if="props.cancion.bpm > 120 && props.cancion.bpm <= 168"
      >Allegro</span
    >
    <span v-if="props.cancion.bpm > 168 && props.cancion.bpm <= 176"
      >Vivace</span
    >
    <span v-if="props.cancion.bpm > 176 && props.cancion.bpm <= 200"
      >Presto</span
    >
    <span v-if="props.cancion.bpm > 200">Prestissimo</span>
    <span>&nbsp;-&nbsp;</span>

    <span class="lblCabecera">Compas:</span>
    <select v-model="compas" @change="actualizarCompas">
      <option value="2_4">2/4</option>
      <option value="3_4">3/4</option>
      <option value="4_4">4/4</option>
      <option value="6_8">6/8</option>
      <option value="12_8">12/8</option>
    </select>

    Duracion Cancion:
    <span>{{
      tiempo.formatSegundos(
        (60 / bpm) * compasCantidad * props.cancion.totalCompases,
      )
    }}</span>
    Duracion Compas: <span>{{ ((60 / bpm) * compasCantidad).toFixed(2) }}</span>

    <button class="lblCabecera" @click="clickListo">✔️</button>
    <button class="lblCabecera" @click="clickCancelar">❌</button>
  </div>
</template>
<style scoped>
/* Contenedor principal con diseño moderno */
.ctrlEdit {
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.12) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
  border: 1px solid rgba(169, 168, 246, 0.4);
  border-radius: 12px;
  padding: 15px 20px;
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.1);
}

/* Labels mejorados */
.lblCabecera {
  color: #a9a8f6;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

/* Range slider mejorado */
input[type='range'] {
  background: linear-gradient(to right, #4a5568, #a9a8f6) !important;
  border-radius: 8px;
  height: 8px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  width: 150px;
  cursor: pointer;
  flex-shrink: 0;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a9a8f6 0%, #8b7cf6 100%);
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.3);
}

input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a9a8f6 0%, #8b7cf6 100%);
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.3);
}

/* Select mejorado */
select {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  color: #ffffff;
  padding: 8px 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  min-width: 80px;
}

select:hover {
  border-color: #ffffff;
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.2);
}

select option {
  background: #2d3748;
  color: #ffffff;
  padding: 8px;
}

/* Spans de información con mejor estilo */
span {
  color: #ffffff;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Botones mejorados */
button {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  color: #ffffff;
  padding: 10px 15px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover {
  background: linear-gradient(135deg, #a9a8f6 0%, #8b7cf6 100%);
  border-color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(169, 168, 246, 0.3);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(169, 168, 246, 0.2);
}

/* Responsive design */
@media (max-width: 768px) {
  .ctrlEdit {
    padding: 12px 15px;
    gap: 8px;
    flex-wrap: wrap;
  }

  input[type='range'] {
    width: 120px;
  }

  .lblCabecera {
    font-size: 0.8rem;
  }

  button {
    padding: 8px 12px;
    font-size: 1rem;
    min-width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .ctrlEdit {
    padding: 10px 12px;
    gap: 6px;
    flex-wrap: wrap;
  }

  input[type='range'] {
    width: 100px;
  }

  .lblCabecera {
    font-size: 0.75rem;
  }

  select {
    padding: 6px 10px;
    font-size: 0.9rem;
    min-width: 70px;
  }

  button {
    padding: 6px 10px;
    font-size: 0.9rem;
    min-width: 35px;
    height: 35px;
  }

  span {
    font-size: 0.85rem;
  }
}
</style>
