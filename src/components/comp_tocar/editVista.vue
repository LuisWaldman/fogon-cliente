<script setup lang="ts">
import { ref, watch } from 'vue'
import { Configuracion, VistaTocar } from '../../modelo/configuracion'
import { Pantalla } from '../../modelo/pantalla'

const exvistapantalla = ref(new VistaTocar())
const emit = defineEmits(['cerrar'])

const pantalla = new Pantalla()
const config = Configuracion.getInstance()
const configPantalla = ref(pantalla.getConfiguracionPantalla())

exvistapantalla.value.altoPantallaDescuento =
  configPantalla.value.altoPantallaDescuento
exvistapantalla.value.anchoPrincipal = configPantalla.value.anchoPrincipal
exvistapantalla.value.tamanioAcorde = configPantalla.value.tamanioAcorde
exvistapantalla.value.tamanioAcordesolo = configPantalla.value.tamanioAcordesolo
exvistapantalla.value.tamanioLetra = configPantalla.value.tamanioLetra
exvistapantalla.value.tamanioParte = configPantalla.value.tamanioParte
exvistapantalla.value.tamanioAcordeParte =
  configPantalla.value.tamanioAcordeParte
exvistapantalla.value.factorScroll = configPantalla.value.factorScroll
exvistapantalla.value.columnas = configPantalla.value.columnas

function guardarConfiguracionPantalla() {
  config.guardarEnLocalStorage()
  emit('cerrar')
}
const refModoVista = ref(configPantalla.value.modo)
function ClickSetModoVista(modo: string) {
  refModoVista.value = modo
  configPantalla.value.modo = modo
}
function cancelarConfiguracionPantalla() {
  configPantalla.value.muestra = exvistapantalla.value.muestra
  configPantalla.value.reproduce = exvistapantalla.value.reproduce
  configPantalla.value.invertido = exvistapantalla.value.invertido
  configPantalla.value.modo = exvistapantalla.value.modo
  configPantalla.value.columnas = exvistapantalla.value.columnas
  configPantalla.value.altoPantallaDescuento =
    exvistapantalla.value.altoPantallaDescuento
  configPantalla.value.altoPantallaDescuento =
    exvistapantalla.value.altoPantallaDescuento
  configPantalla.value.anchoPrincipal = exvistapantalla.value.anchoPrincipal
  configPantalla.value.tamanioAcorde = exvistapantalla.value.tamanioAcorde
  configPantalla.value.tamanioAcordesolo =
    exvistapantalla.value.tamanioAcordesolo
  configPantalla.value.tamanioLetra = exvistapantalla.value.tamanioLetra
  configPantalla.value.tamanioParte = exvistapantalla.value.tamanioParte
  configPantalla.value.tamanioAcordeParte =
    exvistapantalla.value.tamanioAcordeParte
  configPantalla.value.factorScroll = exvistapantalla.value.factorScroll
  pantalla.setearEstilos()
  emit('cerrar')
}
watch(configPantalla.value, () => {
  pantalla.setearEstilos()
})
</script>

