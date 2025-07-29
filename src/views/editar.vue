<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import cabecera from '../components/comp_editar/editarcabecera.vue'
import editartexto from '../components/comp_editar/editartexto.vue'

const appStore = useAppStore()
</script>
<template>
  <cabecera></cabecera>
  <div style="display: flex">
    <div class="col-9">
      <editartexto
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
      ></editartexto>
    </div>
    <div class="col-3">
      {{ appStore.editandocancion }}
    </div>
  </div>
</template>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
