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
import MetronomoDesarrollador from '../components/comp_tocar/metronomodesarrollador.vue'
import Secuencia from '../components/comp_tocar/Tocar_Secuencia.vue'
import InstruccionesAcordes from '../components/comp_tocar/InstruccionesAcordes.vue'
import sincronizarMedias from '../components/comp_tocar/SincronizarMedias.vue'
import { useAppStore } from '../stores/appStore'
import { Pantalla } from '../modelo/pantalla'

import { OrigenCancion } from '../modelo/cancion/origencancion'
import { VistaTocar } from '../modelo/configuracion'
import { CancionManager } from '../modelo/cancion/CancionManager'
import type { Cancion } from '../modelo/cancion/cancion'
import { Logger } from '../modelo/logger'

const viendoVideo = ref(false)
const pantalla = new Pantalla()
const vista: Ref<VistaTocar> = ref(pantalla.getConfiguracionPantalla())

const appStore = useAppStore()
const compas = ref(appStore.aplicacion.reproductor.compas)
const golpeDelCompas = ref(appStore.aplicacion.reproductor.golpeDelCompas)
const cancion = ref<Cancion>(appStore.aplicacion.reproductor.cancion)

// requestAnimationFrame loop control
let rafId: number | null = null
const estadoReproduccion = ref(appStore.estadosApp.estadoReproduccion)
async function EmpezarLoop() {
  // reset counter when starting
  const loop = async () => {
    // stop if state changed
    if (
      appStore.estadosApp.estadoReproduccion !== 'Reproduciendo' &&
      appStore.estadosApp.estadoReproduccion !== 'Iniciando'
    ) {
      rafId = null
      return
    }
    await appStore.aplicacion.reproductor.sincronizar()
    estadoReproduccion.value = appStore.estadosApp.estadoReproduccion
    compas.value = appStore.aplicacion.reproductor.compas
    golpeDelCompas.value = appStore.aplicacion.reproductor.golpeDelCompas
    estadoReproduccion.value = appStore.estadosApp.estadoReproduccion
    rafId = requestAnimationFrame(loop)
  }
  // avoid multiple loops
  if (rafId == null) {
    rafId = requestAnimationFrame(loop)
  }
}

