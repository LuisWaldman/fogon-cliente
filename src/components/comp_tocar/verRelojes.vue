<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
const appStore = useAppStore()
</script>

<template>
  <div class="editSize">
    <h3>RELOJES</h3>
    <pre>{{ appStore.EstadoSincro }}</pre>
    <pre>{{ new Date() }}</pre>
    <pre>{{ appStore.momentoRecibioInicio }}</pre>-
    <pre>{{ appStore.sesSincroCancion }}</pre>
  </div>
</template>
