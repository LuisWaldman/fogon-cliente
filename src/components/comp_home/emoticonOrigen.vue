<script lang="ts" setup>
defineProps<{
  origen: string
}>()
</script>
<template>
  <span v-if="origen === 'subida'">⬆️</span>
  <span v-if="origen === 'sitio'">🌐</span>
  <span v-if="origen === 'server'">🗄️</span>
  <span v-if="origen === 'local'">🧠</span>
  <span v-if="origen === 'fogon'">🔥</span>
</template>
