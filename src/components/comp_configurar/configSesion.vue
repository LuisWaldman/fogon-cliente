<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Sesion } from '../../modelo/sesion'
import { ref, onMounted } from 'vue'

const sesiones = ref([] as Sesion[])
const newsesio = ref(new Sesion('', 0, '', 0, 0))
</script>

<template></template>

<style scoped></style>
