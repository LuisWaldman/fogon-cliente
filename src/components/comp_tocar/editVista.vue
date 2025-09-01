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

function cancelarConfiguracionPantalla() {
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
  <div class="editSize">
    <div class="tituloeditSize">Tamaños</div>
    <div class="config-row">
      <span>Letra</span>
      <input
        type="range"
        min="8"
        max="40"
        v-model.number="configPantalla.tamanioLetra"
      />
      <span>{{ configPantalla.tamanioLetra }} px</span>
    </div>
    <div class="config-row">
      <span>Acorde</span>
      <input
        type="range"
        min="8"
        max="40"
        v-model.number="configPantalla.tamanioAcorde"
      />
      <span>{{ configPantalla.tamanioAcorde }} px</span>
    </div>
    <div class="config-row">
      <span>Acorde Solo</span>
      <input
        type="range"
        min="8"
        max="40"
        v-model.number="configPantalla.tamanioAcordesolo"
      />
      <span>{{ configPantalla.tamanioAcordesolo }} px</span>
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
    <div class="config-row">
      <span>Acorde Parte</span>
      <input
        type="range"
        min="8"
        max="40"
        v-model.number="configPantalla.tamanioAcordeParte"
      />
      <span>{{ configPantalla.tamanioAcordeParte }} px</span>
    </div>
    <div class="config-row">
      <input type="checkbox" v-model="configPantalla.viendoResumenVerso" />
      <span>Ver resumen verso</span>
    </div>
    <div class="config-row">
      <span>Ancho Pantalla Principal</span>
      <input
        type="range"
        min="3"
        max="98"
        v-model.number="configPantalla.anchoPrincipal"
      />
      <span>{{ configPantalla.anchoPrincipal }} </span>
    </div>
    <div class="config-row">
      <span>Columnas</span>
      <input
        type="range"
        min="10"
        max="120"
        v-model.number="configPantalla.columnas"
      />
      <span>{{ configPantalla.columnas }}</span>
    </div>
    <div class="config-row">
      <span>Factor Scroll</span>
      <input
        type="range"
        min="0.2"
        max="3"
        step="0.1"
        v-model.number="configPantalla.factorScroll"
      />
      <span>{{ configPantalla.factorScroll }}</span>
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
