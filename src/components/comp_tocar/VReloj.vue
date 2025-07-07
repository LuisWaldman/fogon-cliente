<script setup lang="ts">
defineProps<{
  fecha: Date
}>()
</script>

<template>
  <div class="divReloj">
    <div>{{ fecha.getSeconds().toString().padStart(2, '0') }}.</div>
    <div>{{ fecha.getMilliseconds().toString().padStart(3, '0') }}</div>
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
