<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Tiempo } from '../../modelo/tiempo'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAppStore } from '../../stores/appStore'

import emoticonOrigen from '../comp_home/emoticonOrigen.vue'
const appStore = useAppStore()

const tiempo = new Tiempo()
const currentCompas = ref(0)
const tiempoActual = ref('--:--')
const showPlaylist = ref(false)

watch(
  () => appStore.golpeDelCompas,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      tiempoActual.value = tiempo.formatSegundos(
        appStore.cancion.duracionCompas * appStore.compas,
      )
    }
  },
)

watch(
  () => appStore.compas,
  (newVal) => {
    tiempoActual.value = tiempo.formatSegundos(
      appStore.cancion.duracionCompas * appStore.compas,
    )
    currentCompas.value = newVal
  },
)

function play() {
  appStore.aplicacion.play()
}

function next() {
  appStore.aplicacion.next()
}

function pause() {
  appStore.aplicacion.pause()
}

function stop() {
  appStore.aplicacion.stop()
}

function updateCompas() {
  const toStr = currentCompas.value.toString()
  appStore.aplicacion.updateCompas(parseInt(toStr) + 1)
}

function togglePlaylist() {
  showPlaylist.value = !showPlaylist.value
}

function selectSong(index: number) {
  appStore.aplicacion.ClickCancionNro(index)
  showPlaylist.value = false
}

function closePlaylistOnOutsideClick(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.playlist-container')) {
    showPlaylist.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closePlaylistOnOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', closePlaylistOnOutsideClick)
})

function arreglartexto(texto: string): string {
  if (texto == null || texto === undefined) return ''
  let processed = texto.replace(/-/g, ' ')
  if (processed.length === 0) return processed

  // First letter lowercase, rest uppercase
  processed =
    processed.charAt(0).toUpperCase() + processed.slice(1).toLocaleLowerCase()

  // Truncate if longer than 50 characters
  if (processed.length > 50) {
    processed = processed.substring(0, 47) + '...'
  }

  return processed
}

</script>

<template>
  <div class="controladortiempo">
    <div class="controls">
      <button
        class="boton_controller boton_controllerplay"
        @click="play"
        v-if="appStore.estadoReproduccion === 'pausado'"
      >
        ▶️
      </button>

      <button
        class="boton_controller"
        @click="pause"
        v-if="appStore.estadoReproduccion !== 'pausado'"
      >
        ⏸️
      </button>
      <button
        class="boton_controller"
        @click="stop"
        v-if="appStore.estadoReproduccion !== 'pausado'"
      >
        ⏹️
      </button>
      <button
        class="boton_controller boton_controllerplay"
        @click="next"
        v-if="appStore.listaReproduccion.length > 0"
      >
        ⏭️
      </button>
      <div
        class="playlist-container"
        v-if="appStore.listaReproduccion.length > 0"
      >
        <button class="boton_controller" @click="togglePlaylist">📋</button>
        <div class="playlist-dropdown" v-if="showPlaylist">
          <div class="playlist-header">Lista de Reproducción</div>
          <div
            v-for="(cancion, index) in appStore.listaReproduccion"
            :key="index"
            class="playlist-item"
            :class="{ active: index === appStore.nroCancion }"
            @click="selectSong(index)"
          >
            <div class="song-info">
              <div class="song-title"><emoticonOrigen :origen="cancion.origenUrl" /> {{ arreglartexto(cancion.cancion) }}</div>
              <div class="song-artist">{{ arreglartexto(cancion.banda) }}</div>
            </div>
            <div class="song-duration">
              {{
              tiempo.formatSegundos(
                (60 / cancion.bpm) *
                  cancion.totalCompases *
                  cancion.compasCantidad,
              )
            }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <table
      width="100%"
      style="table-layout: fixed; margin-left: 12px"
      margin="0"
    >
      <tbody>
        <tr>
          <td :colspan="appStore.cancion?.totalCompases">
            <input
              type="range"
              min="-1"
              :max="appStore.cancion?.totalCompases"
              v-model="currentCompas"
              @input="updateCompas()"
              class="rango_compas"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <span class="spnTiempo"
      >{{ tiempoActual }}
      /
      {{ tiempo.formatSegundos(appStore.cancion?.duracionCancion) }}
    </span>
  </div>
</template>

<style scoped>
.controladortiempo {
  display: flex;
  width: 100%;
  margin: 3px;
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  margin-left: 10px;
  padding: 5px;
}
.columnacontrol {
  margin: 1px !important;
  padding: 1px !important;
}
.controls {
  display: flex;
}
.clsEditando {
  background-color: black;
  color: #a9a8f6;
}
.titulocontorltiempo {
  font-size: 38px;
  padding-left: 12px;
  margin: 4px;
  border-radius: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.boton_controller {
  border-radius: 3px;
  color: #a9a8f6;
  background-color: black;
  font-size: 20px;
  border: 1px solid #a9a8f6;
  width: 46px;
  margin: 3px;
  height: 46px;
}

.boton_controllerplay {
  font-size: 30px !important;
}

.spnTiempo {
  font-size: 26px;
  border-radius: 8px;

  padding: 1px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rango_compas {
  accent-color: '#a9a8f6';
  width: 100%;
  margin-left: 10px;
  padding: 0px;
}

.titulocancioncontrol {
  width: 40px;
}

.playlist-container {
  position: relative;
  display: inline-block;
}

.playlist-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: black;
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  min-width: 300px;
  max-width: 400px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 -4px 6px rgba(169, 168, 246, 0.3);
  margin-bottom: 5px;
}

.playlist-header {
  padding: 10px;
  background-color: #a9a8f6;
  color: black;
  font-weight: bold;
  text-align: center;
  border-radius: 8px 8px 0 0;
  order: -1;
}

.playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

.playlist-item:hover {
  background-color: rgba(169, 168, 246, 0.1);
}

.playlist-item.active {
  background-color: rgba(169, 168, 246, 0.2);
  border-left: 3px solid #a9a8f6;
}

.playlist-item:last-child {
  border-bottom: none;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-weight: bold;
  color: #a9a8f6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.song-artist {
  color: #ccc;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-duration {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .titulocontorltiempo {
    font-size: 18px;
    padding-left: 4px;
    margin: 2px;
  }
  .boton_controller {
    font-size: 12px;
    width: 28px;
    height: 28px;
  }
  .boton_controllerplay {
    font-size: 16px !important;
  }
  .spnTiempo {
    font-size: 12px;
  }

  .playlist-dropdown {
    min-width: 250px;
    max-width: 300px;
    right: 0;
    left: auto;
    bottom: 100%;
    margin-bottom: 5px;
  }

  .song-title,
  .song-artist {
    font-size: 11px;
  }

  .song-duration {
    font-size: 10px;
  }
}

@media (max-width: 600px) {
  .partes_control {
    display: none !important;
  }
}
</style>
