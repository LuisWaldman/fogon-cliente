<script setup lang="ts">
import { ref, type Ref } from 'vue'
//import TocarLetra from '../components/comp_cabecera/comp_tocar/Tocar_Letra.vue'
import TocarLetra from '../components/comp_tocar/Tocar_Letra.vue'
import TocarLetraAcorde from '../components/comp_tocar/Tocar_LetraYAcordes.vue'
import TocarPentagrama from '../components/comp_tocar/Tocar_Pentagrama.vue'
import TocarYoutube from '../components/comp_tocar/Tocar_Youtube.vue'
import TocarAcorde from '../components/comp_tocar/Tocar_Acordes.vue'
import ControladorTiempo from '../components/comp_tocar/ControladorTiempo.vue'
import Metronomo from '../components/comp_tocar/metronomo.vue'
import Partes from '../components/comp_tocar/Partes.vue'
import Secuencia from '../components/comp_tocar/Secuencia.vue'
import ProximosAcordes from '../components/comp_tocar/ProximosAcordes.vue'
import editVista from '../components/comp_tocar/editVista.vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { Pantalla } from '../modelo/pantalla'
import { onMounted } from 'vue'
import { OrigenCancion } from '../modelo/cancion/origencancion'

const pantalla = new Pantalla()
onMounted(() => {
  pantalla.setearEstilos()
})

const appStore = useAppStore()

class vistaTocar {
  viendo: string = 'karaoke'
  media: boolean = false
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
vista.value.media = localStorage.getItem('media') == 'true' ? true : false

function clickSecuencia() {
  vista.value.secuencia = !vista.value.secuencia
  localStorage.setItem('secuencia', vista.value.secuencia ? 'true' : 'false')
}

function clickPartes() {
  vista.value.partes = !vista.value.partes
  localStorage.setItem('partes', vista.value.partes ? 'true' : 'false')
}
function clickMedia() {
  vista.value.media = !vista.value.media
  localStorage.setItem('media', vista.value.media ? 'true' : 'false')
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
function estiloVistaPrincipal() {
  let ancho = 100
  if (
    vista.value.secuencia ||
    vista.value.proximosAcordes ||
    vista.value.partes
  ) {
    ancho = pantalla.getConfiguracionPantalla().anchoPrincipal
  }
  return `width: ${ancho}%; height: 100%; `
}

function estiloVistaSecundaria() {
  let ancho = 100
  if (
    vista.value.secuencia ||
    vista.value.proximosAcordes ||
    vista.value.partes
  ) {
    ancho = pantalla.getConfiguracionPantalla().anchoPrincipal
  }
  return `width: ${100 - ancho}%;`
}
const refEditSize = ref(false)
function editarPantalla() {
  refEditSize.value = true
}

const router = useRouter()
function clickEditar() {
  // Redirect to edit page for the current song
  appStore.editandocancion = appStore.cancion
  appStore.origenEditando = new OrigenCancion(
    appStore.origenCancion.origenUrl,
    appStore.origenCancion.fileName,
    appStore.origenCancion.usuario,
  )
  appStore.cancionModificada = false
  router.push('/editar')
}

function cerrareditarPantalla() {
  refEditSize.value = false
}
function cambioestado(estado: number) {
  console.log('Cambio de estado en tocar.vue', estado)
  appStore.aplicacion.CambioEstadoMedio(estado)
}
</script>

<template>
  <div class="tocar-fluid">
    <editVista
      v-if="refEditSize"
      @cerrarEditSize="cerrareditarPantalla"
    ></editVista>

    <div
      class="pantallaPlay"
      :style="GetStylePantallaPlay()"
      v-if="appStore.cancion"
    >
      <div class="columnas" :style="estiloVistaPrincipal()">
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
        <TocarPentagrama
          v-if="vista.viendo == 'pentagrama'"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarPentagrama>
      </div>
      <div class="columnas lateral-container" :style="estiloVistaSecundaria()">
        <TocarYoutube
          v-if="vista.media"
          @cambioEstado="cambioestado"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarYoutube>

        <div style="max-height: 50%; overflow-y: auto" v-if="vista.secuencia">
          <Secuencia
            :cancion="appStore.cancion"
            :compas="appStore.compas"
          ></Secuencia>
        </div>
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
          <li v-on:click="cambiarVista('pentagrama')">
            <a class="dropdown-item" href="#">Pentagrama</a>
          </li>
          <li><hr class="dropdown-divider" /></li>

          <li v-on:click="clickMedia()">
            <a class="dropdown-item" href="#">
              <i class="bi bi-check-circle" v-if="vista.media"></i>
              Media</a
            >
          </li>
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
            <a class="dropdown-item" href="#"> Ajustar Tamaños</a>
          </li>

          <li><hr class="dropdown-divider" /></li>
          <li v-on:click="clickEditar()">
            <a class="dropdown-item" href="#">Editar</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="controladoresTiempo">
      <ControladorTiempo v-if="$route.path === '/tocar'"> </ControladorTiempo>

      <Metronomo v-if="$route.path === '/tocar'" ref="metronomeRef"></Metronomo>
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
  overflow: hidden;
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
  background-color: rgba(136, 136, 136, 0.65);
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
  width: 100%;
}
.botonera {
  display: flex;
  justify-content: right;
  margin-top: 10px;
}

input[type='range'] {
  width: 100%;
}

.editSize span {
  white-space: nowrap;
  display: inline-block;
}

@media (max-width: 768px) {
  .editSize {
    left: 10%;
    top: 10%;
  }
  .tituloeditSize {
    font-size: 1.5em;
  }
  .config-row {
    font-size: 1em;
  }
}
</style>
