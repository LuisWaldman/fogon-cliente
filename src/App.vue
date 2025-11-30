<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from './stores/appStore'
import Cabecera from './components/comp_cabecera/cabecera.vue'
import { useRouter } from 'vue-router'
import editVista from './components/editVista.vue'
import { OrigenCancion } from './modelo/cancion/origencancion'

const appStore = useAppStore()
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const cancionUrl = urlParams.get('cancion')
  // Redirect from fogon.ar to www.fogon.ar with the same parameters
  const currentHost = window.location.hostname
  const currentPath = window.location.pathname
  const fullParams = window.location.search

  if (currentHost === 'fogon.ar') {
    // Redirect to www.fogon.ar preserving path and query parameters
    window.location.href = `https://www.fogon.ar${currentPath}${fullParams}`
    return
  } else if (currentPath !== '/' && !cancionUrl) {
    // If we're on any route other than root and there's no cancion parameter,
    // redirect to the root
    //window.location.href = '/'
    //      return
  }

  const router = useRouter()
  appStore.aplicacion.setRouter(router)
  appStore.aplicacion.onMounted()
})
const refEditandoVista = ref(false)
function cerrareditarPantalla() {
  refEditandoVista.value = false
}

const router = useRouter()
function clickEditar() {
  // Redirect to edit page for the current song
  appStore.editandocancion = appStore.aplicacion.reproductor.cancion
  appStore.origenEditando = new OrigenCancion(
    appStore.origenCancion.origenUrl,
    appStore.origenCancion.fileName,
    appStore.origenCancion.usuario,
  )
  appStore.cancionModificada = false
  router.push('/editar')
}

function abrirVistaEdicion() {
  refEditandoVista.value = true
}
</script>

<template>
  <div id="contenedor-musical" class="pantalla">
    <Cabecera
      @abrirVistaEdicion="abrirVistaEdicion"
      @editarCancion="clickEditar"
    />
        <div style="text-align: center" v-if="appStore.estadosApp.estado != 'ok'">
      <img
        src="/img/iconogrande.png"
        style="width: 300px; height: auto"
        class="logo vue"
        alt="Vue logo"
      />
      <div>{{ appStore.estadosApp.texto }}</div>
    </div>
    <router-view v-if="appStore.estadosApp.estado === 'ok'" />
    <editVista
      v-if="refEditandoVista"
      @cerrar="cerrareditarPantalla"
    ></editVista>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

#contenedor-musical {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cancion {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.fixed-bottom-right {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 9999; /* Asegura que se muestre encima de otros elementos */
}
.carteliniciando {
  position: absolute;
  top: 20px;
  font-size: 500px;
  border: 5px solid #a9a8f6;
  margin-left: 300px;
  padding-left: 40px;
  padding-right: 40px;
  border-radius: 60px;
}
</style>
