<script setup>
const props = defineProps({
  texto: {
    type: String,
    required: true,
  },
})

const propEntexto = props.texto.split(',')
var misProps = []
propEntexto.forEach((item) => {
  const [key, value] = item.split('=')
  misProps[key] = value
})
</script>

<template>
  <router-link :to="'/tocar?cancion=' + misProps['link']">
    {{ misProps['nombre'] }}
  </router-link>
</template>
