<script setup lang="ts">
const props = defineProps<{
  texto: string
}>()

// Usar un objeto tipado
const misProps: Record<string, string> = {}

const propEntexto = props.texto.split(',')
propEntexto.forEach((item) => {
  const [key, value] = item.split('=')
  if (key && value) {
    misProps[key.trim()] = value.trim()
  }
})
</script>

<template>
  <router-link :to="'/tocar?cancion=' + misProps['link']">
    {{ misProps['nombre'] }}
  </router-link>
</template>
