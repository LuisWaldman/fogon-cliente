<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion'
import { Tiempo } from '../../modelo/tiempo'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAppStore } from '../../stores/appStore'
const appStore = useAppStore()

const props = defineProps<{
  compas: number
  cancion: Cancion
  nro_cancion: number
  total_canciones: number
  viendo_vista: string
}>()

const emit = defineEmits(['acciono'])
const tiempo = new Tiempo()
const currentCompas = ref(0)
const segundosTotales = ref(0)
const segundosActuales = ref(0)
const metronomeRef = ref()

import { watch } from 'vue'



function play() {
  emit('acciono', 'play')
  metronomeRef.value?.startMetronome()
}

function pause() {
  console.log(metronomeRef.value)
  metronomeRef.value?.stopMetronome()
  emit('acciono', 'pause')
}

function stop() {
  metronomeRef.value?.stopMetronome()
  emit('acciono', 'stop')
}

function next() {
  emit('acciono', 'next')
}

function previous() {
  emit('acciono', 'previous')
}

function updateCompas(newCompas: number) {
  emit('acciono', 'compas', newCompas)
}
</script>

<template>
  <div>
    <div style="display: inline">
      <div class="titulocontorltiempo">
        <div v-if="viendo_vista == 'editar'"></div>

        <div v-if="viendo_vista == 'tocar'">
          {{ nro_cancion + 1 }} / {{ total_canciones }} {{ appStore.cancion?.cancion }} -
          {{ appStore.cancion?.banda }}

          <div style="display: flex; flex-wrap: wrap">
            <input
              type="range"
              min="0"
              :max="appStore.cancion?.totalCompases"
              v-model="currentCompas"
              @input="updateCompas(currentCompas)"
              style="accent-color: #a9a8f6"
            />

            <span class="spnTiempo"
              >{{ tiempo.formatSegundos(segundosActuales) }} /
              {{ tiempo.formatSegundos(segundosTotales) }}
            </span>
            <button class="boton_controller boton_controllerplay" @click="play">
              <i class="bi bi-play-fill"></i>
            </button>

            <button class="boton_controller" @click="pause">
              <i class="bi bi-pause-fill"></i>
            </button>
            <button class="boton_controller" @click="stop">
              <i class="bi bi-stop-fill"></i>
            </button>

            <button class="boton_controller" @click="previous">
              <i class="bi bi-skip-backward-fill"></i>
            </button>
            <button class="boton_controller" @click="next">
              <i class="bi bi-skip-forward-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
}
.clsEditando {
  background-color: black;
  color: #a9a8f6;
}
.titulocontorltiempo {
  border: 1px solid;
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
  height: 46px;
}

.boton_controllerplay {
  font-size: 30px !important;
}

.spnTiempo {
  border: 1px solid;
  font-size: 16px;
  margin: 14px;
  border-radius: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
