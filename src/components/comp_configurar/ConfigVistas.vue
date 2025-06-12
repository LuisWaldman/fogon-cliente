<script setup lang="ts">
import { ref } from 'vue'
import { Configuracion, VistaTocar } from '../../modelo/configuracion'

function getVistaActualIndex() {
  const w = window.innerWidth
  const h = window.innerHeight
  if (w < 700) return 0
  if (w > 1700 && h > 1000) return 2
  return 1
}

const config = Configuracion.getInstance()
const vistasTocar = ref(config.vistasTocar.map((v) => Object.assign({}, v)))
const vistaSeleccionada = ref(getVistaActualIndex())

function guardarConfiguracion() {
  config.vistasTocar = vistasTocar.value.map((v) =>
    Object.assign(new VistaTocar(), v),
  )
  config.guardarEnLocalStorage()
}
</script>

<template>
  <h3>Configuración de Vistas</h3>
  <label
    >Seleccionar vista:
    <select v-model.number="vistaSeleccionada">
      <option :value="0">Celular</option>
      <option :value="1">PC</option>
      <option :value="2">Pantalla grande</option>
    </select>
  </label>
  <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px">
    <b>
      {{
        vistaSeleccionada === 0
          ? 'Celular'
          : vistaSeleccionada === 1
            ? 'PC'
            : 'Pantalla grande'
      }}
    </b>
    <div class="config-vista-opciones">
      <div class="config-row">
        <span>Letra</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="vistasTocar[vistaSeleccionada].tamanioLetra"
        />
        <span>{{ vistasTocar[vistaSeleccionada].tamanioLetra }} px</span>
      </div>
      <div class="config-row">
        <span>Acorde</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="vistasTocar[vistaSeleccionada].tamanioAcorde"
        />
        <span>{{ vistasTocar[vistaSeleccionada].tamanioAcorde }} px</span>
      </div>
      <div class="config-row">
        <span>Acorde Solo</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="vistasTocar[vistaSeleccionada].tamanioAcordesolo"
        />
        <span>{{ vistasTocar[vistaSeleccionada].tamanioAcordesolo }} px</span>
      </div>
      <div class="config-row">
        <span>Parte</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="vistasTocar[vistaSeleccionada].tamanioParte"
        />
        <span>{{ vistasTocar[vistaSeleccionada].tamanioParte }} px</span>
      </div>
      <div class="config-row">
        <span>Acorde Parte</span>
        <input
          type="range"
          min="8"
          max="140"
          v-model.number="vistasTocar[vistaSeleccionada].tamanioAcordeParte"
        />
        <span>{{ vistasTocar[vistaSeleccionada].tamanioAcordeParte }} px</span>
      </div>

      <div class="config-row">
        <span>Ancho Pantalla Principal</span>
        <input
          type="range"
          min="3"
          max="11"
          v-model.number="vistasTocar[vistaSeleccionada].anchoPrincipal"
        />
        <span>{{ vistasTocar[vistaSeleccionada].anchoPrincipal }} </span>
      </div>
      <div class="config-row">
        <span>Descuento Alto Pantalla</span>
        <input
          type="range"
          min="0"
          max="900"
          v-model.number="vistasTocar[vistaSeleccionada].altoPantallaDescuento"
        />
        <span
          >{{ vistasTocar[vistaSeleccionada].altoPantallaDescuento }} px</span
        >
      </div>
      <div class="config-row">
        <span>Factor Scroll</span>
        <input
          type="range"
          min="1"
          max="10"
          step="0.1"
          v-model.number="vistasTocar[vistaSeleccionada].factorScroll"
        />
        <span>{{ vistasTocar[vistaSeleccionada].factorScroll }}</span>
      </div>
    </div>
  </div>
  <button id="btnGuardar" @click="guardarConfiguracion()">Guardar</button>
</template>

<style scoped></style>
