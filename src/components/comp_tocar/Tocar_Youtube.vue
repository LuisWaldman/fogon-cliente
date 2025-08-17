// Componente.vue

<script lang="ts" setup>
import YouTube from 'vue3-youtube'
import type { Cancion } from '../../modelo/cancion/cancion'

import { ref, onMounted, watch } from 'vue'
const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const emit = defineEmits<{
  cambioEstado: [estado: number]
}>()

const urlYoutube = ref('')
const media = ref('dQw4w9WgXcQ')

const shouldLoad = ref(false)
watch(
  () => props.cancion,
  (newCancion: Cancion) => {
    if (newCancion && newCancion.medias) {
      for (const mediaItem of newCancion.medias) {
        if (mediaItem.tipo === 'Youtube') {
          media.value = mediaItem.id
          urlYoutube.value = 'https://www.youtube.com/watch?v=' + media.value
          shouldLoad.value = true // Set to true to load the video
          break
        }
      }
    }
  },
)

onMounted(() => {
  for (var i = 0; i < props.cancion.medias.length; i++) {
    console.log(props.cancion.medias[i])
    if (props.cancion.medias[i].tipo === 'Youtube') {
      media.value = props.cancion.medias[i].id
      urlYoutube.value = 'https://www.youtube.com/watch?v=' + media.value
      break
    }
  }
})

const playerRef = ref<any>(null)
function onReady() {
  //playerRef.value?.playVideo();
}
function onStateChange(event: any) {
  console.log('Estado del reproductor:', event.data)
  emit('cambioEstado', event.data)
}
</script>

<template>
  {{ urlYoutube }}
  <YouTube
    v-if="shouldLoad"
    :src="urlYoutube"
    ref="playerRef"
    @ready="onReady"
    @state-change="onStateChange"
  />
</template>
