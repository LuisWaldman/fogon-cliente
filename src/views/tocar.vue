<script setup lang="ts">
import { ref, type Ref } from 'vue'
//import TocarLetra from '../components/comp_cabecera/comp_tocar/Tocar_Letra.vue'
import TocarLetra from '../components/comp_tocar/Tocar_Letra.vue'
import TocarLetraAcorde from '../components/comp_tocar/Tocar_LetraYAcordes.vue'
import TocarPentagrama from '../components/comp_tocar/Tocar_Pentagrama.vue'
import TocarCuadrado from '../components/comp_tocar/Tocar_Cuadrado.vue'
import TocarYoutube from '../components/comp_tocar/Tocar_Youtube.vue'
import TocarMidi from '../components/comp_tocar/Tocar_Midi.vue'
import TocarEscucha from '../components/comp_tocar/Tocar_Escucha.vue'
import TocarAcorde from '../components/comp_tocar/Tocar_Acordes.vue'
import ControladorTiempo from '../components/comp_tocar/ControladorTiempo.vue'
import Metronomo from '../components/comp_tocar/metronomo.vue'
import Secuencia from '../components/comp_tocar/Secuencia.vue'
import ProximosAcordes from '../components/comp_tocar/ProximosAcordes.vue'
import sincronizarMedias from '../components/comp_tocar/SincronizarMedias.vue'
import { useAppStore } from '../stores/appStore'
import { Pantalla } from '../modelo/pantalla'
import { onMounted } from 'vue'
import { OrigenCancion } from '../modelo/cancion/origencancion'
import { VistaTocar } from '../modelo/configuracion'

const pantalla = new Pantalla()

const appStore = useAppStore()

const urlParams = new URLSearchParams(window.location.search)
const sesionurl = urlParams.get('cancion')
if (sesionurl) {
  const origen = OrigenCancion.GetFromQuery(sesionurl)
  appStore.aplicacion.ClickTocar(origen)
}

onMounted(() => {
  pantalla.setearEstilos()
})

const vista: Ref<VistaTocar> = ref(pantalla.getConfiguracionPantalla())

onMounted(() => {
  vista.value = pantalla.getConfiguracionPantalla()
})

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
  let ancho = vista.value.anchoPrincipal
  let height = 100
  let display = 'block'
  const hayPrimeraPantalla = vista.value.muestra != 'nada  '
  const HaySegundaPantalla =
    vista.value.reproduce != 'nada' ||
    vista.value.viendoCuadrado ||
    vista.value.viendoInstrucciones ||
    vista.value.viendoSecuencia
  if (!hayPrimeraPantalla) {
    ancho = 0
    height = 0
    display = 'none'
  }
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
  let display = 'block'

  const hayPrimeraPantalla = vista.value.muestra != 'nada  '
  const HaySegundaPantalla =
    vista.value.reproduce != 'nada' ||
    vista.value.viendoCuadrado ||
    vista.value.viendoInstrucciones ||
    vista.value.viendoSecuencia
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
  if (!hayPrimeraPantalla) {
    ancho = 100
  }
  return `width: ${100 - ancho}%; height: ${height}%; display: ${display};`
}

function estiloVistaTerciaria() {
  let ancho = vista.value.anchoTerciaria
  return `width: ${ancho}%;`
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
          @click="refAdvertencia = false"
          v-if="
            vista.muestra == 'karaoke' &&
            vista.reproduce == 'video' &&
            refAdvertencia &&
            appStore.cancion.calidad != undefined &&
            appStore.cancion.calidad < 1
          "
        >
          Texto No Calibrados. Corregilos desde: ✍️ Editar
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
        <TocarEscucha
          v-if="vista.muestra == 'escucha'"
          @cambioEstado="cambioestado"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarEscucha>
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

        <Secuencia
          v-if="vista.viendoSecuencia"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></Secuencia>

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
  background-color: rgb(41, 37, 37);
  color: white;
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
</style>
