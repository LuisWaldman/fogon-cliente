<script setup lang="ts">
import { ref, type Ref } from 'vue'
//import TocarLetra from '../components/comp_cabecera/comp_tocar/Tocar_Letra.vue'
import TocarLetra from '../components/comp_tocar/Tocar_Letra.vue'
import TocarLetraAcorde from '../components/comp_tocar/Tocar_LetraYAcordes.vue'
import TocarAcorde from '../components/comp_tocar/Tocar_Acordes.vue'
import ControladorTiempo from '../components/comp_tocar/ControladorTiempo.vue'
import Metronomo from '../components/comp_tocar/metronomo.vue'
import Secuencia from '../components/comp_tocar/Secuencia.vue'
import Partes from '../components/comp_tocar/Partes.vue'
import ProximosAcordes from '../components/comp_tocar/ProximosAcordes.vue'
import { useAppStore } from '../stores/appStore'
import { Pantalla } from '../modelo/pantalla'
import { onMounted } from 'vue'

const pantalla = new Pantalla()
onMounted(() => {
  pantalla.setearEstilos()
})

const appStore = useAppStore()

const urlParams = new URLSearchParams(window.location.search)
const nombreCancion = urlParams.get('cancion')
appStore.tocar(nombreCancion as string)

class vistaTocar {
  viendo: string = 'karaoke'
  secuencia: boolean = true
  partes: boolean = true
  proximosAcordes: boolean = false
}
const vista: Ref<vistaTocar> = ref(new vistaTocar())
vista.value.viendo = localStorage.getItem('viendo_vista_tocando') || 'karaoke'
vista.value.secuencia =
  localStorage.getItem('secuencia') == 'true' ? true : false
vista.value.partes = localStorage.getItem('partes') == 'true' ? true : false
vista.value.proximosAcordes =
  localStorage.getItem('proximosAcordes') == 'true' ? true : false

function clickSecuencia() {
  vista.value.secuencia = !vista.value.secuencia
  localStorage.setItem('secuencia', vista.value.secuencia ? 'true' : 'false')
}

function clickPartes() {
  vista.value.partes = !vista.value.partes
  localStorage.setItem('partes', vista.value.partes ? 'true' : 'false')
}

function clickAcordes() {
  vista.value.proximosAcordes = !vista.value.proximosAcordes
  localStorage.setItem(
    'proximosAcordes',
    vista.value.proximosAcordes ? 'true' : 'false',
  )
}

function GetStylePantallaPlay() {
  return {
    width: pantalla.getAnchoPantalla() + 'px',
    height: pantalla.getAltoPantalla() + 'px',
  }
}

function cambiarVista(nvista: string) {
  vista.value.viendo = nvista
  localStorage.setItem('viendo_vista_tocando', nvista)
}
function claseVistaPrincipal() {
  return vista.value.partes || vista.value.secuencia
    ? 'col-' + pantalla.getConfiguracionPantalla().anchoPrincipal
    : 'col-11'
}

function claseVistaSecundaria() {
  return vista.value.partes || vista.value.secuencia
    ? 'col-' + (12 - pantalla.getConfiguracionPantalla().anchoPrincipal)
    : 'col-1'
}
</script>

<template>
  <div class="tocar-fluid">
    <div
      class="pantallaPlay"
      :style="GetStylePantallaPlay()"
      v-if="appStore.cancion"
    >
      <div class="columnas" :class="claseVistaPrincipal()">
        <TocarLetraAcorde
          v-if="vista.viendo == 'acordes'"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarLetraAcorde>
        <TocarLetra
          v-if="vista.viendo == 'karaoke'"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarLetra>
        <TocarAcorde
          v-if="vista.viendo == 'soloacordes'"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarAcorde>
      </div>
      <div class="columnas lateral-container" :class="claseVistaSecundaria()">
        <Secuencia
          :cancion="appStore.cancion"
          :compas="appStore.compas"
          v-if="vista.secuencia"
        ></Secuencia>

        <ProximosAcordes
          :cancion="appStore.cancion"
          :compas="appStore.compas"
          v-if="vista.proximosAcordes"
        ></ProximosAcordes>
        <Partes
          v-if="vista.partes"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
          :secuencia="vista.secuencia"
          :partes="vista.partes"
        ></Partes>
      </div>

      <div class="dropdown dropdown-superior-derecha">
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
          <li v-on:click="clickAcordes()">
            <a class="dropdown-item" href="#">
              <i class="bi bi-check-circle" v-if="vista.proximosAcordes"></i>
              Proximos Acordes</a
            >
          </li>
        </ul>
      </div>
    </div>
    
    <div class="controladoresTiempo">
      <ControladorTiempo
        v-if="$route.path === '/tocar'"
        :nro_cancion="1"
        :total_canciones="1"
        :compas="appStore.compas"
        :estado="appStore.estado"
      >
      </ControladorTiempo>

      <Metronomo
        v-if="$route.path === '/tocar'"
        :compas="appStore.compas"
        :estado="appStore.estado"
        ref="metronomeRef"
        :bpm_encompas="appStore.golpeDelCompas"
        :cancion="appStore.cancion"
      ></Metronomo>
    </div>
  </div>
</template>

<style scoped>

.tocar-fluid {

}


.controladoresTiempo {
  
  position: absolute;
  bottom: 0;
  display: flex;
  background-color: #353333;
  border-top: 1px solid #a9a8f6;
  padding: 4px;

}

.columnas {
  padding: 0;
}

.pantallaPlay {
  overflow: hidden;
  display: flex;
  padding: 2px;
  padding-left: 10px;
}

.dropdown {
  display: absolute;
  right: 0;
}

.lateral-container {
  position: relative;
}
.dropdown-superior-derecha {
  position: absolute;
  z-index: 10;
}
</style>
