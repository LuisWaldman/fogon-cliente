<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Media } from '../../modelo/cancion/media'

const emit = defineEmits(['cerrar'])
const props = defineProps<{
  cancion: Cancion
}>()

const id = ref<string>('')
const delay = ref<number>(0)
if (props.cancion.medias.length > 0) {
  id.value = props.cancion.medias[0].id
  delay.value = props.cancion.medias[0].delay
}
const duracionGolpe = ref<number>(props.cancion.duracionGolpe * 1000)
const exid = ref<string>(id.value)
const exlength = ref<number>(props.cancion.medias.length)
const exdelay = ref<number>(delay.value)

// Calculo los valores
const delayGolpe = ref<number>(Math.floor(delay.value / duracionGolpe.value))
const sobranteDelay = ref<number>(
  Math.floor(delay.value - delayGolpe.value * duracionGolpe.value),
)

function clickCancelarCambiarDatos() {
  if (exlength.value == 0) {
    props.cancion.medias = []
    emit('cerrar')
    return
  }
  if (props.cancion.medias.length > 0) {
    props.cancion.medias[0].id = exid.value
    props.cancion.medias[0].delay = exdelay.value
    emit('cerrar')
  }
}

function cambiarDatos() {
  delay.value = delayGolpe.value * duracionGolpe.value + sobranteDelay.value
  if (props.cancion.medias.length == 0) {
    const media = new Media('youtube', id.value, delay.value)
    props.cancion.medias.push(media)
  } else {
    props.cancion.medias[0].id = id.value
    props.cancion.medias[0].delay = delay.value
  }
}

function clickOkCambiarDatos() {
  cambiarDatos()
  emit('cerrar')
}
</script>
<template>
  <div></div>
  <div class="ctrlEdit">
    <div>
      <label>ID Youtube:</label>
      <input
        type="text"
        v-model="id"
        placeholder="ID de Youtube"
        @change="cambiarDatos"
        class="input-editable"
        :style="{ width: Math.max(id.length, 15) + 'ch' }"
      />
    </div>

    <div>
      <label>Golpes:</label>
      <input
        type="number"
        v-model="delayGolpe"
        @change="cambiarDatos"
        class="input-editable number-input"
      />
    </div>

    <div>
      <label>Sobran:</label>
      <input
        type="number"
        v-model="sobranteDelay"
        @change="cambiarDatos"
        class="input-editable number-input"
      />
      <span class="unit-label">ms</span>
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

/* Inputs numéricos */
.number-input {
  text-align: right;
  width: 80px !important;
  max-width: 80px !important;
}

/* Etiqueta de unidad */
.unit-label {
  color: #a9a8f6;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 5px;
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

  .number-input {
    width: 100% !important;
    max-width: none !important;
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

  button {
    padding: 6px 10px;
    font-size: 0.9rem;
    min-width: 35px;
    height: 35px;
  }
}
</style>
