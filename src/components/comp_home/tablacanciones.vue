<script setup lang="ts">
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'

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
</script>

<template>
  <table style="width: 100%; margin-top: 20px">
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
    <tbody>
      <template v-for="(cancion, index) in canciones" :key="index">
        <tr>
          <td>{{ arreglartexto(cancion.cancion) }}</td>
          <td>{{ arreglartexto(cancion.banda) }}</td>
          <td>{{ cancion.duracion }}</td>
          <td>{{ cancion.escala }}</td>
          <td>
            <span @click="VerDetalle(index)">[ + ]</span>
          </td>
        </tr>
        <tr v-if="viendoDetalle === index">
          <td colspan="5">
            <span @click="Reproducir(index)">[Tocar]</span>
            <span @click="Reproducir(index)">[Borrar]</span>
            <span @click="Reproducir(index)">[Agregar a Lista]</span>
          </td>
        </tr>
      </template>

      <tr>
        <td>tema</td>
        <td>df</td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>
