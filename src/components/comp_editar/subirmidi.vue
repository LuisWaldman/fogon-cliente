<script lang="ts" setup>
import { ref } from 'vue'
import { MidiHelper } from '../../modelo/midi/MidiHelper'
import { Midi } from '@tonejs/midi'
import { Pentagrama } from '../../modelo/cancion/pentagrama'
import { Cancion } from '../../modelo/cancion/cancion'
defineProps<{
  cancion: Cancion
}>()
const estadoSubida = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const pentagramas = ref<Pentagrama[]>([])
const midiHelper = new MidiHelper()
function abrirDialogoArchivo() {
  estadoSubida.value = 'iniciando'
  fileInput.value?.click()
}

const objetoMidi = ref<Midi | null>(null)
function manejarSeleccionArchivo(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Verificar que sea un archivo MIDI
  if (
    !file.name.toLowerCase().endsWith('.midi') &&
    !file.name.toLowerCase().endsWith('.mid')
  ) {
    alert('Por favor selecciona un archivo MIDI válido')
    estadoSubida.value = 'error extension archivo'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const midi = new Midi(arrayBuffer)

      estadoSubida.value = 'MIDI Ok'
      // Podés guardar el objeto midi en un ref o estado global si lo necesitás
      objetoMidi.value = midi
      pentagramas.value = midiHelper.MidiToPentagramas(midi)
      estadoSubida.value = 'Pentagramas cargados'
    } catch (error) {
      console.error('Error al procesar el archivo MIDI:', error)
      estadoSubida.value = 'error al procesar MIDI'
    }
  }
  reader.readAsArrayBuffer(file)

  // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
  target.value = ''
}
</script>

<template>
  <span @click="abrirDialogoArchivo">[Subir Midi] {{ estadoSubida }}</span>
  <input
    ref="fileInput"
    type="file"
    accept=".midi,.mid"
    style="display: none"
    @change="manejarSeleccionArchivo"
  />

  <div v-if="pentagramas.length > 0">
    {{ pentagramas }}
  </div>
</template>
<style scoped></style>
