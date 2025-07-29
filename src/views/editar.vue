<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import cabecera from '../components/comp_editar/editarcabecera.vue'
import editartexto from '../components/comp_editar/editartexto.vue'
import { HelperObtenerCancionURL } from '../helpers/HelperObtenerCancionURL'

const appStore = useAppStore()
const helperArchivo = new HelperObtenerCancionURL('/canciones')
helperArchivo
  .GetCancion('andres-calamaro_una-forma-de-vida')
  .then((cancion) => {
    appStore.editandocancion = cancion
  })
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
