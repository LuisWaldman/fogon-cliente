<script setup lang="ts">
import { useAppStore } from '../stores/appStore'

import noticiaComp from '../components/comp_home/noticia.vue'

const appStore = useAppStore()
</script>
<template>
  <div class="home">
    <h1 style="color: blueviolet; margin-bottom: 0px; padding-bottom: 0px">
      Bienvenido al Fogon
    </h1>
    <span class="version">V. sesiones</span>

    <div
      class="estadoTocando"
      v-if="
        appStore.estadoReproduccion === 'Reproduciendo' ||
        appStore.estadoSesion === 'conectado'
      "
    >
      <router-link class="tocar" to="/tocar"> 🎸 Volver al tema </router-link>
    </div>
    <p class="primer-parrafo" v-if="appStore.estado === 'conectando'">
      Esta desconectado! No Pasa nada, el fogon esta preparado para funcionar
      off-line. En esta version, podes ver las noticias locales
    </p>
    <p class="primer-parrafo" v-if="appStore.estado === 'conectando'">
      Revisa los servidores en configuracion y conectate a un fogon
    </p>
    <p class="primer-parrafo" v-if="appStore.estado === 'conectado'">
      Esta conectado! <router-link to="/configurar">Logueate </router-link> para
      poder tocar con otros fogoneros
    </p>
    <p class="primer-parrafo" v-if="appStore.estado === 'logueado'">
      Estas son las noticias en tu servidor
    </p>

    <div class="containerNoticias">
      <noticiaComp
        v-for="(noticia, index) in appStore.noticias"
        :key="index"
        :noticia="noticia"
      ></noticiaComp>
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
