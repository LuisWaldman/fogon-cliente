<script setup lang="ts">
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'
import emoticonOrigen from './emoticonOrigen.vue'
import { Tiempo } from '../../modelo/tiempo'
const calidad = ['web', 'revisada', 'garantizada']
const agregandoLista = ref(false)
const props = defineProps<{
  cancion: ItemIndiceCancion
  listasstore: string[]
  listasserverstore: string[]
}>()
const listaseleccionada = ref<string>('actual')
const tiempo = new Tiempo()
const viendoDetalle = ref(false)

function arreglartexto(texto: string): string {
  if (texto == null || texto === undefined) return ''
  let processed = texto.replace(/-/g, ' ')
  if (processed.length === 0) return processed

  // First letter lowercase, rest uppercase
  processed =
    processed.charAt(0).toUpperCase() + processed.slice(1).toLocaleLowerCase()

  // Truncate if longer than 50 characters
  if (processed.length > 50) {
    processed = processed.substring(0, 47) + '...'
  }

  return processed
}

const emit = defineEmits(['click', 'agregar', 'borrar'])
function clickAgregar() {
  emit('agregar', listaseleccionada.value)
}
</script>

<template>
  <div class="cancion">
    <div @click="viendoDetalle = !viendoDetalle" class="nombreCancion">
      {{ arreglartexto(props.cancion.cancion) }}
    </div>
    <div class="origen-indicador">
      <emoticonOrigen :origen="props.cancion.origen.origenUrl" />
    </div>
    <div>{{ arreglartexto(props.cancion.banda) }}</div>
    <div v-if="viendoDetalle" style="display: flex">
      <div class="colDetalle">
        <div>
          Escala: <label>{{ props.cancion.escala }}</label>
        </div>
        <div>
          Compases: <label>{{ props.cancion.totalCompases }}</label>
        </div>
        <div>
          Ritmo: <label>{{ props.cancion.compasCantidad }}</label> /
          <label>{{ props.cancion.compasUnidad }}</label>
        </div>
      </div>
      <div class="colDetalle">
        <div>
          Duracion:
          <label>{{
            tiempo.formatSegundos(
              (60 / props.cancion.bpm) *
                props.cancion.totalCompases *
                props.cancion.compasCantidad,
            )
          }}</label>
        </div>
        <div class="colDetalle">
          BPM: <label>{{ props.cancion.bpm }}</label>
        </div>
        <div class="colDetalle">
          Calidad: <label>{{ calidad[props.cancion.calidad] }}</label>
        </div>
      </div>
    </div>
    <div v-if="viendoDetalle && props.cancion.video">
      <span>VIDEO</span>
    </div>
    <div v-if="viendoDetalle && props.cancion.pentagramas.length > 0">
      <span
        >PENTAGRAMAS:
        <label>{{ props.cancion.pentagramas.join(', ') }}</label></span
      >
    </div>

    <div v-if="viendoDetalle && props.cancion.etiquetas.length > 0">
      <span
        >Etiquetas:
        <label>{{ props.cancion.etiquetas.join(', ') }}</label></span
      >
    </div>
    <div v-if="viendoDetalle">
      <span @click="$emit('click')">[Tocar]</span>
      <span @click="agregandoLista = !agregandoLista">[Agregar]</span>
      <span>[Borrar]</span>
    </div>
    <div style="display: flex" v-if="viendoDetalle && agregandoLista">
      <select v-model="listaseleccionada" style="width: 60%">
        <optgroup>
          <option value="actual">Lista Actual</option>
        </optgroup>
        <optgroup>
          <option
            v-for="lista in props.listasstore"
            :key="lista"
            :value="'local_' + lista"
          >
            💾 {{ lista }}
          </option>
        </optgroup>
        <optgroup>
          <option
            v-for="lista in props.listasserverstore"
            :key="lista"
            :value="'server_' + lista"
          >
            🔌 {{ lista }}
          </option>
        </optgroup>
      </select>
      <div @click="clickAgregar">[AGREGAR]</div>
      <div @click="agregandoLista = false">[CANCELAR]</div>
    </div>
  </div>
</template>
<style scoped>
.nombreCancion {
  font-weight: bold;
  font-size: 1.2em;
}

.colDetalle div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 5px;
}

.colDetalle {
  padding: 10px;
}
.colDetalle label {
  font-weight: bold;
  font-size: 1.3em;
}
.cancion {
  cursor: pointer;
  position: relative;
  padding: 15px;
  border: 1px solid #ccc;
  margin: 5px;
  border-radius: 4px;
  max-width: 24%;
}
.cancion:hover {
  background-color: #1f1818;
}
.origen-indicador {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
