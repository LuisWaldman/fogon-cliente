<script lang="ts" setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { MidiHelper } from '../../modelo/midi/MidiHelper'
import { Midi } from '@tonejs/midi'
import { Cancion } from '../../modelo/cancion/cancion'
import SelectInstrumento from '../SelectInstrumento.vue'
import SelectInstrumentoFogon from '../SelectInstrumentoFogon.vue'

const props = defineProps<{
  cancion: Cancion
}>()

const estadoSubida = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const midiHelper = new MidiHelper()
const objetoMidi = ref<Midi | null>(null)
const mostrarConfiguracion = ref(false)

function abrirDialogoArchivo() {
  estadoSubida.value = 'iniciando'
  fileInput.value?.click()
}

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
      objetoMidi.value = midi
      props.cancion.pentagramas = midiHelper.MidiToPentagramas(midi)
      
      // Inicializar instrumentos por defecto para cada pentagrama
      props.cancion.pentagramas.forEach((pentagrama) => {
        if (!pentagrama.instrfogon) {
          pentagrama.instrfogon = 'teclado'
        }
        if (!pentagrama.instrumento) {
          // Usar el primer instrumento MIDI disponible o un valor por defecto
          pentagrama.instrumento = pentagrama.instrumento || 'Piano'
        }
      })
      
      estadoSubida.value = 'Pentagramas cargados'
      mostrarConfiguracion.value = true
    } catch (error) {
      console.error('Error al procesar el archivo MIDI:', error)
      estadoSubida.value = 'error al procesar MIDI'
    }
  }
  reader.readAsArrayBuffer(file)

  // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
  target.value = ''
}

function actualizarInstrumentoFogon(pentagramaIndex: number, nuevoInstrumento: string) {
  if (props.cancion.pentagramas[pentagramaIndex]) {
    props.cancion.pentagramas[pentagramaIndex].instrfogon = nuevoInstrumento
  }
}

function actualizarInstrumentoMidi(pentagramaIndex: number, nuevoInstrumento: string) {
  if (props.cancion.pentagramas[pentagramaIndex]) {
    props.cancion.pentagramas[pentagramaIndex].instrumento = nuevoInstrumento
  }
}

const tienePentagramas = computed(() => 
  props.cancion.pentagramas && props.cancion.pentagramas.length > 0
)
</script>

<template>
  <div class="subir-midi-container">
    <div class="controles-principales">
      <span @click="abrirDialogoArchivo" class="btn-subir-midi">
        [Subir Midi] {{ estadoSubida }}
      </span>
      <input
        ref="fileInput"
        type="file"
        accept=".midi,.mid"
        style="display: none"
        @change="manejarSeleccionArchivo"
      />
    </div>

    <!-- Configuración de pentagramas después de cargar el MIDI -->
    <div v-if="mostrarConfiguracion && tienePentagramas" class="configuracion-pentagramas">
      <h3>Configuración de Pentagramas</h3>
      <div class="lista-pentagramas">
        <div 
          v-for="(pentagrama, index) in cancion.pentagramas" 
          :key="index"
          class="pentagrama-config"
        >
          <div class="pentagrama-header">
            <h4>Pentagrama {{ index + 1 }}</h4>
            <span class="pentagrama-nombre">{{ pentagrama.nombre || 'Sin nombre' }}</span>
          </div>
          
          <div class="selectores-instrumentos">
            <div class="selector-grupo">
              <label>Instrumento Fogón:</label>
              <SelectInstrumentoFogon 
                :modelValue="pentagrama.instrfogon || 'teclado'"
                @update:modelValue="(valor) => actualizarInstrumentoFogon(index, valor)"
              />
            </div>
            
            <div class="selector-grupo">
              <label>Instrumento MIDI:</label>
              <SelectInstrumento 
                :modelValue="pentagrama.instrumento || 'Piano'"
                @update:modelValue="(valor) => actualizarInstrumentoMidi(index, valor)"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="acciones-finales">
        <button @click="mostrarConfiguracion = false" class="btn-finalizar">
          Finalizar Configuración
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subir-midi-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.controles-principales {
  margin-bottom: 2rem;
}

.btn-subir-midi {
  display: inline-block;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.2), rgba(0, 0, 0, 0.6));
  border: 2px solid rgba(169, 168, 246, 0.5);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-subir-midi:hover {
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.3), rgba(0, 0, 0, 0.8));
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

.configuracion-pentagramas {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(44, 44, 44, 0.4));
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.configuracion-pentagramas h3 {
  color: #a9a8f6;
  margin-bottom: 1.5rem;
  text-align: center;
}

.lista-pentagramas {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pentagrama-config {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(44, 44, 44, 0.3));
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.pentagrama-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(169, 168, 246, 0.2);
}

.pentagrama-header h4 {
  color: #a9a8f6;
  margin: 0;
}

.pentagrama-nombre {
  color: #ccc;
  font-style: italic;
}

.selectores-instrumentos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.selector-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selector-grupo label {
  color: #a9a8f6;
  font-weight: 600;
  font-size: 0.9rem;
}

.acciones-finales {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(169, 168, 246, 0.2);
}

.btn-finalizar {
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.2), rgba(0, 0, 0, 0.6));
  border: 2px solid rgba(169, 168, 246, 0.5);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-finalizar:hover {
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.3), rgba(0, 0, 0, 0.8));
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .selectores-instrumentos {
    grid-template-columns: 1fr;
  }
  
  .pentagrama-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
