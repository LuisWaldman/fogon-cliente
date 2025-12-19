<script lang="ts" setup>
import { useAppStore } from '../../stores/appStore'
import YouTube from 'vue3-youtube'
import type { Cancion } from '../../modelo/cancion/cancion'

import { ref, onMounted, watch, onUnmounted } from 'vue'
import { MediaVista } from '../../modelo/reproduccion/MediaVista'
import { Logger } from '../../modelo/logger'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const emit = defineEmits<{
  cambioEstado: [estado: number]
}>()

const urlYoutube = ref('')
const media = ref('')
const delay = ref(-1)

const shouldLoad = ref(false)
function CalcularDelay(): number {
  if (delay.value === -1) {
    const item = props.cancion.medias.find((m) => m.tipo === 'Youtube')
    if (item) {
      delay.value = item?.delay || 0
    }
  }
  return delay.value
}
watch(
  () => props.cancion,
  (newCancion: Cancion) => {
    if (newCancion && newCancion.medias) {
      for (const mediaItem of newCancion.medias) {
        if (mediaItem.tipo === 'Youtube') {
          media.value = mediaItem.id
          delay.value = mediaItem.delay || 0
          urlYoutube.value =
            'https://www.youtube.com/embed/' + media.value + '?enablejsapi=1'
          shouldLoad.value = true // Set to true to load the video
          break
        }
      }
    }
  },
)
const mediaVista = new MediaVista('YOUTUBE')

mediaVista.setGetTiempoDesdeInicio(() => {
  const time = playerRef.value?.getCurrentTime()
  return time ? time * 1000 - CalcularDelay() : 0 // Convert to milliseconds
})
mediaVista.setIniciar(() => {
  playerRef.value?.playVideo()
})
mediaVista.setGetEstado(() => {
  return playerRef.value?.getPlayerState() || -1
})
mediaVista.setPausar(() => {
  playerRef.value?.pauseVideo()
})
mediaVista.setSetTiempoDesdeInicio((numero: number) => {
  playerRef.value?.seekTo(numero / 1000, true)
})

const appStore = useAppStore()

onUnmounted(() => {
  appStore.aplicacion.reproductor.quitarMediaVista()
})

onMounted(() => {
  appStore.aplicacion.reproductor.setMediaVista(mediaVista)
  for (var i = 0; i < props.cancion.medias.length; i++) {
    Logger.log(props.cancion.medias[i])
    if (props.cancion.medias[i].tipo === 'Youtube') {
      media.value = props.cancion.medias[i].id
      urlYoutube.value =
        'https://www.youtube.com/embed/' + media.value + '?enablejsapi=1'
      break
    }
  }
})

const playerRef = ref<InstanceType<typeof YouTube> | null>(null)
function onReady() {
  //playerRef.value?.playVideo();
  Logger.log('Reproductor listo')
  mediaVista.MediaCambioEstado?.('cargado')
}
function onStateChange(event: { data: number }) {
  console.log('Estado del reproductor:', event.data)
  emit('cambioEstado', event.data)

  // Detectar cuando el video termine (estado 0)
  if (event.data === 0) {
    appStore.aplicacion.next()
  }
}
</script>

<template>
  <div v-if="urlYoutube == ''">No hay media cargada para esta canción</div>

  <YouTube
    :src="urlYoutube"
    ref="playerRef"
    @ready="onReady"
    @state-change="onStateChange"
  />
</template>
