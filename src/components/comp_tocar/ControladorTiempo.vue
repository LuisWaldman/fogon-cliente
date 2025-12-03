<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Tiempo } from '../../modelo/tiempo'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAppStore } from '../../stores/appStore'

import emoticonOrigen from '../comp_home/emoticonOrigen.vue'
import type { Cancion } from '../../modelo/cancion/cancion'
const appStore = useAppStore()

const tiempo = new Tiempo()
const tiempoActual = ref('--:--')
const showPlaylist = ref(false)
const props = defineProps<{
  golpeEnCompas: number
  compas: number
  cancion: Cancion
  estadoReproduccion: string
}>()
const currentCompas = ref(props.compas)

watch(
  () => props.golpeEnCompas,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      tiempoActual.value = tiempo.formatSegundos(
        props.cancion.duracionCompas * props.compas,
      )
    }
  },
)

watch(
  () => props.compas,
  () => {
    tiempoActual.value = tiempo.formatSegundos(
      props.cancion.duracionCompas * props.compas,
    )
    currentCompas.value = props.compas
  },
)

function play() {
  appStore.aplicacion.reproductor.iniciarReproduccion()
}

function next() {
  appStore.aplicacion.next()
}

function pause() {
  appStore.aplicacion.reproductor.detenerReproduccion()
}

function stop() {
  appStore.aplicacion.reproductor.detenerReproduccion()
  appStore.aplicacion.reproductor.updateCompas(0)
}

function updateCompas() {
  const toStr = currentCompas.value.toString()
  appStore.aplicacion.reproductor.updateCompas(parseInt(toStr))
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
      <div
        class="boton_controllerplay"
        v-if="appStore.estadosApp.estadoReproduccion === 'esperandoMedia'"
      >
        🔥
      </div>
      <div
        class="boton_controllerplay"
        @click="play"
        v-if="appStore.estadosApp.estadoReproduccion === 'pausa'"
      >
        ▶️
      </div>

      <div
        class="boton_controllerplay"
        @click="pause"
        v-if="
          appStore.estadosApp.estadoReproduccion === 'reproduciendo' ||
          appStore.estadosApp.estadoReproduccion === 'iniciando'
        "
      >
        ⏸️
      </div>
      <div
        class="boton_controllerplay"
        @click="stop"
        v-if="
          appStore.estadosApp.estadoReproduccion === 'reproduciendo' ||
          appStore.estadosApp.estadoReproduccion === 'iniciando'
        "
      >
        ⏹️
      </div>
    </div>
    <input
      type="range"
      min="0"
      :max="props.cancion?.totalCompases"
      v-model="currentCompas"
      @input="updateCompas()"
      class="rango_compas"
    />
    <div
      class="boton_controllerplay ocultocelu"
      @click="next"
      v-if="appStore.listaReproduccion.length > 0"
    >
      ⏭️
    </div>
    <div
      class="playlist-container"
      v-if="appStore.listaReproduccion.length > 0"
    >
      <button @click="togglePlaylist">📋</button>
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
            <div class="song-title">
              <emoticonOrigen :origen="cancion.origenUrl" />
              {{ arreglartexto(cancion.cancion) }}
            </div>
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

    <span class="spnTiempo"
      >{{ tiempoActual }}
      /
      {{ tiempo.formatSegundos(props.cancion?.duracionCancion) }}
    </span>
  </div>
</template>

<style scoped>
.controladortiempo {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 4px 0;
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.08),
    rgba(169, 168, 246, 0.04)
  );
  border: 2px solid rgba(169, 168, 246, 0.3);
  border-radius: 12px;
  margin-left: 10px;
  padding: 6px 12px;
  box-shadow: 0 4px 12px rgba(169, 168, 246, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  gap: 8px;
  height: 48px;
}

.controladortiempo:hover {
  border-color: rgba(169, 168, 246, 0.5);
  box-shadow: 0 6px 20px rgba(169, 168, 246, 0.25);
  transform: translateY(-1px);
}

.columnacontrol {
  margin: 1px !important;
  padding: 1px !important;
}

.controls {
  display: flex;
  align-items: center;
  gap: 8px;
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

.boton_controllerplay {
  font-size: 20px !important;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: rgba(169, 168, 246, 0.1);
  border: 1px solid rgba(169, 168, 246, 0.2);
  color: #a9a8f6;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
}

.boton_controllerplay:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.4);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.3);
}

.boton_controllerplay:active {
  transform: scale(0.95);
}

.spnTiempo {
  font-size: 14px;
  font-weight: 600;
  color: #a9a8f6;
  background: rgba(169, 168, 246, 0.1);
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 8px;
  padding: 4px 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  min-width: 110px;
  text-align: center;
  flex-shrink: 0;
}

.rango_compas {
  accent-color: #a9a8f6;
  flex: 1;
  margin: 0 8px;
  padding: 0;
  height: 6px;
  background: rgba(169, 168, 246, 0.2);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rango_compas::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #a9a8f6;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(169, 168, 246, 0.4);
  transition: all 0.2s ease;
}

