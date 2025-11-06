<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import cabecera from '../components/comp_editar/editarcabecera.vue'
import editAcordes from '../components/comp_editar/editAcordes.vue'
import consolaAcordes from '../components/comp_editar/consolaAcordes.vue'
import EditarLetraAcorde from '../components/comp_editar/editarLetraYAcordes.vue'
import TocarPentagrama from '../components/comp_tocar/Tocar_Pentagrama.vue'
import Secuencia from '../components/comp_editar/editSecuencia.vue'
import editartexto from '../components/comp_editar/editarconsola.vue'
import editarpentagrama from '../components/comp_editar/editarpentagrama.vue'

import { onMounted, ref, watch, type Ref } from 'vue'
import { Pantalla } from '../modelo/pantalla'
import type { VistaTocar } from '../modelo/configuracion'

const pantalla = new Pantalla()
const editandoCompas = ref(-1)
function cambiarCompas(compas: number) {
  editandoCompas.value = compas
  Actualizar()
}
const appStore = useAppStore()

onMounted(() => {
  pantalla.setearEstilos()
})

const vista: Ref<VistaTocar> = ref(pantalla.getConfiguracionPantalla())
const viendo: Ref<string> = ref(
  localStorage.getItem('viendo_vista_editando') || 'inicio',
)
function GetStylePantallaEdit() {
  let direccion: 'row' | 'row-reverse' | 'column' | 'column-reverse' = vista
    .value.invertido
    ? 'row-reverse'
    : 'row'

  if (vista.value.modo == 'simple') {
    direccion = vista.value.invertido ? 'column' : 'column-reverse'
  }
  return {
    height: pantalla.getAltoPantalla() + 'px',
    'flex-direction': direccion,
  }
}

function estiloVistaPrincipal() {
  if (viendo.value == 'editartexto') {
    return `width: 100%; height: 100%`
  }
  return `width: ${pantalla.getConfiguracionPantalla().anchoPrincipal}%; height: 100%`
}

function estiloVistaSecundaria() {
  if (viendo.value == 'editartexto') {
    return `width: 0%; height: 100%`
  }
  return `width: ${100 - pantalla.getConfiguracionPantalla().anchoPrincipal}%;`
}
const ctrlEditarTexto = ref()
const ctrlSecuencia = ref()
const ctrlTocarPentagrama = ref()

function cambiarVista(nvista: string) {
  viendo.value = nvista
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
const viendoModo = ref(0)
function cambioModo(index: number) {
  viendoModo.value = index
}
</script>
<template>
  <cabecera
    :cancion="appStore.editandocancion"
    :origen="appStore.origenEditando"
    @editarPentagramas="cambiarVista('pentagramas')"
  ></cabecera>
  <div style="display: flex" class="vistaEdit" :style="GetStylePantallaEdit()">
    <div :style="estiloVistaPrincipal()">
      <div
        style="position: relative; left: 96%"
        v-on:click="cambiarVista('editartexto')"
        v-if="viendo === 'inicio'"
      >
        🔄
      </div>

      <TocarPentagrama
        v-if="viendo === 'pentagramas'"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
        @clickCompas="cambiarCompas"
        @clickCambioModo="cambioModo"
        :editando="true"
        ref="ctrlTocarPentagrama"
      ></TocarPentagrama>

      <EditarLetraAcorde
        v-if="viendo != 'editartexto' && viendo != 'pentagramas'"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
        ref="ctrlEditarTexto"
        @clickCompas="cambiarCompas"
      ></EditarLetraAcorde>

      <editartexto
        v-if="viendo == 'editartexto'"
        @cerrar="clickCerrarEditar"
        :cancion="appStore.editandocancion"
        @actualizoPentagrama="Actualizar"
        :compas="editandoCompas"
        :ver-acordes="false"
        :ver-metrica-es="false"
      ></editartexto>
    </div>

    <div :style="estiloVistaSecundaria()" v-if="viendo === 'pentagramas'">
      <editarpentagrama
        @cerrar="clickCerrarEditar"
        @actualizoPentagrama="Actualizar"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
        :editandoModo="viendoModo"
        @clickCompas="cambiarCompas"
      >
        >
      </editarpentagrama>
    </div>
    <div :style="estiloVistaSecundaria()" v-if="viendo !== 'pentagramas'">
      <editAcordes
        v-if="viendo == 'editaracordes'"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
      ></editAcordes>

      <consola-acordes
        v-if="viendo == 'editconsolaacordes'"
        @cerrar="clickCerrarEditar"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
      ></consola-acordes>
      <div
        style="position: relative; left: 96%"
        v-on:click="cambiarVista('editconsolaacordes')"
        v-if="viendo === 'inicio'"
      >
        🔄
      </div>
      <Secuencia
        ref="ctrlSecuencia"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
        @cambioCompas="cambiarCompas"
        v-if="viendo !== 'editconsolaacordes' && viendo !== 'editaracordes'"
      ></Secuencia>
    </div>
  </div>
</template>
<style scoped>
.read-the-docs {
  color: #888;
}

.vistaEdit {
  position: relative;
  padding: 2px;
  padding-left: 10px;
}
.dropdown-superior-derecha {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
