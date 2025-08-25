<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import cabecera from '../components/comp_editar/editarcabecera.vue'
import editAcordes from '../components/comp_editar/editAcordes.vue'
import consolaAcordes from '../components/comp_editar/consolaAcordes.vue'
import TocarLetraAcorde from '../components/comp_tocar/Tocar_LetraYAcordes.vue'
import TocarPentagrama from '../components/comp_tocar/Tocar_Pentagrama.vue'
import Secuencia from '../components/comp_editar/editSecuencia.vue'
import sugerencias from '../components/comp_editar/sugerencias.vue'
import editartexto from '../components/comp_editar/editarconsola.vue'
import editarpentagrama from '../components/comp_editar/editarpentagrama.vue'

import { ref, watch, type Ref } from 'vue'
import { Pantalla } from '../modelo/pantalla'

const pantalla = new Pantalla()
const editandoCompas = ref(-1)
function cambiarCompas(compas: number) {
  editandoCompas.value = compas
  Actualizar()
}
const appStore = useAppStore()
class vistaTocar {
  viendo: string = 'inicio'
  viendoacordes: boolean = true
  verEditandoMetricaEs: boolean = true
  verEditandoAcordes: boolean = true
}
const vista: Ref<vistaTocar> = ref(new vistaTocar())
function GetStylePantallaEdit() {
  return {
    width: pantalla.getAnchoPantalla() + 'px',
    height: pantalla.getAltoPantalla() + 'px',
  }
}

function estiloVistaPrincipal() {
  if (vista.value.viendo == 'editartexto') {
    return `width: 100%; height: 100%`
  }
  return `width: ${pantalla.getConfiguracionPantalla().anchoPrincipal}%; height: 100%`
}

function estiloVistaSecundaria() {
  if (vista.value.viendo == 'editartexto') {
    return `width: 0%; height: 100%`
  }
  return `width: ${100 - pantalla.getConfiguracionPantalla().anchoPrincipal}%;`
}
const ctrlEditarTexto = ref()
const ctrlSecuencia = ref()
const ctrlTocarPentagrama = ref()

function cambiarVista(nvista: string) {
  vista.value.viendo = nvista
  localStorage.setItem('viendo_vista_editando', nvista)
}

function clickCerrarEditar() {
  // Set the current view to 'inicio'
  cambiarVista('inicio')
}

function Actualizar() {
  if (ctrlEditarTexto.value) {
    ctrlEditarTexto.value.Actualizar()
    ctrlSecuencia.value.Actualizar()
  } else {
    ctrlTocarPentagrama.value.Actualizar()
  }
}

watch(
  () => appStore.editandocancion.escala,
  () => {
    if (ctrlEditarTexto.value) {
      ctrlEditarTexto.value.Actualizar()
    }
  },
)

watch(
  () => appStore.editandocancion,
  () => {
    if (ctrlEditarTexto.value) {
      ctrlEditarTexto.value.Actualizar()
    }
  },
)
</script>
<template>
  <cabecera
    :cancion="appStore.editandocancion"
    :origen="appStore.origenEditando"
    @editarPentagramas="cambiarVista('pentagramas')"
  ></cabecera>
  <div style="display: flex" class="relativo" :style="GetStylePantallaEdit()">
    <div style="width: 70%" :style="estiloVistaPrincipal()">
      <div
        style="position: relative; left: 96%"
        v-on:click="cambiarVista('editartexto')"
        v-if="vista.viendo === 'inicio'"
      >
        🔄
      </div>

      <TocarPentagrama
        v-if="vista.viendo === 'pentagramas'"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
        @clickCompas="cambiarCompas"
        ref="ctrlTocarPentagrama"
      ></TocarPentagrama>

      <TocarLetraAcorde
        v-if="vista.viendo != 'editartexto' && vista.viendo != 'pentagramas'"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
        ref="ctrlEditarTexto"
        @clickCompas="cambiarCompas"
      ></TocarLetraAcorde>

      <editartexto
        v-if="vista.viendo == 'editartexto'"
        @cerrar="clickCerrarEditar"
        :cancion="appStore.editandocancion"
        @actualizoPentagrama="Actualizar"
        :compas="editandoCompas"
        :ver-acordes="vista.verEditandoAcordes"
        :ver-metrica-es="vista.verEditandoMetricaEs"
      ></editartexto>
    </div>

    <div :style="estiloVistaSecundaria()" v-if="vista.viendo === 'pentagramas'">
      <editarpentagrama
        @cerrar="clickCerrarEditar"
        @actualizoPentagrama="Actualizar"
        :cancion="appStore.editandocancion"
      >
      </editarpentagrama>
    </div>
    <div :style="estiloVistaSecundaria()" v-if="vista.viendo !== 'pentagramas'">
      <sugerencias
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
        @cambioCompas="cambiarCompas"
        @actualizarCancion="Actualizar"
        v-if="
          vista.viendo !== 'editconsolaacordes' &&
          vista.viendo !== 'editaracordes'
        "
      ></sugerencias>
      <editAcordes
        v-if="vista.viendo == 'editaracordes'"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
      ></editAcordes>

      <consola-acordes
        v-if="vista.viendo == 'editconsolaacordes'"
        @cerrar="clickCerrarEditar"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
      ></consola-acordes>
      <div
        style="position: relative; left: 96%"
        v-on:click="cambiarVista('editconsolaacordes')"
        v-if="vista.viendo === 'inicio'"
      >
        🔄
      </div>
      <Secuencia
        ref="ctrlSecuencia"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
        @cambioCompas="cambiarCompas"
        v-if="
          vista.viendo !== 'editconsolaacordes' &&
          vista.viendo !== 'editaracordes'
        "
      ></Secuencia>
    </div>
  </div>
</template>
<style scoped>
.read-the-docs {
  color: #888;
}

.relativo {
  position: relative;
}
.dropdown-superior-derecha {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
