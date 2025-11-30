<script lang="ts" setup>
import { ref } from 'vue'
import JSZip from 'jszip'
import { XMLHelper, XMLReumen } from '../../modelo/pentagrama/XMLHelper'
import { useAppStore } from '../../stores/appStore'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pentagrama } from '../../modelo/cancion/pentagrama'

const props = defineProps<{
  cancion: Cancion
}>()
const estadoSubida = ref('')
const subido = ref(false)

const appStore = useAppStore()

// Variables para el modal de selección de pentagramas
const mostrarModal = ref(false)
const pentagramasTemporales = ref<Pentagrama[]>([])
const pentagramasSeleccionados = ref<Set<number>>(new Set())
const resumenXML = ref<XMLReumen>(new XMLReumen())

function toggleSeleccion(index: number) {
  if (pentagramasSeleccionados.value.has(index)) {
    pentagramasSeleccionados.value.delete(index)
  } else {
    pentagramasSeleccionados.value.add(index)
  }
}

function seleccionarTodos() {
  pentagramasTemporales.value.forEach((_, index) => {
    pentagramasSeleccionados.value.add(index)
  })
}

function deseleccionarTodos() {
  pentagramasSeleccionados.value.clear()
}

function agregarPentagramasSeleccionados() {
  const pentagramasAAgregar = pentagramasTemporales.value.filter((_, index) =>
    pentagramasSeleccionados.value.has(index),
  )

  // Reemplazar pentagramas existentes
  props.cancion.pentagramas = pentagramasAAgregar

  // Actualizar BPM y compás de la canción
  props.cancion.bpm = resumenXML.value.bpm
  props.cancion.compasCantidad = resumenXML.value.compasCantidad
  props.cancion.compasUnidad = resumenXML.value.compasDenominador

  estadoSubida.value = `${pentagramasAAgregar.length} pentagramas cargados`
  subido.value = true
  cerrarModal()
}

function cerrarModal() {
  mostrarModal.value = false
  pentagramasTemporales.value = []
  pentagramasSeleccionados.value.clear()
}

const fileInput = ref<HTMLInputElement | null>(null)
const xmlHelper = new XMLHelper()
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
      let xmlContent: string | null = null

      // Si existe container.xml, usarlo para localizar el rootfile (full-path)
      const containerName = fileNames.find((n) =>
        n.toLowerCase().endsWith('container.xml'),
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
            const otherXml = fileNames.find(
              (n) => n.toLowerCase().endsWith('.xml') && n !== containerName,
            )
            if (otherXml) xmlContent = await zip.files[otherXml].async('string')
          }
        } catch (parseErr) {
          console.warn(
            'No se pudo parsear container.xml, intentando otros .xml',
            parseErr,
          )
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

      // Extraer resumen del XML (BPM, compás)
      resumenXML.value = xmlHelper.XMLToResumen(xmlContent)

      // Convertir XML a pentagramas y mostrar modal de selección
      pentagramasTemporales.value = xmlHelper.XMLToPentagramas(xmlContent)

      // Seleccionar todos por defecto
      pentagramasTemporales.value.forEach((_, index) => {
        pentagramasSeleccionados.value.add(index)
      })

      mostrarModal.value = true
      estadoSubida.value = `${pentagramasTemporales.value.length} pentagramas encontrados`
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
  <div class="upload-container">
    <button @click="abrirDialogoArchivo" class="btn-upload">
      📁 Subir MXL
      <span v-if="estadoSubida" class="upload-status">{{ estadoSubida }}</span>
    </button>
    <input
      ref="fileInput"
      type="file"
      accept=".mxl"
      style="display: none"
      @change="manejarSeleccionArchivo"
    />
  </div>

  <!-- Modal de selección de pentagramas -->
  <div v-if="mostrarModal" class="modal-backdrop" @click="cerrarModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>🎼 Seleccionar Pentagramas</h2>
        <button class="close-btn" @click="cerrarModal" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div class="modal-body">
        <div class="form-section info-section">
          <label class="section-label">📊 Información General</label>
          <div class="info-grid">
            <div class="info-card">
              <span class="info-icon">🎵</span>
              <div class="info-content">
                <span class="info-label">Compás</span>
                <span class="info-value">
                  {{ resumenXML.compasCantidad }}/{{
                    resumenXML.compasDenominador
                  }}
                </span>
              </div>
            </div>
            <div class="info-card">
              <span class="info-icon">⏱️</span>
              <div class="info-content">
                <span class="info-label">Tempo</span>
                <span class="info-value">{{ resumenXML.bpm }} BPM</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="selection-controls">
            <button @click="seleccionarTodos" class="btn-secondary">
              ✓ Seleccionar Todos
            </button>
            <button @click="deseleccionarTodos" class="btn-secondary">
              ✗ Deseleccionar Todos
            </button>
            <span class="selection-count">
              {{ pentagramasSeleccionados.size }} de
              {{ pentagramasTemporales.length }} seleccionados
            </span>
          </div>
        </div>

        <div class="pentagramas-list">
          <div
            v-for="(pentagrama, index) in pentagramasTemporales"
            :key="index"
            class="pentagrama-item"
            :class="{ selected: pentagramasSeleccionados.has(index) }"
            @click="toggleSeleccion(index)"
          >
            <div class="pentagrama-header">
              <input
                type="checkbox"
                :checked="pentagramasSeleccionados.has(index)"
                @click.stop="toggleSeleccion(index)"
                class="pentagrama-checkbox"
              />
              <span class="pentagrama-index">Pentagrama #{{ index + 1 }}</span>
            </div>

            <div class="pentagrama-details">
              <div class="detail-row">
                <label>🎵 Nombre:</label>
                <input
                  type="text"
                  v-model="pentagrama.nombre"
                  @click.stop
                  class="form-input"
                  placeholder="Sin nombre"
                />
              </div>

              <div class="detail-row">
                <label>🎸 Instrumento:</label>
                <input
                  type="text"
                  v-model="pentagrama.instrumento"
                  @click.stop
                  class="form-input"
                  placeholder="Sin instrumento"
                />
              </div>

              <div class="detail-row">
                <label>🎹 Clave:</label>
                <span class="detail-value">{{ pentagrama.clave }}</span>
              </div>

              <div class="detail-row" v-if="pentagrama.esBeat">
                <label>🥁 Es Beat:</label>
                <span class="detail-value">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="cerrarModal" class="btn-secondary">Cancelar</button>
        <button
          @click="agregarPentagramasSeleccionados"
          class="btn-primary"
          :disabled="pentagramasSeleccionados.size === 0"
        >
          💾 Agregar Seleccionados ({{ pentagramasSeleccionados.size }})
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Upload button - matching editarLetraYAcordes style */
.upload-container {
  display: inline-block;
}

.btn-upload {
  padding: 12px 16px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 8px;
  background: rgba(169, 168, 246, 0.1);
  color: #a9a8f6;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-upload:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(169, 168, 246, 0.3);
}

.btn-upload:active {
  transform: translateY(0);
}

.upload-status {
  font-size: 0.8rem;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  color: #fff;
}

/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

/* Modal content */
.modal-content {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid #6a4c93;
  color: white;
}

/* Modal header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(106, 76, 147, 0.3);
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-radius: 14px 14px 0 0;
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #2d2825;
  padding: 4px 8px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Modal body */
.modal-body {
  padding: 24px;
}

/* Form sections */
.form-section {
  margin-bottom: 24px;
}

.info-section {
  background: linear-gradient(
    135deg,
    rgba(106, 76, 147, 0.2) 0%,
    rgba(139, 92, 246, 0.2) 100%
  );
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(106, 76, 147, 0.3);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(106, 76, 147, 0.3);
}

.info-icon {
  font-size: 2rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.85rem;
  color: #a78bfa;
  font-weight: 500;
}

.info-value {
  font-size: 1.2rem;
  color: white;
  font-weight: 700;
}

.selection-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.selection-count {
  margin-left: auto;
  color: #a78bfa;
  font-weight: 500;
}

/* Pentagramas list */
.pentagramas-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding: 4px;
}

