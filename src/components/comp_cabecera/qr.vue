<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const props = defineProps<{
  url: string
}>()

watch(
  () => props.url,
  () => {
    actualizarUrl()
  },
)

onMounted(() => {
  actualizarUrl()
})

function actualizarUrl() {
  if (canvasRef.value) {
    QRCode.toCanvas(
      canvasRef.value,
      props.url,
      {
        width: 300,
        color: {
          dark: '#a9a8f6',
          light: '#000',
        },
      },
      (error) => {
        if (error) console.error('Error al generar QR:', error)
      },
    )
  }
}
</script>
<template>
  <div>
    <canvas style="width: 100%; height: 100%" ref="canvasRef"></canvas>
  </div>
</template>
