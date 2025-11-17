<script setup lang="ts">
import { ref, type Ref, watch, onMounted, onUnmounted } from 'vue'
//import TocarLetra from '../components/comp_cabecera/comp_tocar/Tocar_Letra.vue'
import TocarLetra from '../components/comp_tocar/Tocar_Letra.vue'
import TocarLetraAcorde from '../components/comp_tocar/Tocar_LetraYAcordes.vue'
import TocarPentagrama from '../components/comp_tocar/Tocar_Pentagrama.vue'
import TocarCuadrado from '../components/comp_tocar/Tocar_Cuadrado.vue'
import TocarYoutube from '../components/comp_tocar/Tocar_Youtube.vue'
import TocarMidi from '../components/comp_tocar/Tocar_Midi.vue'
import TocarAcorde from '../components/comp_tocar/Tocar_Acordes.vue'
import ControladorTiempo from '../components/comp_tocar/ControladorTiempo.vue'
import Metronomo from '../components/comp_tocar/metronomo.vue'
import Secuencia from '../components/comp_tocar/Tocar_Secuencia.vue'
import ProximosAcordes from '../components/comp_tocar/ProximosAcordes.vue'
import sincronizarMedias from '../components/comp_tocar/SincronizarMedias.vue'
import { useAppStore } from '../stores/appStore'
import { Pantalla } from '../modelo/pantalla'

import { OrigenCancion } from '../modelo/cancion/origencancion'
import { VistaTocar } from '../modelo/configuracion'
import { CancionManager } from '../modelo/cancion/CancionManager'

const pantalla = new Pantalla()
const appStore = useAppStore()

// requestAnimationFrame loop control
let rafId: number | null = null

async function startRafLoop() {
  // reset counter when starting
  const loop = async () => {
    // stop if state changed
    if (
      appStore.estadoReproduccion !== 'Reproduciendo' &&
      appStore.estadoReproduccion !== 'Iniciando'
    ) {
      rafId = null
      return
    }
    await appStore.aplicacion.sincronizar()
    rafId = requestAnimationFrame(loop)
  }
  // avoid multiple loops
  if (rafId == null) {
    rafId = requestAnimationFrame(loop)
  }
}

