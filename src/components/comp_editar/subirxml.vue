<script lang="ts" setup>
import { ref } from 'vue'
import JSZip from 'jszip'
import { MidiHelper } from '../../modelo/midi/MidiHelper'
import { Cancion } from '../../modelo/cancion/cancion'
const props = defineProps<{
  cancion: Cancion
}>()
const estadoSubida = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const midiHelper = new MidiHelper()
function abrirDialogoArchivo() {
  estadoSubida.value = 'iniciando'
  fileInput.value?.click()
}

const objetoMxl = ref<string | null>(null)
async function manejarSeleccionArchivo(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Verificar que sea un archivo MXL
  if (!file.name.toLowerCase().endsWith('.mxl')) {
    alert('Por favor selecciona un archivo .mxl válido')
    estadoSubida.value = 'error: extensión de archivo'
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const arrayBuffer = e.target?.result as ArrayBuffer

      // Descomprimir .mxl (es un ZIP que contiene el MusicXML .xml)
      const zip = await JSZip.loadAsync(arrayBuffer)
      const fileNames = Object.keys(zip.files)
      console.log('Entradas del ZIP:', fileNames)

      let xmlContent: string | null = null

      // Si existe container.xml, usarlo para localizar el rootfile (full-path)
      const containerName = fileNames.find((n) =>
        n.toLowerCase().endsWith('container.xml')
      )

      if (containerName) {
        const containerXml = await zip.files[containerName].async('string')
        // parsear para obtener rootfile/@full-path
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(containerXml, 'application/xml')
          const rootfile = doc.querySelector('rootfile')
          const fullPath = rootfile?.getAttribute('full-path') || ''

          if (fullPath && zip.files[fullPath]) {
            xmlContent = await zip.files[fullPath].async('string')
          } else {
            // fallback: buscar cualquier otro .xml distinto a container.xml
            const otherXml = fileNames.find((n) =>
              n.toLowerCase().endsWith('.xml') && n !== containerName
            )
            if (otherXml) xmlContent = await zip.files[otherXml].async('string')
          }
        } catch (parseErr) {
          console.warn('No se pudo parsear container.xml, intentando otros .xml', parseErr)
        }
      } else {
        // Sin container.xml, tomar el primer .xml disponible
        const anyXml = fileNames.find((n) => n.toLowerCase().endsWith('.xml'))
        if (anyXml) xmlContent = await zip.files[anyXml].async('string')
      }

      if (!xmlContent) {
        estadoSubida.value = 'error: no se encontró archivo MusicXML en .mxl'
        return
      }

      estadoSubida.value = 'MXL descomprimido'
      objetoMxl.value = xmlContent
      console.log(xmlContent)

      // ...seguir con la conversión a pentagramas...
    } catch (error) {
      console.error('Error al procesar el archivo MXL:', error)
      estadoSubida.value = 'error al procesar MXL'
    }
  }
  reader.readAsArrayBuffer(file)

  // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
  target.value = ''
}
</script>

<template>
  <span @click="abrirDialogoArchivo">[Subir MXL] {{ estadoSubida }}</span>
  <input
    ref="fileInput"
    type="file"
    accept=".mxl"
    style="display: none"
    @change="manejarSeleccionArchivo"
  />
  {{ objetoMxl }}
</template>
<style scoped></style>
