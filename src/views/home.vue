<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import { OrigenCancion } from '../modelo/cancion/origencancion'
import { UltimasCanciones } from '../modelo/cancion/ultimascanciones'
import cancionComp from '../components/comp_home/cancion.vue'
import busquedaCanciones from '../components/comp_home/busquedaCanciones.vue'
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../modelo/cancion/ItemIndiceCancion'

const appStore = useAppStore()

let ultimasCanciones = new UltimasCanciones()
const refUltimasCanciones = ref([] as ItemIndiceCancion[])
refUltimasCanciones.value = ultimasCanciones.canciones
const refResultadoCanciones = ref<ItemIndiceCancion[]>([])
const totalUltimas = ref(0)
totalUltimas.value = ultimasCanciones.canciones.length

function clickTocar(cancion: OrigenCancion) {
  appStore.aplicacion.ClickTocar(cancion)
}

function handleResultados(canciones: ItemIndiceCancion[]) {
  refResultadoCanciones.value = canciones
}

const viendo = ref('inicio')
function clickOpcion(viendostr: string) {
  viendo.value = viendostr
}
</script>

<template>
  <div style="width: 100%">
    <div class="config-menu">
      <div class="config-menu-group">
        <div @click="clickOpcion('inicio')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendo === 'inicio' }"
          >
            Inicio
          </a>
        </div>

        <div @click="clickOpcion('conexion')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendo === 'conexion' }"
          >
            Tus Canciones
          </a>
        </div>

        <div @click="clickOpcion('listas')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendo === 'listas' }"
          >
            Listas de Reproduccion
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="home">
    <div
      style="
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      "
    >
      <!-- Componente de búsqueda -->
      <busquedaCanciones @resultados="handleResultados" />

      <!-- Mostrar resultados de búsqueda -->
      <div style="width: 100%" v-if="refResultadoCanciones.length > 0">
        <div style="display: flex; flex-wrap: wrap">
          <cancionComp
            v-for="(cancion, index) in refResultadoCanciones"
            :key="index"
            :cancion="cancion"
            @click="clickTocar(cancion.origen)"
          />
        </div>
      </div>
    </div>

    <!-- Últimas canciones -->
    <div class="ultimasCanciones" v-if="refUltimasCanciones.length > 0">
      <p class="primer-parrafo">Ultimas {{ totalUltimas }} Canciones</p>
      <div style="display: flex; flex-wrap: wrap">
        <cancionComp
          v-for="(cancion, index) in refUltimasCanciones"
          :key="index"
          :cancion="cancion"
          @click="clickTocar(cancion.origen)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-menu-group {
  display: flex;
  width: 100%;
}
.config-menu-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  margin: 0 2px;
  border-radius: 5px;
  transition: all 0.3s ease;
}
.config-menu-item:hover {
  background-color: rgba(138, 43, 226, 0.5);
}
.primer-parrafo {
  font-size: x-large;
}
.home {
  width: 100%;
  padding: 20px;
}
.activo {
  color: white;
  background-color: blueviolet;
}
</style>