function stopRafLoop() {
  if (rafId != null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

// Watch for changes in playback state and start/stop RAF loop
watch(
  () => appStore.estadoReproduccion,
  (nuevo, viejo) => {
    console.log('Cambio appStore.estadoReproduccion:', viejo, '->', nuevo)
    if (nuevo === 'Reproduciendo' || nuevo === 'Iniciando') {
      startRafLoop()
    } else {
      stopRafLoop()
    }
  },
)

onUnmounted(() => {
  stopRafLoop()
})

const urlParams = new URLSearchParams(window.location.search)
const sesionurl = urlParams.get('cancion')
if (sesionurl) {
  const origen = OrigenCancion.GetFromQuery(sesionurl)
  appStore.aplicacion.ClickTocar(origen)
}

const vista: Ref<VistaTocar> = ref(pantalla.getConfiguracionPantalla())

onMounted(() => {
  pantalla.setearEstilos()
  vista.value = pantalla.getConfiguracionPantalla()
})

function SolicitarCalibracion() {
  appStore.origenCancion.origenUrl = 'server'
  appStore.cancion.calidad = -1
  CancionManager.getInstance()
    .Save(
      new OrigenCancion(
        appStore.origenCancion.origenUrl,
        appStore.origenCancion.fileName,
        appStore.perfil.usuario,
      ),
      appStore.cancion,
    )
    .catch((error) => {
      console.error('Error al guardar los cambios:', error)
    })
}
function viendoVideo(): boolean {
  if (vista.value.reproduce == 'nada') {
    return false
  }
  if (vista.value.reproduce == 'video') {
    if (appStore.cancion.medias.length == 0) {
      return false
    }
    if (
      appStore.estadosApp.estadoSesion == 'conectado' &&
      appStore.rolSesion != 'director'
    ) {
      return false
    }
  }
  return (
    vista.value.reproduce === 'video' ||
    (vista.value.reproduce === 'midi' &&
      appStore.cancion.pentagramas.length > 0)
  )
}

function viendoSecundaria(): boolean {
  return (
    viendoVideo() ||
    vista.value.viendoCuadrado ||
    vista.value.viendoInstrucciones ||
    vista.value.viendoSecuencia
  )
}
function GetStylePantallaPlay() {
  //
  let direccion: 'row' | 'row-reverse' | 'column' | 'column-reverse' =
    pantalla.getConfiguracionPantalla().invertido ? 'row-reverse' : 'row'

  if (pantalla.getConfiguracionPantalla().modo == 'simple') {
    direccion = pantalla.getConfiguracionPantalla().invertido
      ? 'column'
      : 'column-reverse'
  }
  return {
    width: pantalla.getAnchoPantalla() + 'px',
    height: pantalla.getAltoPantalla() + 'px',
    'flex-direction': direccion,
  }
}

function estiloVistaPrincipal() {
  let ancho = 100
  let height = 100
  let display = 'block'
  const HaySegundaPantalla = viendoSecundaria()
  if (HaySegundaPantalla) {
    ancho = vista.value.anchoPrincipal
  }
  if (vista.value.modo == 'simple') {
    ancho = 100
    height = vista.value.anchoPrincipal
  }
  console.log('estiloVistaPrincipal', ancho, height, display)
  return `width: ${ancho}%; height: ${height}%; display: ${display};`
}

function estiloVistaSecundaria() {
  let ancho = 100 - vista.value.anchoPrincipal - vista.value.anchoTerciaria
  let height = 100
  let display = 'block'

  const HaySegundaPantalla = viendoSecundaria()
  if (HaySegundaPantalla) {
    ancho = vista.value.anchoPrincipal
  } else {
    ancho = 0
    display = 'none'
  }
  if (vista.value.modo == 'simple') {
    ancho = 0
    height = 100 - vista.value.anchoPrincipal
  } else {
    if (!HaySegundaPantalla) {
      ancho = 0
    }
  }
  return `width: ${100 - ancho}%; height: ${height}%; display: ${display};`
}

function estiloVistaTerciaria() {
  let ancho = vista.value.anchoTerciaria
  return `width: ${ancho}%;`
}
function GetStyleOverlay() {
  if (!viendoVideo()) {
    return `top: 0px;`
  }
  return `top: ${vista.value.altoReproductor}px;`
}

function GetStyleSecuencia() {
  return `height: ${vista.value.anchoParte}px;`
}

const refSincronizandoMedios = ref(false)
function clickCerrarMedios() {
  refSincronizandoMedios.value = false
}

function cambioestado(estado: number) {
  console.log('Cambio de estado en tocar.vue', estado)
  appStore.aplicacion.CambioEstadoMedio(estado)
}

const refAdvertencia = ref(true)
</script>

<template>
  <div class="tocar-fluid">
    <sincronizarMedias
      v-if="refSincronizandoMedios"
      @cerrar="clickCerrarMedios"
    ></sincronizarMedias>

    <div
      class="pantallaPlay"
      :style="GetStylePantallaPlay()"
      v-if="appStore.cancion"
    >
      <div
        class="columnas lateral-container"
        :style="estiloVistaTerciaria()"
        v-if="vista.modo === 'triple'"
      >
        <Secuencia
          v-if="vista.viendoSecuencia3"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></Secuencia>

        <ProximosAcordes
          :cancion="appStore.cancion"
          :compas="appStore.compas"
          v-if="vista.viendoInstrucciones3"
        ></ProximosAcordes>

        <TocarCuadrado
          v-if="vista.viendoCuadrado3"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarCuadrado>
      </div>

      <div class="columnas lateral-container" :style="estiloVistaPrincipal()">
        <div
          class="sinPentagrama"
          v-if="
            appStore.cancion.pentagramas.length === 0 &&
            vista.muestra == 'partitura'
          "
        >
          No hay partituras
        </div>
        <div
          class="advertencia"
          v-if="
            vista.muestra == 'karaoke' &&
            vista.reproduce == 'video' &&
            refAdvertencia &&
            appStore.cancion.calidad != undefined &&
            appStore.cancion.calidad < 1
          "
        >
          <span v-if="appStore.cancion.calidad == -1">♻️ Recalibrando.</span>
          <span @click="refAdvertencia = false"
            >Texto No Calibrados. Corregilos desde: ✍️ Editar </span
          ><button
            v-if="
              appStore.cancion.calidad > -1 &&
              appStore.estadosApp.estadoLogin === 'logueado'
            "
            @click="SolicitarCalibracion()"
          >
            Calibrar!
          </button>
        </div>
        <div
          class="advertencia"
          @click="refAdvertencia = false"
          v-if="
            refAdvertencia &&
            vista.reproduce == 'video' &&
            appStore.cancion.calidad != undefined &&
            appStore.cancion.calidad < 2 &&
            (vista.muestra == 'letrayacordes' || vista.muestra == 'acordes')
          "
        >
          Acordes No Calibrados. Corregilos desde: ✍️ Editar
        </div>
        <TocarLetraAcorde
          v-if="
            vista.muestra == 'letrayacordes' ||
            (appStore.cancion.pentagramas.length === 0 &&
              vista.muestra == 'partitura')
          "
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarLetraAcorde>
        <TocarCuadrado
          v-if="vista.muestra == 'cuadrado'"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarCuadrado>
        <TocarLetra
          v-if="vista.muestra == 'karaoke'"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarLetra>
        <TocarAcorde
          v-if="vista.muestra == 'acordes'"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarAcorde>
        <TocarPentagrama
          v-if="
            vista.muestra == 'partitura' &&
            appStore.cancion.pentagramas.length > 0
          "
          :cancion="appStore.cancion"
          :editando="false"
          :compas="appStore.compas"
        ></TocarPentagrama>
      </div>
      <div class="columnas lateral-container" :style="estiloVistaSecundaria()">
        <div v-if="viendoVideo()">
          <TocarYoutube
            v-if="vista.reproduce == 'video'"
            @cambioEstado="cambioestado"
            :cancion="appStore.cancion"
            :compas="appStore.compas"
          ></TocarYoutube>
          <TocarMidi
            v-if="vista.reproduce == 'midi'"
            @cambioEstado="cambioestado"
            :cancion="appStore.cancion"
            :compas="appStore.compas"
          ></TocarMidi>
        </div>

        <div class="overlay" :style="GetStyleOverlay()">
          <div class="secuencia" :style="GetStyleSecuencia()">
            <Secuencia
              v-if="vista.viendoSecuencia"
              :cancion="appStore.cancion"
              :compas="appStore.compas"
            ></Secuencia>
          </div>

          <ProximosAcordes
            :cancion="appStore.cancion"
            :compas="appStore.compas"
            v-if="vista.viendoInstrucciones"
          ></ProximosAcordes>

          <TocarCuadrado
            v-if="vista.viendoCuadrado"
            :cancion="appStore.cancion"
            :compas="appStore.compas"
          ></TocarCuadrado>
        </div>
      </div>
    </div>

    <div class="controladoresTiempo">
      <ControladorTiempo> </ControladorTiempo>

      <Metronomo ref="metronomeRef"></Metronomo>
    </div>
  </div>
</template>

<style scoped>
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
  position: relative;
}

.pantallaPlay {
  display: flex;
  padding: 2px;
  padding-left: 10px;
}

.dropdown {
  display: absolute;
  right: 0;
}

.dropdown-superior-derecha {
  position: absolute;
  z-index: 1;
}

.editSize {
  position: absolute;
  left: 20%;
  top: 20%;
  font: 2em;
  padding: 8px;
  border-radius: 10px;
  background-color: rgb(41, 37, 37);
  color: white;
  z-index: 10;
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
.sinPentagrama {
  width: 100%;
  background-color: brown;
  font-size: 1.2em;
}
.advertencia {
  width: 100%;
  background-color: rgb(219, 172, 85);
  color: red;
  font-size: 1.2em;
}
.overlay {
  position: absolute;
  left: 0;
  background-color: black;
  width: 100%;
  height: 100%;
  z-index: 10;
  overflow: hidden;
}
.secuencia {
  overflow: hidden;
}
</style>
