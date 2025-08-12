<script lang="ts" setup>
import type { Parte } from '../../modelo/cancion/acordes'
defineProps<{
  parte: Parte
}>()
</script>
<template>
  <div>
    <span class="spnNota" v-for="(acorde, i) in parte.acordes" :key="i">{{
      acorde
    }}</span>
  </div>
</template>
<style scoped>
.spnNota {
  margin-left: 5px;
}
</style>
