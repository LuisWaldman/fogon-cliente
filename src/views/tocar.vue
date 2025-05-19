<script setup lang="ts">
import { ref } from 'vue'
import TocarLetra from '../components/comp_cabecera/comp_tocar/Tocar_Letra.vue'
import { useAppStore } from '../stores/appStore'
import { VistaControl } from '../modelo/VistaControl'
const vistaKaraoke = ref(
  new VistaControl(20, 12, 7, 'acordes_seguidos', 'col-9', 90000),
)
const appStore = useAppStore()

const urlParams = new URLSearchParams(window.location.search)
const nombreCancion = urlParams.get('cancion')
appStore.tocar(nombreCancion as string)
</script>
<template>
  <div>
    <TocarLetra
      v-if="appStore.cancion"
      :cancion="appStore.cancion"
      :compas="-1"
      :vista="vistaKaraoke"
    ></TocarLetra>
  </div>
</template>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
