<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import { OrigenCancion } from '../modelo/cancion/origencancion'
import { UltimasCanciones } from '../modelo/cancion/ultimascanciones'
import cancionComp from '../components/comp_home/cancion.vue'
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../modelo/cancion/ItemIndiceCancion'

const appStore = useAppStore()

let ultimasCanciones = new UltimasCanciones()
const refUltimasCanciones = ref([] as ItemIndiceCancion[])
refUltimasCanciones.value = ultimasCanciones.canciones
const refResultadoCanciones = ref<ItemIndiceCancion[]>(
  appStore.aplicacion.indiceHelper.BusquedaCanciones,
)
const totalUltimas = ref(0)
totalUltimas.value = ultimasCanciones.canciones.length
const refEstadoBusqueda = ref('')
const busqueda = ref('')

/* nuevos refs para controlar los filtros (false = no seleccionado) */
const filtroEscala = ref(false)
const filtroTempo = ref(false)
const filtroVideo = ref(false)
const filtroPartitura = ref(false)
const filtroCantAcordes1 = ref(false)
const filtroDuracion = ref(false)
const filtroCalidad = ref(false)
const filtroGrupo = ref(false)

function clickTocar(cancion: OrigenCancion) {
  // Redirect to edit page for the current song
  appStore.aplicacion.ClickTocar(cancion)
}

function buscarCanciones() {
  refEstadoBusqueda.value = 'buscando...'
  appStore.aplicacion.indiceHelper
    .Buscar(busqueda.value)
    .then(() => {
      refResultadoCanciones.value =
        appStore.aplicacion.indiceHelper.BusquedaCanciones
      refEstadoBusqueda.value = ''
    })
    .catch(() => {
      refEstadoBusqueda.value = 'error'
    })
}

const viendo = ref('inicio')
function clickOpcion(viendostr: string) {
  viendo.value = viendostr
}

const viendoFiltros = ref(false)
function VerFiltros() {
  viendoFiltros.value = !viendoFiltros.value
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
        <div @click="clickOpcion('afinar')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendo === 'afinar' }"
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
      <p class="primer-parrafo">Busca Canciones</p>
      <div
        style="
          margin-bottom: 5px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        "
      >
        <input
          type="text"
          v-model="busqueda"
          placeholder="Buscar..."
          style="width: 60%"
        />
        {{ refEstadoBusqueda }}
      </div>
      <div
        v-if="viendoFiltros"
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        "
      >
        <!-- Escala -->
        <div class="filtro" :class="{ seleccionado: filtroEscala }">
          <div class="filtro-header" @click="filtroEscala = !filtroEscala">
            Escala
          </div>
          <select v-if="filtroEscala" @click.stop>
            <option value="todas">Todas</option>
          </select>
          <input
            type="checkbox"
            v-if="filtroEscala"
            v-model="filtroEscalaMenor"
          />
          <span v-if="filtroEscala" style="margin-left: 8px">m</span>
        </div>

        <!-- Tempo -->
        <div class="filtro" :class="{ seleccionado: filtroTempo }">
          <div class="filtro-header" @click="filtroTempo = !filtroTempo">
            Tempo
          </div>
          <select v-if="filtroTempo" @click.stop>
            <option value="todas">Todas</option>
          </select>
        </div>

        <!-- Video sincronizado -->
        <div class="filtro" :class="{ seleccionado: filtroVideo }">
          <div class="filtro-header" @click="filtroVideo = !filtroVideo">
            Video
          </div>
        </div>

        <!-- Partitura -->
        <div class="filtro" :class="{ seleccionado: filtroPartitura }">
          <div
            class="filtro-header"
            @click="filtroPartitura = !filtroPartitura"
          >
            Partituras
          </div>
          <select v-if="filtroPartitura" @click.stop>
            <option value="todas">Todas</option>
          </select>
        </div>

        <!-- Cantidad de Acordes 1 -->
        <div class="filtro" :class="{ seleccionado: filtroCantAcordes1 }">
          <div
            class="filtro-header"
            @click="filtroCantAcordes1 = !filtroCantAcordes1"
          >
            Acordes
          </div>
          <select v-if="filtroCantAcordes1" @click.stop>
            <option value="todas">Todas</option>
          </select>
        </div>

        <!-- Cantidad de Acordes 2 -->
        <div class="filtro" :class="{ seleccionado: filtroDuracion }">
          <div class="filtro-header" @click="filtroDuracion = !filtroDuracion">
            Duracion
          </div>
          <select v-if="filtroDuracion" @click.stop>
            <option value="todas">Todas</option>
          </select>
        </div>

        <!-- Calidad -->
        <div class="filtro" :class="{ seleccionado: filtroCalidad }">
          <div class="filtro-header" @click="filtroCalidad = !filtroCalidad">
            Calidad
          </div>
          <select v-if="filtroCalidad" @click.stop>
            <option value="todas">Todas</option>
          </select>
        </div>

        <!-- Grupo de Bandas -->
        <div class="filtro" :class="{ seleccionado: filtroGrupo }">
          <div class="filtro-header" @click="filtroGrupo = !filtroGrupo">
            Etiquetas
          </div>
          <select v-if="filtroGrupo" @click.stop>
            <option value="todas">Todas</option>
          </select>
        </div>
      </div>

      <div
        style="
          display: flex;
          justify-content: center;
          width: 100%;
          margin-bottom: 10px;
        "
      >
        <button @click="buscarCanciones()">Buscar</button>
        <button @click="VerFiltros()">Filtros</button>
      </div>

      <div
        style="width: 100%"
        v-if="refEstadoBusqueda == '' && refResultadoCanciones.length > 0"
      >
        <p class="primer-parrafo">Resultados</p>

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
.estadoTocando {
  width: 100%;
  padding-right: 29px;
  font-size: xx-large;
  display: flex;
  justify-content: flex-end;
  position: relative;

  margin-bottom: 20px;
}
.primer-parrafo {
  font-size: x-large;
}
.tocar {
  text-decoration: none;
  color: #a9a8f6;
  border: 1px solid #a9a8f6;
  padding: 10px;
  border-radius: 5px;
}
.home {
  width: 100%;
  padding: 20px;
}
.version {
  font-size: small;
  color: gray;
  margin-top: -10px;
}

.activo {
  color: white;
  background-color: blueviolet;
}
.filtro {
  margin-left: 10px;
  margin-right: 10px;
  padding: 6px;
  border-radius: 6px;
  cursor: default;
}
.filtro .filtro-header {
  font-weight: 600;
  cursor: pointer;
}
/* clase para indicar visualmente que el filtro está seleccionado */
.filtro.seleccionado {
  background-color: rgba(138, 43, 226);
  border: 1px solid rgba(138, 43, 226, 0.4);
  color: white;
}
</style>
