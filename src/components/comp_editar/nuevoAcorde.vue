<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['cerrar', 'agregar'])

// Notas fundamentales
const notasFundamentales = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
]

// Tipos base de acordes
const tiposBase = [
  { label: 'Maj', value: '' },
  { label: 'Min', value: 'm' },
  { label: 'Sus2', value: 'sus2' },
  { label: 'Sus4', value: 'sus4' },
]

// Extensiones
const extensiones = [
  { label: '5', value: '5' },
  { label: 'Aug', value: 'aug' },
  { label: 'Dim', value: 'dim' },
  { label: 'b5', value: 'b5' },
  { label: '#5', value: '#5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: 'maj7', value: 'maj7' },
  { label: 'b9', value: 'b9' },
  { label: '9', value: '9' },
  { label: '#9', value: '#9' },
  { label: '11', value: '11' },
  { label: '#11', value: '#11' },
  { label: 'b13', value: 'b13' },
  { label: '13', value: '13' },
]

// Estados reactivos
const notaFundamental = ref('C')
const notaBajo = ref('None')
const tipoSeleccionado = ref('')
const extensionesSeleccionadas = ref(new Set<string>())

function construirAcorde(): string {
  let acorde = notaFundamental.value

  // Agregar tipo base
  acorde += tipoSeleccionado.value

  // Agregar extensiones
  const extensionesArray = Array.from(extensionesSeleccionadas.value).sort()
  acorde += extensionesArray.join('')

  // Agregar nota del bajo si es diferente de None
  if (notaBajo.value !== 'None') {
    acorde += '/' + notaBajo.value
  }

  return acorde
}

function toggleTipo(tipo: string) {
  if (tipoSeleccionado.value === tipo) {
    tipoSeleccionado.value = ''
  } else {
    tipoSeleccionado.value = tipo
  }
}

function toggleExtension(extension: string) {
  if (extensionesSeleccionadas.value.has(extension)) {
    extensionesSeleccionadas.value.delete(extension)
  } else {
    extensionesSeleccionadas.value.add(extension)
  }
}

function guardarAcorde() {
  const acordeCompleto = construirAcorde()
  emit('agregar', acordeCompleto)
}
</script>

<template>
  <div class="modal-backdrop" @click="emit('cerrar')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>🎵 Agregar Acorde</h2>
        <button class="close-btn" @click="emit('cerrar')" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div class="modal-body">
        <!-- Nota fundamental -->
        <div class="form-section">
          <div class="input-group">
            <label>🎵 Nota fundamental</label>
            <select v-model="notaFundamental" class="">
              <option
                v-for="nota in notasFundamentales"
                :key="nota"
                :value="nota"
              >
                {{ nota }}
              </option>
            </select>
          </div>
        </div>

        <!-- Tipos base -->
        <div class="form-section">
          <label class="section-label">🎶 Tipo Base</label>
          <div class="option-grid-compact">
            <button
              v-for="tipo in tiposBase"
              :key="tipo.value"
              type="button"
              class="option-btn-compact"
              :class="{ selected: tipoSeleccionado === tipo.value }"
              @click="toggleTipo(tipo.value)"
            >
              {{ tipo.label }}
            </button>
          </div>
        </div>

        <!-- Extensiones -->
        <div class="form-section">
          <label class="section-label">🎯 Extensiones</label>
          <div class="option-grid-extensions">
            <button
              v-for="extension in extensiones"
              :key="extension.value"
              type="button"
              class="option-btn-compact"
              :class="{
                selected: extensionesSeleccionadas.has(extension.value),
              }"
              @click="toggleExtension(extension.value)"
            >
              {{ extension.label }}
            </button>
          </div>
        </div>

        <!-- Nota del bajo -->
        <div class="form-section">
          <div class="input-group">
            <label>🎼 Nota del bajo</label>
            <select v-model="notaBajo" class="">
              <option value="None"></option>
              <option
                v-for="nota in notasFundamentales"
                :key="nota"
                :value="nota"
              >
                {{ nota }}
              </option>
            </select>
          </div>
        </div>

        <!-- Vista previa del acorde -->
        <div class="form-section">
          <div class="chord-preview">
            <label class="section-label">🎼 Vista Previa</label>
            <div class="chord-display">{{ construirAcorde() }}</div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="emit('cerrar')" class="btn-secondary">Cancelar</button>
        <button @click="guardarAcorde()" class="btn-primary">➕ Agregar</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
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
  max-width: 480px;
  max-height: 95vh;
  overflow-y: auto;
  border: 2px solid #6a4c93;
  color: white;
}

/* Modal header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
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
  padding: 16px;
}

/* Form sections */
.form-section {
  margin-bottom: 16px;
}

.section-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #a78bfa;
}

/* Input groups */
.input-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group label {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #a78bfa;
}

.input-row {
  display: flex;
  gap: 16px;
  width: 100%;
}

.input-group.half {
  flex: 1;
  min-width: 0;
}

/* Form inputs */
.form-input,
.form-select {
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 6px;
  background-color: #2a2a2a;
  color: white !important;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-select {
  cursor: pointer;
  color: #ffffff !important;
  background-color: #2a2a2a !important;
  font-weight: 500 !important;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #8b5cf6;
  background-color: #333333 !important;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  color: #ffffff !important;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Select dropdown styling - Minimal styles for better visibility */
.form-select option {
  background-color: #2a2a2a !important;
  color: #ffffff !important;
  padding: 8px 12px;
}

.form-select option:hover {
  background-color: #6a4c93 !important;
}

.form-select option:checked,
.form-select option:selected {
  background-color: #8b5cf6 !important;
  font-weight: 600;
}

/* Styled selects to match Escala */
.simple-select {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
  background-repeat: no-repeat !important;
  background-position: right 12px center !important;
  background-size: 16px !important;
  padding: 12px 16px !important;
  padding-right: 40px !important;
  min-height: 48px !important;
  background-color: #2a2a2a !important;
  color: white !important;
  border: 2px solid rgba(106, 76, 147, 0.4) !important;
  border-radius: 8px !important;
  font-size: 1rem !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
}

.simple-select:focus {
  background-color: #333333 !important;
  color: white !important;
  border-color: #8b5cf6 !important;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2) !important;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
}

/* Chord preview */
.chord-preview {
  text-align: center;
  margin-bottom: 16px;
}

.chord-display {
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: bold;
  min-height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(106, 76, 147, 0.6);
  box-shadow: 0 4px 12px rgba(106, 76, 147, 0.4);
  margin-top: 6px;
}

/* Option grid */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.option-grid-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 4px;
}

.option-grid-extensions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 4px;
}

.option-btn {
  padding: 10px 16px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.option-btn-compact {
  padding: 6px 8px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-btn:hover,
.option-btn-compact:hover {
  border-color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.1);
  transform: translateY(-1px);
}

.option-btn.selected,
.option-btn-compact.selected {
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-color: #6a4c93;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(106, 76, 147, 0.4);
}

/* Modal footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid rgba(106, 76, 147, 0.3);
  background-color: rgba(26, 26, 26, 0.5);
  border-radius: 0 0 14px 14px;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn-primary {
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(106, 76, 147, 0.4);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(106, 76, 147, 0.5);
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(106, 76, 147, 0.4);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: #6a4c93;
  transform: translateY(-1px);
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

  .input-row {
    flex-direction: column;
    gap: 0;
  }

  .input-group.half {
    margin-bottom: 16px;
  }

  .option-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 6px;
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

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(106, 76, 147, 0.1);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(106, 76, 147, 0.4);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(106, 76, 147, 0.6);
}
</style>
