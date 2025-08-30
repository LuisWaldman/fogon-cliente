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
</script>
<template>
  <div class="home">
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
    <div>
      <p class="primer-parrafo">Busca Canciones</p>

      <div style="display: flex">
        <div style="width: 70%">
          <input type="text" v-model="busqueda" placeholder="Buscar..." />
          <button @click="buscarCanciones()">Buscar</button>
          {{ refEstadoBusqueda }}
        </div>
      </div>
      <div>
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
  </div>
</template>
<style scoped>
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
</style>
