<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import cabecera from '../components/comp_editar/editarcabecera.vue'
import editartexto from '../components/comp_editar/editartexto.vue'
import { HelperObtenerCancionURL } from '../helpers/HelperObtenerCancionURL'
import { ref } from 'vue'

const appStore = useAppStore()
const helperArchivo = new HelperObtenerCancionURL('/canciones')
const ctrlEditarTexto = ref();
helperArchivo
  .GetCancion('andres-calamaro_una-forma-de-vida')
  .then((cancion) => {
    appStore.editandocancion = cancion
    ctrlEditarTexto.value?.updateContent()
  })
</script>
<template>
  <cabecera></cabecera>
  <div style="display: flex">
    <div class="col-9">
      <editartexto
        ref="ctrlEditarTexto"
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
