<script setup lang="ts">
import { ref } from 'vue'
import { Tiempo } from '../../modelo/tiempo'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAppStore } from '../../stores/appStore'
const appStore = useAppStore()

defineProps<{
  compas: number
  nro_cancion: number
  total_canciones: number
}>()

const tiempo = new Tiempo()
const currentCompas = ref(0)

function play() {
  appStore.aplicacion.play()
}

function pause() {
  appStore.aplicacion.pause()
}

function stop() {
  appStore.aplicacion.stop()
}

function updateCompas(newCompas: number) {
  appStore.aplicacion.updateCompas(newCompas)
  currentCompas.value = newCompas
}
</script>

<template>
  <div>
    <div style="display: inline">
      <div class="titulocontorltiempo">
        <div>
          <div class="titulocancioncontrol">
            {{ appStore.cancion?.cancion }} -
            {{ appStore.cancion?.banda }}
          </div>
          <div style="display: flex; flex-wrap: wrap">
            <input
              type="range"
              min="0"
              :max="appStore.cancion?.totalCompases"
              v-model="currentCompas"
              @input="updateCompas(currentCompas)"
              class="rango_compas"
            />

            <span class="spnTiempo"
              >{{
                tiempo.formatSegundos(
                  appStore.cancion.duracionCompas * currentCompas,
                )
              }}
              /
              {{ tiempo.formatSegundos(appStore.cancion?.duracionCancion) }}
            </span>

            <button class="boton_controller boton_controllerplay" @click="play" v-if="appStore.estado !== 'tocando'">
              <i class="bi bi-play-fill"></i>
            </button>

            <button class="boton_controller" @click="pause" v-if="appStore.estado === 'tocando'">
              <i class="bi bi-pause-fill"></i>
            </button>
            <button class="boton_controller" @click="stop" v-if="appStore.estado === 'tocando'">
              <i class="bi bi-stop-fill"></i>
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

.rango_compas {
  accent-color: '#a9a8f6';
  width: 30px;
}

.titulocancioncontrol {
  width: 40px;
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
}
</style>
