<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { OrigenCancion } from '../../modelo/cancion/origencancion'
const emit = defineEmits(['cerrar'])
const props = defineProps<{
  cancion: Cancion
  origen: OrigenCancion
}>()

const nombrecancion = ref('')
const nombrebanda = ref('')
const nombrearchivo = ref('')
const calidad = ref(props.cancion.calidad)
nombrecancion.value = props.cancion.cancion
nombrebanda.value = props.cancion.banda
nombrearchivo.value = props.cancion.archivo || 'archivo_noload'

function clickCancelarCambiarDatos() {
  props.cancion.cancion = nombrecancion.value
  props.cancion.banda = nombrebanda.value
  props.cancion.archivo = nombrearchivo.value
  props.cancion.calidad = calidad.value
  emit('cerrar', false)
}
function clickOkCambiarDatos() {
  emit('cerrar', false)
}

function hacerNombreArchivo() {
  props.cancion.normalizar()

  // Generar el nombre del archivo basándose en banda y canción
  props.cancion.archivo =
    props.cancion.banda.toLowerCase().replace(/ /g, '-') +
    '_' +
    props.cancion.cancion.toLowerCase().replace(/ /g, '-')

  nombrecancion.value = props.cancion.cancion
  nombrebanda.value = props.cancion.banda
  nombrearchivo.value = props.cancion.archivo || 'archivo_noload'
}
hacerNombreArchivo()
</script>
<template>
  <div></div>
  <div class="ctrlEdit">
    <div>
      <label>Cancion:</label>
      <input
        type="text"
        v-model="props.cancion.cancion"
        :style="{ width: props.cancion.cancion.length + 'ch' }"
        @change="hacerNombreArchivo"
        class="input-editable"
      />
    </div>
    <div>
      <label>Banda:</label>
      <input
        type="text"
        class="input-editable"
        v-model="props.cancion.banda"
        @change="hacerNombreArchivo"
        :style="{ width: props.cancion.banda.length + 1 + 'ch' }"
      />
    </div>

    <div>
      <label>Archivo:</label>
      <input
        type="text"
        class="input-editable"
        v-model="props.cancion.archivo"
        :style="{ width: props.cancion.archivo.length + 'ch' }"
      />
    </div>
    <div>
      <label>Calidad:</label>
      <select v-model="cancion.calidad">
        <option value="-1">♻️ Reprocesar</option>
        <option value="0">⭐⚫⚫⚫⚫ De Internet</option>
        <option value="1">⭐⭐⚫⚫⚫ Texto Sincronizado</option>
        <option value="2">⭐⭐⭐⚫⚫ Texto Corregido</option>
        <option value="3">Ok</option>
      </select>
    </div>
    <div>
      <button class="lblCabecera" @click="clickOkCambiarDatos">✔️</button>
      <button class="lblCabecera" @click="clickCancelarCambiarDatos">❌</button>
    </div>
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
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.1);
}

/* Grupos de campos */
.ctrlEdit > div {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Labels mejorados */
label {
  color: #a9a8f6;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 60px;
  flex-shrink: 0;
}

/* Inputs mejorados */
.input-editable {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 8px;
  color: #ffffff;
  padding: 8px 12px;
  font-size: 0.95rem;
  font-weight: 500;
  outline: none;
  transition: all 0.2s ease;
  min-width: 100px;
  max-width: 200px;
}

.input-editable:focus {
  border-color: #a9a8f6;
  box-shadow: 0 0 0 2px rgba(169, 168, 246, 0.2);
  background: linear-gradient(135deg, #5a6578 0%, #3d4758 100%);
}

.input-editable:hover {
  border-color: rgba(169, 168, 246, 0.7);
}

/* Select mejorado */
select {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  color: #ffffff;
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  min-width: 160px;
  transition: all 0.2s ease;
}

select:hover {
  border-color: #ffffff;
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.2);
}

select:focus {
  border-color: #a9a8f6;
  box-shadow: 0 0 0 2px rgba(169, 168, 246, 0.2);
}

select option {
  background: #2d3748;
  color: #ffffff;
  padding: 8px;
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
  margin: 0 3px;
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

/* Clase específica para botones de cabecera */
.lblCabecera {
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 768px) {
  .ctrlEdit {
    padding: 12px 15px;
    gap: 10px;
    flex-direction: column;
    align-items: stretch;
  }

  .ctrlEdit > div {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    width: 100%;
  }

  label {
    font-size: 0.8rem;
    min-width: auto;
  }

  .input-editable {
    width: 100%;
    max-width: none;
    font-size: 0.9rem;
    padding: 10px 12px;
  }

  select {
    width: 100%;
    min-width: auto;
    font-size: 0.85rem;
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
    gap: 8px;
  }

  label {
    font-size: 0.75rem;
  }

  .input-editable {
    font-size: 0.85rem;
    padding: 8px 10px;
  }

  select {
    font-size: 0.8rem;
    padding: 6px 10px;
  }

  button {
    padding: 6px 10px;
    font-size: 0.9rem;
    min-width: 35px;
    height: 35px;
  }
}
</style>
