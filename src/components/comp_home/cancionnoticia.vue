<script setup>
const props = defineProps({
  texto: {
    type: String,
    required: true,
  },
})

const prop_entexto = props.texto.split(',')
var misProps = []
prop_entexto.forEach((item) => {
  const [key, value] = item.split('=')
  misProps[key] = value
})
</script>

<template>
  <router-link :to="'/tocar?cancion=' + misProps['link']">
    {{ misProps['nombre'] }}
  </router-link>
</template>
