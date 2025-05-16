<script setup lang="ts">
import Aplicacion from './aplicacion'
import { useRoute } from 'vue-router'
import { onMounted, ref, Ref } from 'vue'
import Cabecera from './components/comp_cabecera/cabecera.vue'
import { Cancion } from './modelo/cancion'
import { Acordes } from './modelo/acordes'
import { Letra } from './modelo/letra'

const route = useRoute()
const cancion: Ref<Cancion> = ref(
  new Cancion(
    'Cancion no cargada',
    'sin banda',
    new Acordes([], []),
    new Letra([]),
  ),
)

const aplicacion = new Aplicacion()
onMounted(() => {
  aplicacion.onMounted()
  console.log('onMounted', route.query.tocar)
  if (route.query.tocar) {
    aplicacion.tocar(String(route.query.tocar))
  }
})
</script>

<template>
  <div>
    <Cabecera
      viendo_vista="tocar"
      :compas="0"
      :cancion="cancion"
      :nro_cancion="0"
      :listaCanciones="[]"
      estado=""
      :bpm_encompas="0"
    />
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
