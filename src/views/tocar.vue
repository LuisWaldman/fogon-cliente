<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
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
import { Configuracion, VistaTocar } from '../modelo/configuracion'

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
const refEditSize = ref(false)
const config = Configuracion.getInstance()
const config_pantalla = ref(pantalla.getConfiguracionPantalla())
const exvistapantalla = ref(new VistaTocar())

function editarPantalla() {
  refEditSize.value = true
  exvistapantalla.value.altoPantallaDescuento = config_pantalla.value.altoPantallaDescuento
  exvistapantalla.value.anchoPrincipal = config_pantalla.value.anchoPrincipal
  exvistapantalla.value.tamanioAcorde = config_pantalla.value.tamanioAcorde
  exvistapantalla.value.tamanioAcordesolo = config_pantalla.value.tamanioAcordesolo
  exvistapantalla.value.tamanioLetra = config_pantalla.value.tamanioLetra
  exvistapantalla.value.tamanioParte = config_pantalla.value.tamanioParte
  exvistapantalla.value.tamanioAcordeParte = config_pantalla.value.tamanioAcordeParte
  exvistapantalla.value.factorScroll = config_pantalla.value.factorScroll
}

watch(config_pantalla.value, (newValue) => {
  pantalla.setearEstilos()
})

function guardarConfiguracionPantalla() {    
  config.guardarEnLocalStorage()
  refEditSize.value = false
}

function cancelarConfiguracionPantalla() {
  refEditSize.value = false
  config_pantalla.value.altoPantallaDescuento = exvistapantalla.value.altoPantallaDescuento
  config_pantalla.value.anchoPrincipal = exvistapantalla.value.anchoPrincipal
  config_pantalla.value.tamanioAcorde = exvistapantalla.value.tamanioAcorde
  config_pantalla.value.tamanioAcordesolo = exvistapantalla.value.tamanioAcordesolo
  config_pantalla.value.tamanioLetra = exvistapantalla.value.tamanioLetra
  config_pantalla.value.tamanioParte = exvistapantalla.value.tamanioParte
  config_pantalla.value.tamanioAcordeParte = exvistapantalla.value.tamanioAcordeParte
  config_pantalla.value.factorScroll = exvistapantalla.value.factorScroll

  pantalla.setearEstilos()

  
}

</script>

<template>
  <div class="tocar-fluid">
    

    <div class="editSize" v-if="refEditSize">
      <div class="tituloeditSize">Tamaños</div>
      <div class="config-row">
        <span>Letra</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="config_pantalla.tamanioLetra"
        />
        <span>{{ config_pantalla.tamanioLetra }} px</span>
      </div>
      <div class="config-row">
        <span>Acorde</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="config_pantalla.tamanioAcorde"
        />
        <span>{{ config_pantalla.tamanioAcorde }} px</span>
      </div>
      <div class="config-row">
        <span>Acorde Solo</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="config_pantalla.tamanioAcordesolo"
        />
        <span>{{ config_pantalla.tamanioAcordesolo }} px</span>
      </div>
      <div class="config-row">
        <span>Parte</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="config_pantalla.tamanioParte"
        />
        <span>{{ config_pantalla.tamanioParte }} px</span>
      </div>
      <div class="config-row">
        <span>Acorde Parte</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="config_pantalla.tamanioAcordeParte"
        />
        <span>{{ config_pantalla.tamanioAcordeParte }} px</span>
      </div>
      <div class="config-row">
        <span>Ancho Pantalla Principal</span>
        <input
          type="range"
          min="3"
          max="11"
          v-model.number="config_pantalla.anchoPrincipal"
        />
        <span>{{ config_pantalla.anchoPrincipal }} </span>
      </div>
      <div class="config-row">
        <span>Descuento Alto Pantalla</span>
        <input
          type="range"
          min="0"
          max="900"
          v-model.number="config_pantalla.altoPantallaDescuento"
        />
        <span>{{ config_pantalla.altoPantallaDescuento }} px</span>
      </div>
      <div class="config-row">
        <span>Factor Scroll</span>
        <input
          type="range"
          min="1"
          max="10"
          step="0.1"
          v-model.number="config_pantalla.factorScroll"
        />
        <span>{{ config_pantalla.factorScroll }}</span>
      </div>
      <div class="botonera">
        <button
          @click="guardarConfiguracionPantalla()"
          class="btnGuardar"
        >
          Guardar
        </button>
        <button
          @click="cancelarConfiguracionPantalla()"
          class="btnGuardar"
        >
          Cancelar
        </button>
      </div>
    </div>
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

          
          <li><hr class="dropdown-divider" /></li>
          <li v-on:click="editarPantalla()">
            <a class="dropdown-item" href="#">
              
              Ajustar Tamaños</a
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
  width: 100%;
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

.editSize {
  position: absolute;
  left: 20%;
  top: 20%;
  font: 2em;
  padding: 8px;
  border-radius: 10px;
  background-color: #888;
  z-index: 1000;
  border: 3px solid #8b4513;
}

.tituloeditSize {
  font-size: 2em;
  text-align: center;
  color: #fff;
  margin-bottom: 10px;
}

.config-row {
  display: flex;
  align-items: center;
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #fff;
}
.botonera {
  display: flex;
  justify-content: right;
  margin-top: 10px;
}

</style>
