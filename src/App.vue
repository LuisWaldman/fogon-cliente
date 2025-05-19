<script setup lang="ts">
import Aplicacion from './aplicacion'
import { useRoute } from 'vue-router'
import { onMounted, ref, type Ref } from 'vue'
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
  console.log('URL actual:', route.fullPath)
  console.log('Valor de cancion:', route.query.cancion)

  if (route.query.cancion) {
    console.log('tocara')
    aplicacion.tocar(String(route.query.cancion))
  }
})
</script>

<template>
  <div id="contenedor-musical" class="pantalla">
    <Cabecera
      viendo_vista="tocar"
      :compas="0"
      :cancion="cancion"
      :nro_cancion="0"
      :listaCanciones="[]"
      estado=""
      :bpm_encompas="0"
    />

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

#contenedor-musical {
  height: 100vh; /* Altura completa de la ventana */
  width: 100%;
}
.pantalla {
  width: 100%;
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
