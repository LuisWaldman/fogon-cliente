<script setup>
const props = defineProps({
  texto: {
    type: String,
    required: true,
  },
})
</script>

<template>
  {{ texto.replace('TEXTO,', '') }}
</template>
