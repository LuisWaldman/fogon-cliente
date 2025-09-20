<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()
</script>

<template>
  <div>
    <h1>Errores</h1>
    {{ appStore.errores }}
  </div>
</template>

<style scoped></style>
