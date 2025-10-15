<script setup lang="ts">
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'
import { Tiempo } from '../../modelo/tiempo'

const emit = defineEmits(['tocar', 'borrar', 'agregarALista'])
const props = defineProps<{
  canciones: ItemIndiceCancion[]
}>()
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

const viendoFiltroTabla = ref(false)
const viendoDetalle = ref<number | null>(null)
function VerDetalle(index: number) {
  if (viendoDetalle.value === index) {
    viendoDetalle.value = null
  } else {
    viendoDetalle.value = index
  }
}

const tiempo = new Tiempo()
function Reproducir(index: number) {
  emit('tocar', props.canciones[index].origen)
}
function Borrar(index: number) {
  emit('borrar', props.canciones[index].origen)
}

function AgregarALista(index: number) {
  emit('agregarALista', props.canciones[index])
}
</script>

<template>
  <table style="width: 90%; margin-top: 20px; border: 1px solid">
    <thead>
      <tr>
        <template v-if="!viendoFiltroTabla">
          <th>Tema</th>
          <th>Banda</th>
          <th>Duracion</th>
          <th>Escala</th>
        </template>
        <template v-if="viendoFiltroTabla">
          <th colspan="4">
            <input type="text" placeholder="Filtrar..." style="width: 100%" />
          </th>
        </template>
        <th>
          <span
            @click="viendoFiltroTabla = !viendoFiltroTabla"
            style="cursor: pointer"
          >
            [ {{ viendoFiltroTabla ? '-' : 'FILTRAR' }} ]
          </span>
        </th>
      </tr>
    </thead>
    <tbody v-if="canciones.length === 0">
      <tr>
        <td colspan="5" style="text-align: center">
          No tenes canciones en el LocalStorage
        </td>
      </tr>
    </tbody>
    <tbody v-if="canciones.length > 0">
      <template v-for="(cancion, index) in canciones" :key="index">
        <tr @click="VerDetalle(index)">
          <td>{{ arreglartexto(cancion.cancion) }}</td>
          <td>{{ arreglartexto(cancion.banda) }}</td>
          <td>
            {{
              tiempo.formatSegundos(
                (60 / cancion.bpm) *
                  cancion.totalCompases *
                  cancion.compasCantidad,
              )
            }}
          </td>
          <td>{{ cancion.escala }}</td>
          <td></td>
        </tr>
        <tr v-if="viendoDetalle === index" data-detail>
          <td colspan="5" style="text-align: right">
            <span @click="Reproducir(index)">[Tocar]</span>
            <span @click="Borrar(index)">[Borrar]</span>
            <span @click="AgregarALista(index)">[Agregar a Lista]</span>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
table {
  border-collapse: collapse;
}

tr {
  border-bottom: 1px solid #ccc;
}

/* Remove bottom border from row when detail is shown */
tr:has(+ tr[data-detail]) {
  border-bottom: none;
}

th,
td {
  padding: 8px;
}
</style>
