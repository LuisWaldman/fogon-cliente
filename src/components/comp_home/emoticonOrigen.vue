<script lang="ts" setup>

defineProps<{
  origen: string
}>()
</script>
<template>
  <div v-if="origen === 'sitio'">🌐</div>
  <div v-if="origen === 'server'">🔌</div>
  <div v-if="origen === 'local'">💾</div>
  <div v-if="origen === 'fogon'">🔥</div>
</template>
