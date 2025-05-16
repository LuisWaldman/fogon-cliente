<script setup lang="ts">
import Aplicacion from './aplicacion'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()

const aplicacion: Aplicacion = new Aplicacion()
onMounted(() => {
  aplicacion.onMounted()

  console.log('onMounted', route.query.tocar)

  if (route.query.tocar) {
    aplicacion.tocar(route.query.tocar as string)
  }
})
</script>

<template>  <div>
    <nav>
      <router-link to="/">Inicio</router-link>
      <router-link to="/editar">Editar</router-link>
      <router-link to="/listas">Listas</router-link>
      <router-link to="/configurar">Configurar</router-link>
    </nav>
    <router-view />
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
</style>