function PararLoop() {
  if (rafId != null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}
const cargando = ref(false)
function VerEstado() {
  if (
    appStore.estadosApp.estadoReproduccion.startsWith('cargando') ||
    appStore.estadosApp.estadoReproduccion === 'sin-cancion'
  ) {
    cargando.value = true
    return
  }

  cancion.value = appStore.aplicacion.reproductor.cancion
  setviendoVideo()
  cargando.value = false

  if (
    appStore.estadosApp.estadoReproduccion === 'Reproduciendo' ||
    appStore.estadosApp.estadoReproduccion === 'Iniciando'
  ) {
    EmpezarLoop()
  } else {
    PararLoop()
  }
}
VerEstado()
// Watch for changes in playback state and start/stop RAF loop
watch(
  () => appStore.estadosApp.estadoReproduccion,
  () => {
    VerEstado()
  },
)

onUnmounted(() => {
  PararLoop()
})

onMounted(() => {
  pantalla.setearEstilos()
  vista.value = pantalla.getConfiguracionPantalla()
  const urlParams = new URLSearchParams(window.location.search)
  const CancionUrl = urlParams.get('cancion')
  const UsuarioUrl = urlParams.get('usuario')
  if (CancionUrl) {
    const origen = OrigenCancion.GetFromQuery(CancionUrl, UsuarioUrl)
    appStore.aplicacion.reproductor.CargarCancion(origen)
  }
})

function SolicitarCalibracion() {
  appStore.origenCancion.origenUrl = 'server'
  cancion.value.calidad = -1
  CancionManager.getInstance()
    .Save(
      new OrigenCancion(
        appStore.origenCancion.origenUrl,
        appStore.origenCancion.fileName,
        appStore.perfil.usuario,
      ),
      cancion.value,
    )
    .catch((error) => {
      Logger.logError('Error al solicitar calibración', error)
    })
}

function getviendoVideo() {
  if (vista.value.reproduce == 'nada') {
    return false
  }
  if (vista.value.reproduce == 'video') {
    if (cancion.value.medias.length == 0) {
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
    (vista.value.reproduce === 'midi' && cancion.value.pentagramas.length > 0)
  )
}
function setviendoVideo() {
  viendoVideo.value = getviendoVideo()
}
function viendoSecundaria(): boolean {
  return (
    viendoVideo.value ||
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

  return `width: ${ancho}%; height: ${height}%; display: ${display};`
}

function estiloVistaSecundaria() {
  let ancho = 100 - vista.value.anchoPrincipal - vista.value.anchoTerciaria
  let height = 100
  let display = 'flex'

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
  if (!viendoVideo.value) {
    return `top: 0px;`
  }
  return `top: ${vista.value.altoReproductor}px;`
}

function GetStyleSecuencia() {
  if (!vista.value.viendoSecuencia) {
    return `height: 0px;`
  }
  return `height: ${vista.value.anchoParte}px;`
}

const refSincronizandoMedios = ref(false)
function clickCerrarMedios() {
  refSincronizandoMedios.value = false
}

function cambioestado(estado: number) {
  Logger.log('Cambio de estado en tocar.vue', estado)
  appStore.aplicacion.CambioEstadoMedio(estado)
}

const refAdvertencia = ref(true)
const viendoInstrucciones = ref(appStore.perfil.instrumento)
</script>

<template>
  <div style="text-align: center" v-if="cargando">
    <img
      src="/img/iconogrande.png"
      style="width: 300px; height: auto"
      class="logo vue"
      alt="Vue logo"
    />
    <div>{{ appStore.estadosApp.texto }}</div>
  </div>

  <div class="tocar-fluid" v-if="cargando == false">
    <sincronizarMedias
      v-if="refSincronizandoMedios"
      @cerrar="clickCerrarMedios"
    ></sincronizarMedias>

    <div class="pantallaPlay" :style="GetStylePantallaPlay()" v-if="cancion">
      <div
        class="columnas lateral-container"
        :style="estiloVistaTerciaria()"
        v-if="vista.modo === 'triple'"
      >
        <Secuencia
          v-if="vista.viendoSecuencia3"
          :cancion="cancion"
          :compas="compas"
        ></Secuencia>

        <InstruccionesAcordes
          v-if="vista.viendoInstrucciones3"
          :cancion="cancion"
          :compas="compas"
          :viendoInstrucciones="viendoInstrucciones"
        ></InstruccionesAcordes>

        <TocarCuadrado
          v-if="vista.viendoCuadrado3"
          :cancion="cancion"
          :compas="compas"
        ></TocarCuadrado>
      </div>

      <div class="columnas lateral-container" :style="estiloVistaPrincipal()">
        <div
          class="error"
          v-if="
            cancion.pentagramas.length === 0 && vista.muestra == 'partitura'
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
            cancion.calidad != undefined &&
            cancion.calidad < 1
          "
        >
          <span v-if="cancion.calidad == -1">♻️ Recalibrando.</span>
          <span @click="refAdvertencia = false"
            >Texto No Calibrados. Corregilos desde: ✍️ Editar </span
          ><button
            v-if="
              cancion.calidad > -1 &&
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
            cancion.calidad != undefined &&
            cancion.calidad < 2 &&
            (vista.muestra == 'letrayacordes' || vista.muestra == 'acordes')
          "
        >
          Acordes No Calibrados. Corregilos desde: ✍️ Editar
          <button
            v-if="
              cancion.calidad > -1 &&
              appStore.estadosApp.estadoLogin === 'logueado'
            "
            @click="SolicitarCalibracion()"
          >
            Calibrar!
          </button>
        </div>
        <TocarLetraAcorde
          v-if="
            vista.muestra == 'letrayacordes' ||
            (cancion.pentagramas.length === 0 && vista.muestra == 'partitura')
          "
          :cancion="cancion"
          :compas="compas"
        ></TocarLetraAcorde>
        <TocarCuadrado
          v-if="vista.muestra == 'cuadrado'"
          :cancion="cancion"
          :compas="compas"
        ></TocarCuadrado>
        <TocarLetra
          v-if="vista.muestra == 'karaoke'"
          :cancion="cancion"
          :compas="compas"
        ></TocarLetra>
        <TocarAcorde
          v-if="vista.muestra == 'acordes'"
          :cancion="cancion"
          :compas="compas"
        ></TocarAcorde>
        <TocarPentagrama
          v-if="vista.muestra == 'partitura' && cancion.pentagramas.length > 0"
          :cancion="cancion"
          :editando="false"
          :compas="compas"
        ></TocarPentagrama>
      </div>
      <div class="columnas lateral-container" :style="estiloVistaSecundaria()">
        <div v-if="viendoVideo">
          <TocarYoutube
            v-if="vista.reproduce == 'video'"
            @cambioEstado="cambioestado"
            :cancion="cancion"
            :compas="compas"
          ></TocarYoutube>
          <TocarMidi
            v-if="vista.reproduce == 'midi'"
            @cambioEstado="cambioestado"
            :cancion="cancion"
            :compas="compas"
          ></TocarMidi>
        </div>

        <div class="overlay" :style="GetStyleOverlay()">
          <div class="secuencia" :style="GetStyleSecuencia()">
            <Secuencia
              v-if="vista.viendoSecuencia"
              :cancion="cancion"
              :compas="compas"
            ></Secuencia>
          </div>

          <InstruccionesAcordes
            v-if="vista.viendoInstrucciones"
            :cancion="cancion"
            :compas="compas"
            :viendoInstrucciones="viendoInstrucciones"
          ></InstruccionesAcordes>
          <TocarCuadrado
            v-if="vista.viendoCuadrado"
            :cancion="cancion"
            :compas="compas"
          ></TocarCuadrado>
        </div>
      </div>
    </div>

    <div class="controladoresTiempo">
      <ControladorTiempo
        :golpeEnCompas="golpeDelCompas"
        :cancion="cancion"
        :estadoReproduccion="estadoReproduccion"
        :compas="compas"
      >
      </ControladorTiempo>

      <MetronomoDesarrollador
        ref="metronomeRef"
        :golpeEnCompas="golpeDelCompas"
        :cancion="cancion"
        :estadoReproduccion="estadoReproduccion"
        v-if="appStore.perfil.ModoDesarrollador"
      ></MetronomoDesarrollador>
      <Metronomo
        v-else
        :cancion="cancion"
        :estadoReproduccion="estadoReproduccion"
        :golpeEnCompas="golpeDelCompas"
      ></Metronomo>
    </div>
  </div>
</template>

<style scoped>
.controladoresTiempo {
  user-select: none;
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
  z-index: 0;
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
.error {
  width: 100%;
  background-color: brown;
  font-size: 1.2em;
}

.advertencia {
  width: 100%;
  background-color: rgb(238, 195, 115);
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
