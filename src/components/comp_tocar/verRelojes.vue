<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { HelperSincro } from '../../modelo/sincro/HelperSincro'
import { SincroCancion } from '../../modelo/sincro/SincroCancion'

const appStore = useAppStore()
function calculoRelojes() {
  const duracionGolpe = appStore.cancion?.duracionGolpe * 1000
  const golpesxcompas = appStore.cancion?.compasCantidad || 4
  const helper = HelperSincro.getInstance()
  const momento = helper.ObtenerMomento()
  appStore.momentoRecibioInicio = momento
  const sincro = new SincroCancion(
    duracionGolpe,
    new Date(appStore.sesSincroCancion.timeInicio),
    golpesxcompas, // golpesxcompas
    appStore.sesSincroCancion.desdeCompas, // duracionGolpe
  )
  appStore.EstadoSincro = helper.sincronizar(sincro, momento)
  if (appStore.compas != appStore.EstadoSincro.compas) {
    alert(
      'Compás cambiado: ' +
        appStore.compas +
        ' - ' +
        appStore.EstadoSincro.compas,
    )
  }
  //appStore.compas = est.compas
  //appStore.golpeDelCompas = est.golpeEnCompas
  //appStore.estadoReproduccion = est.estado
}
</script>

<template>
  <div class="divRelojes">
    <h3>RELOJES</h3>
    <pre>{{ new Date(appStore.momentoRecibioInicio).toISOString() }}</pre>
    <pre>{{ appStore.sesSincroCancion }}</pre>
    -
    <pre>{{ appStore.EstadoSincro }}</pre>
    <button @click="calculoRelojes">Recalcular</button>
  </div>
</template>
<style scoped>
.divRelojes {
  position: absolute;
  left: 10%;
  top: 20%;
  font-size: 2em;
  padding: 8px;
  border-radius: 10px;
  background-color: rgba(136, 136, 136, 0.65);
  z-index: 1000;
  border: 3px solid #8b4513;
}
</style>
