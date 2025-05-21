<script setup lang="ts">
import { ref, type Ref } from 'vue'
//import TocarLetra from '../components/comp_cabecera/comp_tocar/Tocar_Letra.vue'
import TocarLetra from '../components/comp_tocar/Tocar_Letra.vue'
import TocarLetraAcorde from '../components/comp_tocar/Tocar_LetraYAcordes.vue'
import TocarAcorde from '../components/comp_tocar/Tocar_Acordes.vue'
import Lateral from '../components/comp_tocar/Lateral_Acordes.vue'
import { useAppStore } from '../stores/appStore'
import { VistaControl } from '../modelo/VistaControl'

const appStore = useAppStore()

const urlParams = new URLSearchParams(window.location.search)
const nombreCancion = urlParams.get('cancion')
appStore.tocar(nombreCancion as string)

class vistaTocar {
  viendo: string = 'karaoke'
  secuencia: boolean = true
  partes: boolean = true
  largoPrincipal: number = 70
}
const vista: Ref<vistaTocar> = ref(new vistaTocar())
vista.value.viendo = localStorage.getItem('viendo_vista_tocando') || 'karaoke'
vista.value.secuencia =
  localStorage.getItem('secuencia') == 'true' ? true : false
vista.value.partes = localStorage.getItem('partes') == 'true' ? true : false
adecuAncho()
function cambiarVista(nvista: string) {
  vista.value.viendo = nvista
  localStorage.setItem('viendo_vista_tocando', nvista)
  adecuAncho()
}
function adecuAncho() {
  if (vista.value.secuencia || vista.value.partes) {
    vista.value.largoPrincipal = 70
  } else {
    vista.value.largoPrincipal = 100
  }
}
function clickSecuencia() {
  vista.value.secuencia = !vista.value.secuencia
  localStorage.setItem('secuencia', vista.value.secuencia ? 'true' : 'false')
  adecuAncho()
}

function clickPartes() {
  vista.value.partes = !vista.value.partes
  localStorage.setItem('partes', vista.value.partes ? 'true' : 'false')
  adecuAncho()
}

function GetStylePantallaPlay() {
  return {
    width: window.innerWidth + 'px',
    height: window.innerHeight + 'px',
  }
}

/*
 ;
  public height: number = ;
*/

const vistaLetraYAcordes = ref(
  new VistaControl(
    20,
    12,
    7,
    'acordes_seguidos',
    'col-9',
    window.innerHeight - 180,
  ),
)
const vistaKaraoke = ref(
  new VistaControl(
    20,
    12,
    7,
    'acordes_seguidos',
    'col-9',
    window.innerHeight - 180,
  ),
)
const vistaAcordes = ref(
  new VistaControl(
    30,
    12,
    7,
    'acordes_seguidos',
    'col-9',
    window.innerHeight - 240,
  ),
)
</script>

<template>
  <div
    class="pantallaPlay"
    :style="GetStylePantallaPlay()"
    v-if="appStore.cancion"
  >
    <div :style="{ width: vista.largoPrincipal + '%' }">
      r
      <TocarLetraAcorde
        v-if="vista.viendo == 'acordes'"
        :cancion="appStore.cancion"
        :compas="appStore.compas"
        :vista="vistaLetraYAcordes"
      ></TocarLetraAcorde>
      <TocarLetra
        v-if="vista.viendo == 'karaoke'"
        :cancion="appStore.cancion"
        :compas="appStore.compas"
        :vista="vistaKaraoke"
      ></TocarLetra>
      <TocarAcorde
        v-if="vista.viendo == 'soloacordes'"
        :cancion="appStore.cancion"
        :compas="appStore.compas"
        :vista="vistaKaraoke"
      ></TocarAcorde>
    </div>
    <div :style="{ width: 100 - vista.largoPrincipal + '%' }">
      <Lateral
        :cancion="appStore.cancion"
        :compas="appStore.compas"
        :vista="vistaAcordes"
        :secuencia="vista.secuencia"
        :partes="vista.partes"
      ></Lateral>
    </div>
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="bi bi-eye"></i>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li v-on:click="cambiarVista('karaoke')">
          <a class="dropdown-item" href="#">Karaoke</a>
        </li>
        <li v-on:click="cambiarVista('acordes')">
          <a class="dropdown-item" href="#">Acordes</a>
        </li>
        <li v-on:click="cambiarVista('soloacordes')">
          <a class="dropdown-item" href="#">Solo Acordes</a>
        </li>
        <li><hr class="dropdown-divider" /></li>

        <li v-on:click="clickSecuencia()">
          <a class="dropdown-item" href="#">
            <i class="bi bi-check-circle" v-if="vista.secuencia"></i>
            Secuencia</a
          >
        </li>
        <li v-on:click="clickPartes()">
          <a class="dropdown-item" href="#">
            <i class="bi bi-check-circle" v-if="vista.partes"></i>
            Partes</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.pantallaPlay {
  border: 1px solid;
  display: flex;
}
</style>
