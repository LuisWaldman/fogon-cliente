<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Media } from '../../modelo/cancion/media'
import { OrigenCancion } from '../../modelo/cancion/origencancion'

const emit = defineEmits(['cerrar'])
const props = defineProps<{
  cancion: Cancion
  origen: OrigenCancion
}>()

const refMedias = ref<Media[]>(props.cancion.medias)
const tiposPermitidos = ['Youtube', 'Spotify', 'Midi']

const agregarMedia = () => {
  refMedias.value.push(new Media('Youtube', '', 0))
}

const eliminarMedia = (index: number) => {
  refMedias.value.splice(index, 1)
}

const guardarCambios = () => {
  props.cancion.medias = refMedias.value
  emit('cerrar')
}
</script>
<template>
  <div>

      

      <span @click="emit('cerrar')">[Cancelar]</span>
      <span @click="guardarCambios">[Guardar]</span>
      <span @click="agregarMedia">[+ Agregar Medio]</span>
    </div>
    <!-- Lista de medias existentes -->
    <div v-for="(media, index) in refMedias" :key="index">
      <div class="media-controls">
        <select v-model="media.tipo">
          <option v-for="tipo in tiposPermitidos" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>

        <input v-model="media.id" placeholder="ID del media" />
        <input
          v-model="media.delay"
          placeholder="Delay del media"
          class="delay-input"
        />

        <button @click="eliminarMedia(index)" class="btn-eliminar">❌</button>
      </div>
    </div>

</template>
<style scoped>
.container-medias {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.media-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.media-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tipo-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 100px;
}

.id-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-eliminar {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.btn-eliminar:hover {
  background-color: #ffebee;
}

.acciones {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-agregar,
.btn-cerrar {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-agregar {
  background-color: #4caf50;
  color: white;
}

.btn-agregar:hover {
  background-color: #45a049;
}

.btn-cerrar {
  background-color: #f44336;
  color: white;
}

.btn-cerrar:hover {
  background-color: #da190b;
}
</style>
