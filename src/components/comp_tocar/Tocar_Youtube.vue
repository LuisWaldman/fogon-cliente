<script lang="ts" setup>
import { useAppStore } from '../../stores/appStore'
import YouTube from 'vue3-youtube'
import type { Cancion } from '../../modelo/cancion/cancion'

import { ref, onMounted, watch, onUnmounted } from 'vue'
import { MediaVista } from '../../modelo/reproduccion/MediaVista'
const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const emit = defineEmits<{
  cambioEstado: [estado: number]
}>()

const urlYoutube = ref('')
const media = ref('dQw4w9WgXcQ')
const delay = ref(0)

const shouldLoad = ref(false)
watch(
  () => props.cancion,
  (newCancion: Cancion) => {
    if (newCancion && newCancion.medias) {
      for (const mediaItem of newCancion.medias) {
        if (mediaItem.tipo === 'Youtube') {
          media.value = mediaItem.id
          delay.value = mediaItem.delay || 0
          urlYoutube.value = 'https://www.youtube.com/watch?v=' + media.value
          shouldLoad.value = true // Set to true to load the video
          break
        }
      }
    }
  },
)
const mediaVista = new MediaVista()
mediaVista.setGetTiempoDesdeInicio(() => {
  const time = playerRef.value.getCurrentTime()
  return time * 1000 - delay.value // Convert to milliseconds
})
mediaVista.setIniciar(() => {
  playerRef.value.playVideo()
})
mediaVista.setPausar(() => {
  playerRef.value.pauseVideo()
})

onUnmounted(() => {
  const appStore = useAppStore()
  appStore.aplicacion.quitarMediaVista()
})

onMounted(() => {
  const appStore = useAppStore()
  appStore.aplicacion.setMediaVista(mediaVista)
  for (var i = 0; i < props.cancion.medias.length; i++) {
    console.log(props.cancion.medias[i])
    if (props.cancion.medias[i].tipo === 'Youtube') {
      media.value = props.cancion.medias[i].id
      urlYoutube.value = 'https://www.youtube.com/watch?v=' + media.value
      break
    }
  }
})

const playerRef = ref<InstanceType<typeof YouTube> | null>(null)
function onReady() {
  //playerRef.value?.playVideo();
}
function onStateChange(event: { data: number }) {
  console.log('Estado del reproductor:', event.data)
  emit('cambioEstado', event.data)
}
</script>

<template>
  <div v-if="urlYoutube == ''">No hay media cargada para esta canción</div>
  <YouTube
    v-if="shouldLoad"
    :src="urlYoutube"
    ref="playerRef"
    @ready="onReady"
    @state-change="onStateChange"
  />
</template>
