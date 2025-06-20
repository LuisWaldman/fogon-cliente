<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useAppStore } from './stores/appStore'
import Cabecera from './components/comp_cabecera/cabecera.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const cancionref = ref(route.query.cancion)

const appStore = useAppStore()
// 🔄 Si la URL cambia, actualizar `cancion`
watch(
  () => route.query.cancion,
  (nuevoValor) => {
    if (nuevoValor) {
      cancionref.value = nuevoValor
      appStore.aplicacion.tocar(nuevoValor as string)
    }
  },
)

onMounted(() => {

  const urlParams = new URLSearchParams(window.location.search)
  const cancion = urlParams.get('cancion')
  if (cancion) {    
    appStore.aplicacion.SetCancion(cancion)
  }
  appStore.aplicacion.onMounted()
  
})
</script>

<template>
  <div id="contenedor-musical" class="pantalla">
    <Cabecera />

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