.rango_compas::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 3px 10px rgba(169, 168, 246, 0.6);
}

.rango_compas::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #a9a8f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(169, 168, 246, 0.4);
  transition: all 0.2s ease;
}

.rango_compas::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 3px 10px rgba(169, 168, 246, 0.6);
}

.titulocancioncontrol {
  width: 40px;
}

.playlist-container {
  position: relative;
  display: flex;
  align-items: center;
}

.playlist-container button {
  background: rgba(169, 168, 246, 0.1);
  border: 1px solid rgba(169, 168, 246, 0.2);
  color: #a9a8f6;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  margin-top: 0;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
}

.playlist-container button:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.4);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.3);
}

.playlist-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.95),
    rgba(20, 20, 30, 0.95)
  );
  border: 2px solid rgba(169, 168, 246, 0.4);
  border-radius: 16px;
  min-width: 320px;
  max-width: 420px;
  max-height: 350px;
  overflow: hidden;
  z-index: 9999;
  box-shadow:
    0 -8px 32px rgba(169, 168, 246, 0.3),
    0 -2px 8px rgba(0, 0, 0, 0.5);
  margin-bottom: 8px;
  backdrop-filter: blur(20px);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.playlist-dropdown::-webkit-scrollbar {
  width: 6px;
}

.playlist-dropdown::-webkit-scrollbar-track {
  background: rgba(169, 168, 246, 0.1);
  border-radius: 3px;
}

.playlist-dropdown::-webkit-scrollbar-thumb {
  background: rgba(169, 168, 246, 0.4);
  border-radius: 3px;
}

.playlist-dropdown::-webkit-scrollbar-thumb:hover {
  background: rgba(169, 168, 246, 0.6);
}

.playlist-header {
  padding: 16px;
  background: linear-gradient(135deg, #a9a8f6, #8b8af0);
  color: #000;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  border-radius: 14px 14px 0 0;
  order: -1;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
}

.playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(169, 168, 246, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.playlist-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(169, 168, 246, 0.3), transparent);
  transition: width 0.3s ease;
}

.playlist-item:hover::before {
  width: 100%;
}

.playlist-item:hover {
  background-color: rgba(169, 168, 246, 0.15);
  transform: translateX(4px);
}

.playlist-item.active {
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.25),
    rgba(169, 168, 246, 0.15)
  );
  border-left: 4px solid #a9a8f6;
  padding-left: 12px;
}

.playlist-item.active::before {
  width: 100%;
}

.playlist-item:last-child {
  border-bottom: none;
  border-radius: 0 0 14px 14px;
}

.song-info {
  flex: 1;
  min-width: 0;
  z-index: 1;
  position: relative;
}

.song-title {
  font-weight: 600;
  color: #a9a8f6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  margin-bottom: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.song-artist {
  color: #ccc;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
}

.song-duration {
  color: #a9a8f6;
  font-size: 12px;
  font-weight: 500;
  margin-left: 12px;
  white-space: nowrap;
  background: rgba(169, 168, 246, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  z-index: 1;
  position: relative;
}

@media (max-width: 768px) {
  .controladortiempo {
    padding: 8px 12px;
    gap: 8px;
    margin: 4px 0;
  }

  .titulocontorltiempo {
    font-size: 18px;
    padding-left: 4px;
    margin: 2px;
  }

  .boton_controller {
    font-size: 12px;
    width: 28px;
    height: 28px;
    padding: 0px;
    margin: 0px;
  }

  .boton_controllerplay {
    font-size: 20px !important;
    min-width: 36px;
    min-height: 36px;
    padding: 6px;
  }

  .spnTiempo {
    font-size: 14px;
    padding: 6px 8px;
    min-width: 100px;
  }

  .rango_compas {
    margin: 0 8px;
    height: 4px;
  }

  .rango_compas::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
  }

  .rango_compas::-moz-range-thumb {
    width: 16px;
    height: 16px;
  }

  .playlist-dropdown {
    min-width: 280px;
    max-width: 320px;
    right: 0;
    left: auto;
    bottom: 100%;
    margin-bottom: 8px;
  }

  .playlist-header {
    padding: 12px;
    font-size: 14px;
  }

  .playlist-item {
    padding: 10px 12px;
  }

  .song-title {
    font-size: 13px;
  }

  .song-artist {
    font-size: 11px;
  }

  .song-duration {
    font-size: 10px;
    padding: 3px 6px;
    margin-left: 8px;
  }
}

@media (max-width: 600px) {
  .controladortiempo {
    margin-left: 0px;
    padding: 6px 8px;
    gap: 6px;
  }

  .partes_control {
    display: none !important;
  }

  .spnTiempo {
    display: none !important;
  }

  .ocultocelu {
    display: none !important;
  }

  .rango_compas {
    margin: 0 !important;
  }

  .boton_controllerplay {
    font-size: 18px !important;
    min-width: 32px;
    min-height: 32px;
    padding: 4px;
  }

  .playlist-container button {
    padding: 6px 8px;
    font-size: 16px;
  }

  .playlist-dropdown {
    min-width: 260px;
    max-width: 280px;
  }
}
</style>
