<script setup lang="ts">
import { ref, watch } from 'vue'
import { Tiempo } from '../../modelo/tiempo'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAppStore } from '../../stores/appStore'
const appStore = useAppStore()

const tiempo = new Tiempo()
const currentCompas = ref(0)
const tiempoActual = ref('--:--')

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
    console.log(appStore.compas)
    tiempoActual.value = tiempo.formatSegundos(
      appStore.cancion.duracionCompas * appStore.compas,
    )
    currentCompas.value = newVal
  },
)

function play() {
  appStore.aplicacion.play()
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
</script>

<template>
  <div class="controladortiempo">
    <div class="controls">
      <button
        class="boton_controller boton_controllerplay"
        @click="play"
        v-if="appStore.estadoReproduccion !== 'Reproduciendo'"
      >
        <i class="bi bi-play-fill"></i>
      </button>
      <button
        class="boton_controller"
        @click="pause"
        v-if="appStore.estadoReproduccion === 'Reproduciendo'"
      >
        <i class="bi bi-pause-fill"></i>
      </button>
      <button
        class="boton_controller"
        @click="stop"
        v-if="appStore.estadoReproduccion === 'Reproduciendo'"
      >
        <i class="bi bi-stop-fill"></i>
      </button>
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
        <tr>
          <td
            style="
              text-align: center;
              border: 1px solid;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: small;
            "
            v-for="(i, a) in appStore.cancion.acordes.ordenPartes"
            :key="a"
            :colspan="appStore.cancion.acordes.partes[i].acordes.length"
          >
            {{ appStore.cancion.acordes.partes[i].nombre }}
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