<template>
  <div class="vistaedit">
    <div class="tituloeditSize">VISTA GENERAL</div>
    <div class="config-row">
      <span>Columnas</span>
      <span
        :class="{ seleccionada: refModoVista === 'simple' }"
        @click="ClickSetModoVista('simple')"
        >[Simple]</span
      >
      <span
        :class="{ seleccionada: refModoVista === 'doble' }"
        @click="ClickSetModoVista('doble')"
        >[Doble]</span
      >
      <span
        :class="{ seleccionada: refModoVista === 'triple' }"
        @click="ClickSetModoVista('triple')"
        >[Triple]</span
      >
      <input type="checkbox" v-model="configPantalla.invertido" /> ↩️
    </div>
    <div class="config-row">
      <span v-if="refModoVista !== 'simple'">% Ancho</span>
      <span v-if="refModoVista === 'simple'">% Alto</span>
      <div style="width: 50%">
        <input
          type="range"
          style="width: 100%"
          min="3"
          max="98"
          v-model.number="configPantalla.anchoPrincipal"
        />
      </div>

      <span>{{ configPantalla.anchoPrincipal }} </span>
    </div>
    <div class="config-row" v-if="refModoVista === 'triple'">
      <span>% Terciaria</span>

      <div style="width: 50%">
        <input
          type="range"
          style="width: 100%"
          min="3"
          max="98"
          v-model.number="configPantalla.anchoTerciaria"
        />
      </div>

      <span>{{ configPantalla.anchoTerciaria }} </span>
    </div>
    <div
      :style="{
        display: 'flex',
        'flex-direction': configPantalla.invertido
          ? 'column-reverse'
          : 'column',
      }"
    >
      <div>
        <div class="config-row">
          Ejecuta
          <select v-model="configPantalla.muestra">
            <option value="letrayacordes">Letra y Acordes</option>
            <option value="acordes">Acordes</option>
            <option value="karaoke">Letra</option>
            <option value="partitura">Partitura</option>
            <option value="cuadrado">Cuadrado</option>
            <option value="">Nada</option>
          </select>
        </div>

        <div class="config-row">
          <div
            class="config-box"
            v-if="
              configPantalla.muestra === 'letrayacordes' ||
              configPantalla.muestra === 'karaoke'
            "
          >
            <span>Letra</span>
            <input
              type="number"
              min="8"
              max="80"
              v-model.number="configPantalla.tamanioLetra"
            />
            <span>px</span>
          </div>
          <div
            class="config-box"
            v-if="configPantalla.muestra === 'letrayacordes'"
          >
            <span>Acorde</span>
            <input
              type="number"
              min="8"
              max="80"
              v-model.number="configPantalla.tamanioAcorde"
            />
            <span>px</span>
          </div>
          <div class="config-box" v-if="configPantalla.muestra === 'acordes'">
            <span>Acorde</span>
            <input
              type="number"
              min="8"
              max="80"
              v-model.number="configPantalla.tamanioAcordesolo"
            />
            <span>px</span>
          </div>
        </div>
        <div
          class="config-row"
          v-if="
            configPantalla.muestra !== 'cuadrado' &&
            configPantalla.muestra !== ''
          "
        >
          <div class="config-box">
            <input type="checkbox" v-model="configPantalla.AutoScroll" />
            <span>Auto Scroll</span>
          </div>
          <div class="config-box">
            <span>Factor Scroll</span>
            <input
              type="number"
              min="0.2"
              max="3"
              step="0.1"
              v-model.number="configPantalla.factorScroll"
            />
          </div>
        </div>

        <div
          class="config-row"
          v-if="configPantalla.muestra === 'letrayacordes'"
        >
          <input type="checkbox" v-model="configPantalla.viendoResumenVerso" />
          <span>Modo poeta</span>
        </div>

        <div
          class="config-row"
          v-if="configPantalla.muestra === 'letrayacordes'"
        >
          <span>Columnas</span>
          <input
            type="range"
            min="10"
            max="120"
            v-model.number="configPantalla.columnas"
          />
          <span>{{ configPantalla.columnas }}</span>
        </div>
      </div>
      <div class="config-row">
        Reproduce
        <select v-model="configPantalla.reproduce">
          <option value="nada">Nada</option>
          <option value="video">Video</option>
          <option value="midi">MIDI</option>
        </select>
      </div>
    </div>

    <div class="config-row">
      <span>Muestra</span>
      <span
        :class="{ seleccionada: configPantalla.viendoSecuencia }"
        @click="
          configPantalla.viendoSecuencia = !configPantalla.viendoSecuencia
        "
        >[Secuencia]</span
      >
      <span
        :class="{ seleccionada: configPantalla.viendoInstrucciones }"
        @click="
          configPantalla.viendoInstrucciones =
            !configPantalla.viendoInstrucciones
        "
        >[Instrucciones]</span
      >
      <span
        :class="{ seleccionada: configPantalla.viendoCuadrado }"
        @click="configPantalla.viendoCuadrado = !configPantalla.viendoCuadrado"
        >[Cuadrado]</span
      >
    </div>
    <div class="config-row" v-if="refModoVista === 'triple'">
      <span>Muestra</span>
      <span
        :class="{ seleccionada: configPantalla.viendoSecuencia3 }"
        @click="
          configPantalla.viendoSecuencia3 = !configPantalla.viendoSecuencia3
        "
        >[Secuencia]</span
      >
      <span
        :class="{ seleccionada: configPantalla.viendoInstrucciones3 }"
        @click="
          configPantalla.viendoInstrucciones3 =
            !configPantalla.viendoInstrucciones3
        "
        >[Instrucciones]</span
      >
      <span
        :class="{ seleccionada: configPantalla.viendoCuadrado3 }"
        @click="
          configPantalla.viendoCuadrado3 = !configPantalla.viendoCuadrado3
        "
        >[Cuadrado]</span
      >
    </div>
    <div class="config-row">
      <span>Secuencia</span>
      <input
        type="range"
        min="8"
        max="40"
        v-model.number="configPantalla.tamanioParte"
      />
      <span>{{ configPantalla.tamanioParte }} px</span>
    </div>

    <div class="botonera">
      <button @click="guardarConfiguracionPantalla()" class="btnGuardar">
        Guardar
      </button>
      <button @click="cancelarConfiguracionPantalla()" class="btnGuardar">
        Cancelar
      </button>
    </div>
  </div>
</template>
<style scoped>
.seleccionada {
  font-weight: bold;
  background-color: rgb(223, 177, 51);
}
.vistaedit {
  font-size: x-large;
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
.config-row {
  display: flex;
  align-items: center;
}
.config-box {
  align-items: center;
  margin-right: 20px;
}

@media (max-width: 768px) {
  .vistaedit {
    left: 10%;
    top: 10%;
    font-size: small;
  }
}
</style>
