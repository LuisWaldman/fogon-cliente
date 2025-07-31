<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import cabecera from '../components/comp_editar/editarcabecera.vue'
import editartexto from '../components/comp_editar/editartexto.vue'
import editAcordes from '../components/comp_editar/editAcordes.vue'

import { ref, type Ref } from 'vue'
import { Pantalla } from '../modelo/pantalla'

const pantalla = new Pantalla()

function GetStylePantallaEdit() {
  return {
    width: pantalla.getAnchoPantalla() + 'px',
    height: pantalla.getAltoPantalla() + 'px',
  }
}


function claseVistaPrincipal() {

  //return 'col-' + pantalla.getConfiguracionPantalla().anchoPrincipal
  return ''
}

function claseVistaSecundaria() {
  //return 'col-' + (11 - pantalla.getConfiguracionPantalla().anchoPrincipal)
  return ''
}

const appStore = useAppStore()
const ctrlEditarTexto = ref()

ctrlEditarTexto.value?.updateContent()
</script>
<template>
  <cabecera></cabecera>
  <div style="display: flex"
  :style="GetStylePantallaEdit()">
    <div style="width: 70%;" :style="claseVistaPrincipal()">
      <editartexto
        :ref="ctrlEditarTexto"
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
      ></editartexto>
    </div>
    <div :style="claseVistaSecundaria()">
      <editAcordes
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
      ></editAcordes>
    </div>
  </div>
</template>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
