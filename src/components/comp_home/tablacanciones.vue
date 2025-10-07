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
          <span @click="viendoFiltroTabla = !viendoFiltroTabla" style="cursor: pointer">
            [ {{ viendoFiltroTabla ? '-' : 'FILTRAR' }} ]
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(cancion, index) in canciones" :key="index">
        <tr>
          <td>{{ cancion.cancion }}</td>
          <td>{{ cancion.banda }}</td>
          <td>{{ cancion.duracion }}</td>
          <td>{{ cancion.escala }}</td>
          <td>
            <span>[ + ]</span>
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

<script setup lang="ts">
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'

const props = defineProps<{
  canciones: ItemIndiceCancion[]
}>()

const viendoFiltroTabla = ref(false)
</script>