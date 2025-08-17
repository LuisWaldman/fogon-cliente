<script setup lang="ts">
import { useAppStore } from '../stores/appStore'

import { OrigenCancion } from '../modelo/cancion/origencancion'
import { UltimasCanciones } from '../modelo/cancion/ultimascanciones'

import cancionComp from '../components/comp_home/cancion.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../modelo/cancion/ItemIndiceCancion'
import { CancionUrlManager } from '../modelo/cancion/CancionUrlManager'

let ultimasCanciones = new UltimasCanciones()
const refUltimasCanciones = ref(
  ultimasCanciones.canciones as ItemIndiceCancion[],
)
const refResultadoCanciones = ref([] as ItemIndiceCancion[])
const refTodasCanciones = ref([] as ItemIndiceCancion[])
const refEstadoBusqueda = ref('')
const busqueda = ref('')

function buscarCanciones() {
  if (refTodasCanciones.value.length === 0) {
    refEstadoBusqueda.value = 'cargando'
    refTodasCanciones.value = ultimasCanciones.canciones as ItemIndiceCancion[]
    CancionUrlManager.GetIndice()
      .then((resultado) => {
        refTodasCanciones.value = resultado
        filtrar()
      })
      .catch((error) => {
        console.error('Error trayendo indice:', error)
        refEstadoBusqueda.value = 'error'
      })
  } else {
    filtrar()
  }

  function filtrarvectores(filtro: string, vector: ItemIndiceCancion[]) {
    return vector.filter(
      (cancion) =>
        cancion.banda.toLowerCase().includes(filtro.toLowerCase()) ||
        cancion.cancion.toLowerCase().includes(filtro.toLowerCase()),
    )
  }
  function filtrar() {
    refEstadoBusqueda.value = 'filtrando'
    if (busqueda.value === '') {
      refResultadoCanciones.value = refTodasCanciones.value
    } else {
      let resultado = refTodasCanciones.value as ItemIndiceCancion[]
      const filtros = busqueda.value.split(',')
      for (let i = 0; i < filtros.length; i++) {
        resultado = filtrarvectores(filtros[i], resultado)
      }
      refResultadoCanciones.value = resultado
    }
    refEstadoBusqueda.value = 'listo'
  }
  refEstadoBusqueda.value = 'listo'
}

const appStore = useAppStore()

const router = useRouter()
function clickTocar(cancion: OrigenCancion) {
  // Redirect to edit page for the current song
  appStore.aplicacion.SetCancion(cancion).then(() => {
    router.push('/tocar')
  })
}
</script>
<template>
  <div class="home">
    <p class="primer-parrafo" v-if="appStore.estado === 'conectando'">
      Esta desconectado! No Pasa nada, el fogon esta preparado para funcionar
      off-line. En esta version, podes ver las noticias locales
    </p>
    <p class="primer-parrafo" v-if="appStore.estado === 'conectando'">
      Revisa los servidores en configuracion y conectate a un fogon
    </p>

    <div>
      <p class="primer-parrafo">Busca Canciones</p>
      <input type="text" v-model="busqueda" placeholder="Buscar..." />
      <button @click="buscarCanciones()">Buscar</button> {{ refEstadoBusqueda }}
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

    <div class="ultimasCanciones" v-if="refUltimasCanciones.length > 0">
      <p class="primer-parrafo">Ultimas Canciones</p>
      <div style="display: flex; flex-wrap: wrap">
        <cancionComp
          v-for="(cancion, index) in refUltimasCanciones"
          :key="index"
          :cancion="cancion"
          @click="clickTocar(cancion.origen)"
        />
      </div>
    </div>
    <p class="primer-parrafo" v-if="appStore.estado === 'conectado'">
      Conectado!
    </p>
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