.pentagrama-item {
  background-color: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pentagrama-item:hover {
  border-color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.1);
  transform: translateX(4px);
}

.pentagrama-item.selected {
  background: linear-gradient(
    135deg,
    rgba(106, 76, 147, 0.3) 0%,
    rgba(139, 92, 246, 0.3) 100%
  );
  border-color: #6a4c93;
  box-shadow: 0 4px 12px rgba(106, 76, 147, 0.3);
}

.pentagrama-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(106, 76, 147, 0.2);
}

.pentagrama-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #8b5cf6;
}

.pentagrama-index {
  font-weight: 600;
  font-size: 1.1rem;
  color: #a78bfa;
}

.pentagrama-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row label {
  font-size: 0.85rem;
  color: #a78bfa;
  font-weight: 500;
}

.detail-value {
  color: white;
  font-size: 0.95rem;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(106, 76, 147, 0.3);
}

/* Form inputs */
.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 6px;
  background-color: #2a2a2a;
  color: white !important;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  background-color: #333333;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Modal footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(106, 76, 147, 0.3);
  background-color: rgba(26, 26, 26, 0.5);
  border-radius: 0 0 14px 14px;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}

.btn-primary {
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(106, 76, 147, 0.4);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(106, 76, 147, 0.5);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(106, 76, 147, 0.4);
  min-width: auto;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: #6a4c93;
  transform: translateY(-1px);
}

/* Scrollbar styling */
.pentagramas-list::-webkit-scrollbar,
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.pentagramas-list::-webkit-scrollbar-track,
.modal-content::-webkit-scrollbar-track {
  background: rgba(106, 76, 147, 0.1);
  border-radius: 4px;
}

.pentagramas-list::-webkit-scrollbar-thumb,
.modal-content::-webkit-scrollbar-thumb {
  background: rgba(106, 76, 147, 0.4);
  border-radius: 4px;
}

.pentagramas-list::-webkit-scrollbar-thumb:hover,
.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(106, 76, 147, 0.6);
}

/* Responsive design */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
    max-height: calc(100vh - 40px);
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }

  .modal-header h2 {
    font-size: 1.3rem;
  }

  .pentagrama-details {
    grid-template-columns: 1fr;
  }

  .selection-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .selection-count {
    margin-left: 0;
    text-align: center;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .modal-header {
    border-radius: 0;
  }
}
</style>
