<script setup lang="ts">
defineProps<{
  fecha: number
}>()
</script>

<template>
  <div class="divReloj">
    <div>{{ Math.floor(fecha / 60000) }}m</div>
    <div>{{ Math.floor((fecha % 60000) / 1000) }}s</div>
    <div>{{ Math.floor(fecha % 1000) }}ms</div>
  </div>
</template>

<style scoped>
.divReloj {
  display: flex;
  border-radius: 10px;
  background-color: rgba(136, 136, 136, 0.65);
  border: 3px solid #8b4513;
}
</style>
