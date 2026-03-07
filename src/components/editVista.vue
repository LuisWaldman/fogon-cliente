<script setup lang="ts">
import { ref, watch } from 'vue'
import { Configuracion, VistaTocar } from '../modelo/configuracion'
import { Pantalla } from '../modelo/pantalla'

const exvistapantalla = ref(new VistaTocar())
const emit = defineEmits(['cerrar'])

const pantalla = new Pantalla()
const config = Configuracion.getInstance()
const configPantalla = ref(pantalla.getConfiguracionPantalla())
const verLetra = ref(
  configPantalla.value.muestra === 'letrayacordes' ||
    configPantalla.value.muestra === 'karaoke',
)
const verAcordes = ref(
  configPantalla.value.muestra === 'acordes' ||
    configPantalla.value.muestra === 'letrayacordes',
)
const verPartitura = ref(configPantalla.value.muestra === 'partitura')
const soloVideo = ref(configPantalla.value.reproduce === 'video')
const soloMidi = ref(configPantalla.value.reproduce === 'midi')

exvistapantalla.value.altoPantallaDescuento =
  configPantalla.value.altoPantallaDescuento
exvistapantalla.value.anchoPrincipal = configPantalla.value.anchoPrincipal
exvistapantalla.value.tamanioAcorde = configPantalla.value.tamanioAcorde
exvistapantalla.value.tamanioAcordesolo = configPantalla.value.tamanioAcordesolo
exvistapantalla.value.tamanioLetra = configPantalla.value.tamanioLetra
exvistapantalla.value.tamanioParte = configPantalla.value.tamanioParte
exvistapantalla.value.tamanioAcordeParte =
  configPantalla.value.tamanioAcordeParte
exvistapantalla.value.columnas = configPantalla.value.columnas
// Inicializar propiedades de pentagrama
exvistapantalla.value.compasesPorRenglon =
  configPantalla.value.compasesPorRenglon || 4
exvistapantalla.value.anchoCompas = configPantalla.value.anchoCompas || 200
exvistapantalla.value.altoCompas = configPantalla.value.altoCompas || 50
exvistapantalla.value.escalaPentagrama =
  configPantalla.value.escalaPentagrama || 0.6

function guardarConfiguracionPantalla() {
  config.guardarEnLocalStorage()
  emit('cerrar')
}
const refModoVista = ref(configPantalla.value.modo)
function ClickSetModoVista(modo: string) {
  refModoVista.value = modo
  configPantalla.value.modo = modo
}

watch(configPantalla.value, () => {
  pantalla.setearEstilos()
})

// Watch for changes in reproduce to update solo buttons
watch(
  () => configPantalla.value.reproduce,
  (newValue) => {
    soloVideo.value = newValue === 'video'
    soloMidi.value = newValue === 'midi'
  },
)

function actualizarModoMostrar() {
  if (verPartitura.value) {
    configPantalla.value.muestra = 'partitura'
  } else {
    if (verLetra.value && verAcordes.value) {
      configPantalla.value.muestra = 'letrayacordes'
    } else if (verLetra.value && !verAcordes.value) {
      configPantalla.value.muestra = 'karaoke'
    } else if (!verLetra.value && verAcordes.value) {
      configPantalla.value.muestra = 'acordes'
    } else {
      // Default to letra
      configPantalla.value.muestra = 'karaoke'
      verLetra.value = true
    }
  }
}

function ClickViendoLetra() {
  verLetra.value = !verLetra.value
  if (!verPartitura.value && !verAcordes.value && !verLetra.value) {
    // At least one must be selected
    verLetra.value = true
  }
  actualizarModoMostrar()
}

function ClickViendoAcordes() {
  verAcordes.value = !verAcordes.value
  if (!verPartitura.value && !verAcordes.value && !verLetra.value) {
    // At least one must be selected
    verLetra.value = true
  }
  actualizarModoMostrar()
}
function ClickViendoPartitura() {
  verPartitura.value = !verPartitura.value
  if (!verPartitura.value && !verAcordes.value && !verLetra.value) {
    // At least one must be selected
    verLetra.value = true
  }
  actualizarModoMostrar()
}

// Solo Sincro functions
function ClickSoloVideo() {
  if (soloVideo.value) {
    // If already selected, deselect
    soloVideo.value = false
    configPantalla.value.reproduce = 'nada'
  } else {
    // Select video and deselect MIDI
    soloVideo.value = true
    soloMidi.value = false
    configPantalla.value.reproduce = 'video'
  }
}

function ClickSoloMidi() {
  if (soloMidi.value) {
    // If already selected, deselect
    soloMidi.value = false
    configPantalla.value.reproduce = 'nada'
  } else {
    // Select MIDI and deselect video
    soloMidi.value = true
    soloVideo.value = false
    configPantalla.value.reproduce = 'midi'
  }
}

// Opciones de cada combo con valores reales
const opcionesCompasesPorRenglon = [
  { valor: 1, label: '1 compás' },
  { valor: 2, label: '2 compases' },
  { valor: 3, label: '3 compases' },
  { valor: 4, label: '4 compases' },
  { valor: 5, label: '5 compases' },
  { valor: 6, label: '6 compases' },
]

const opcionesEscalaPentagrama = [
  { valor: 0.4, label: '0.4' },
  { valor: 0.6, label: '0.6' },
  { valor: 0.8, label: '0.8' },
  { valor: 1.0, label: '1.0' },
  { valor: 1.4, label: '1.4' },
  { valor: 2, label: '2' },
]

const opcionesLetra = [
  { valor: 8,   label: 'Muy chico' },
  { valor: 16,  label: 'Chico' },
  { valor: 24,  label: 'Normal' },
  { valor: 32, label: 'Grande' },
  { valor: 40, label: 'Muy grande' },
  { valor: 66, label: 'Enorme' },
]

const opcionesAcorde = [
  { valor: 8,  label: 'Muy chico' },
  { valor: 16, label: 'Chico' },
  { valor: 24, label: 'Normal' },
  { valor: 32, label: 'Grande' },
  { valor: 40, label: 'Muy grande' },
  { valor: 66, label: 'Enorme' },
]

const opcionesAnchoCompas = [
  { valor: 160, label: 'Muy chico' },
  { valor: 208, label: 'Chico' },
  { valor: 256, label: 'Normal' },
  { valor: 304, label: 'Grande' },
  { valor: 352, label: 'Muy grande' },
  { valor: 400, label: 'Enorme' },
]

const opcionesAltoCompas = [
  { valor: 12,  label: 'Muy chico' },
  { valor: 34,  label: 'Chico' },
  { valor: 55,  label: 'Normal' },
  { valor: 77,  label: 'Grande' },
  { valor: 98,  label: 'Muy grande' },
  { valor: 120, label: 'Enorme' },
]

const opcionesAltoReproductor = [
  { valor: 3,    label: 'Muy chico' },
  { valor: 202,  label: 'Chico' },
  { valor: 402,  label: 'Normal' },
  { valor: 601,  label: 'Grande' },
  { valor: 801,  label: 'Muy grande' },
  { valor: 1000, label: 'Enorme' },
]

const opcionesAnchoPrincipal = [
  { valor: 3,  label: 'Muy chico' },
  { valor: 22, label: 'Chico' },
  { valor: 41, label: 'Normal' },
  { valor: 60, label: 'Grande' },
  { valor: 79, label: 'Muy grande' },
  { valor: 98, label: 'Enorme' },
]

const opcionesAnchoTerciaria = [
  { valor: 3,  label: 'Muy chico' },
  { valor: 22, label: 'Chico' },
  { valor: 41, label: 'Normal' },
  { valor: 60, label: 'Grande' },
  { valor: 79, label: 'Muy grande' },
  { valor: 98, label: 'Enorme' },
]

const opcionesTamanioParte = [
  { valor: 8,  label: 'Muy chico' },
  { valor: 14, label: 'Chico' },
  { valor: 21, label: 'Normal' },
  { valor: 27, label: 'Grande' },
  { valor: 34, label: 'Muy grande' },
  { valor: 40, label: 'Enorme' },
]

const opcionesAnchoParte = [
  { valor: 0,    label: 'Muy chico' },
  { valor: 200,  label: 'Chico' },
  { valor: 400,  label: 'Normal' },
  { valor: 600,  label: 'Grande' },
  { valor: 800,  label: 'Muy grande' },
  { valor: 1000, label: 'Enorme' },
]

function handleSelectChange(
  event: Event,
  propiedad: keyof typeof configPantalla.value,
) {
  const val = Number((event.target as HTMLSelectElement).value)
  ;(configPantalla.value as any)[propiedad] = val
}
</script>

<template>
  <div class="modal-backdrop" @click="emit('cerrar')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>⚙️ Configuración de Vista</h2>
        <button class="close-btn" @click="emit('cerrar')" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div class="modal-body">
        <div class="form-section">
          <label class="section-label">👁️‍🗨️ Vista</label>
          <div class="option-grid">
            <div
              class="option-btn"
              :class="{ selected: verLetra }"
              @click="ClickViendoLetra()"
            >
              📝 LETRA
            </div>
            <div
              class="option-btn"
              :class="{ selected: verAcordes }"
              @click="ClickViendoAcordes()"
            >
              🎸 ACORDES
            </div>
            <div
              class="option-btn"
              :class="{ selected: verPartitura }"
              @click="ClickViendoPartitura()"
            >
              🎼 PARTITURA
            </div>
          </div>

          <div v-if="verLetra" class="input-group">
            <label>📏 Tamaño Letra</label>
            <div class="range-group">
              <select
                :value="configPantalla.tamanioLetra"
                @change="handleSelectChange($event, 'tamanioLetra')"
                class="select-input"
              >
                <option v-for="opt in opcionesLetra" :key="opt.valor" :value="opt.valor">{{ opt.label }}</option>
              </select>
              <span class="range-value"
                >{{ configPantalla.tamanioLetra }}px</span
              >
            </div>
          </div>

          <div v-if="verAcordes" class="input-group">
            <label>📏 Tamaño Acordes</label>
            <div class="range-group">
              <select
                :value="configPantalla.tamanioAcorde"
                @change="handleSelectChange($event, 'tamanioAcorde')"
                class="select-input"
              >
                <option v-for="opt in opcionesAcorde" :key="opt.valor" :value="opt.valor">{{ opt.label }}</option>
              </select>
              <span class="range-value"
                >{{ configPantalla.tamanioAcorde }}px</span
              >
            </div>
          </div>

          <div v-if="verPartitura" class="form-section partitura-section">
            <label class="section-label">🎼 Configuración de Partitura</label>
            <div class="input-row">
              <div class="input-group half">
                <label>📊 Compases x Sistema</label>
                <div class="range-group">
                  <select
                    :value="configPantalla.compasesPorRenglon"
                    @change="handleSelectChange($event, 'compasesPorRenglon')"
                    class="select-input"
                  >
                    <option
                      v-for="opcion in opcionesCompasesPorRenglon"
                      :key="opcion.valor"
                      :value="opcion.valor"
                    >
                      {{ opcion.label }}
                    </option>
                  </select>
                  <span class="range-value">{{
                    configPantalla.compasesPorRenglon
                  }}</span>
                </div>
              </div>
              <div class="input-group half">
                <label>📐 Ancho Compás</label>
                <div class="range-group">
                  <select
                    :value="configPantalla.anchoCompas"
                    @change="handleSelectChange($event, 'anchoCompas')"
                    class="select-input"
                  >
                    <option v-for="opt in opcionesAnchoCompas" :key="opt.valor" :value="opt.valor">{{ opt.label }}</option>
                  </select>
                  <span class="range-value"
                    >{{ configPantalla.anchoCompas }}px</span
                  >
                </div>
              </div>
            </div>
            <div class="input-row">
              <div class="input-group half">
                <label>📏 Alto Pentagrama</label>
                <div class="range-group">
                  <select
                    :value="configPantalla.altoCompas"
                    @change="handleSelectChange($event, 'altoCompas')"
                    class="select-input"
                  >
                    <option v-for="opt in opcionesAltoCompas" :key="opt.valor" :value="opt.valor">{{ opt.label }}</option>
                  </select>
                  <span class="range-value"
                    >{{ configPantalla.altoCompas }}px</span
                  >
                </div>
              </div>
              <div class="input-group half">
                <label>🔍 Escala Líneas</label>
                <div class="range-group">
                  <select
                    :value="configPantalla.escalaPentagrama"
                    @change="handleSelectChange($event, 'escalaPentagrama')"
                    class="select-input"
                  >
                    <option
                      v-for="opcion in opcionesEscalaPentagrama"
                      :key="opcion.valor"
                      :value="opcion.valor"
                    >
                      {{ opcion.label }}
                    </option>
                  </select>
                  <span class="range-value">{{
                    configPantalla.escalaPentagrama.toFixed(1)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-section">
          <label class="section-label">▶️ Reproducción</label>
          <div class="option-grid">
            <button
              type="button"
              class="option-btn"
              :class="{ selected: soloVideo }"
              @click="ClickSoloVideo()"
            >
              🎬 VIDEO
            </button>
            <button
              type="button"
              class="option-btn"
              :class="{ selected: soloMidi }"
              @click="ClickSoloMidi()"
            >
              🎹 MIDI
            </button>
          </div>

          <div v-if="soloMidi || soloVideo" class="input-group">
            <label>📏 Alto Reproductor</label>
            <div class="range-group">
              <select
                :value="configPantalla.altoReproductor"
                @change="handleSelectChange($event, 'altoReproductor')"
                class="select-input"
              >
                <option v-for="opt in opcionesAltoReproductor" :key="opt.valor" :value="opt.valor">{{ opt.label }}</option>
              </select>
              <span class="range-value"
                >{{ configPantalla.altoReproductor }}px</span
              >
            </div>
          </div>
        </div>

        <div
          class="form-section"
          v-if="
            configPantalla.muestra !== 'cuadrado' &&
            configPantalla.muestra !== ''
          "
        >
          <div class="checkbox-grid">
            <label class="checkbox-item">
              <input type="checkbox" v-model="configPantalla.AutoScroll" />
              <span class="checkmark"></span>
              📜 Auto Scroll
            </label>
          </div>
        </div>

        <div
          class="form-section"
          v-if="configPantalla.muestra === 'letrayacordes'"
        >
          <!-- 
          <div class="input-group">
            <label>📏 Caracteres por renglón</label>
            <div class="range-group">
              <input
                type="range"
                min="10"
                max="120"
                v-model.number="configPantalla.columnas"
                class="range-input"
              />
              <span class="range-value">{{ configPantalla.columnas }}</span>
            </div>
          </div>-->
        </div>
        <div class="form-section">
          <label class="section-label">📱 Modo de Vista</label>
          <div class="option-grid">
            <button
              type="button"
              class="option-btn layout-btn"
              :class="{ selected: refModoVista === 'simple' }"
              @click="ClickSetModoVista('simple')"
            >
              <span class="layout-icon">│</span>
              Simple
            </button>
            <button
              type="button"
              class="option-btn layout-btn"
              :class="{ selected: refModoVista === 'doble' }"
              @click="ClickSetModoVista('doble')"
            >
              <span class="layout-icon">│ │</span>
              Doble
            </button>
            <button
              type="button"
              class="option-btn layout-btn"
              :class="{ selected: refModoVista === 'triple' }"
              @click="ClickSetModoVista('triple')"
            >
              <span class="layout-icon">│ │ │</span>
              Triple
            </button>
            <button
              type="button"
              class="option-btn"
              :class="{ selected: configPantalla.invertido }"
              @click="configPantalla.invertido = !configPantalla.invertido"
            >
              ↩️ Invertido
            </button>
          </div>
        </div>
        <div class="form-section">
          <div class="input-group">
            <label v-if="refModoVista !== 'simple'">📐 % Ancho Principal</label>
            <label v-if="refModoVista === 'simple'">📐 % Alto Principal</label>
            <div class="range-group">
              <select
                :value="configPantalla.anchoPrincipal"
                @change="handleSelectChange($event, 'anchoPrincipal')"
                class="select-input"
              >
                <option v-for="opt in opcionesAnchoPrincipal" :key="opt.valor" :value="opt.valor">{{ opt.label }}</option>
              </select>
              <span class="range-value"
                >{{ configPantalla.anchoPrincipal }}%</span
              >
            </div>
          </div>

          <div class="input-group" v-if="refModoVista === 'triple'">
            <label>📐 % Ancho Terciaria</label>
            <div class="range-group">
              <select
                :value="configPantalla.anchoTerciaria"
                @change="handleSelectChange($event, 'anchoTerciaria')"
                class="select-input"
              >
                <option v-for="opt in opcionesAnchoTerciaria" :key="opt.valor" :value="opt.valor">{{ opt.label }}</option>
              </select>
              <span class="range-value"
                >{{ configPantalla.anchoTerciaria }}%</span
              >
            </div>
          </div>
        </div>

        <div class="form-section">
          <label class="section-label">📋 Segunda Columna</label>
          <div class="option-grid">
            <button
              type="button"
              class="option-btn"
              :class="{ selected: configPantalla.viendoSecuencia }"
              @click="
                configPantalla.viendoSecuencia = !configPantalla.viendoSecuencia
              "
            >
              🎵 Secuencia
            </button>
            <button
              type="button"
              class="option-btn"
              :class="{ selected: configPantalla.viendoInstrucciones }"
              @click="
                configPantalla.viendoInstrucciones =
                  !configPantalla.viendoInstrucciones
              "
            >
              📖 Instrucciones
            </button>
            <button
              type="button"
              class="option-btn"
              :class="{ selected: configPantalla.viendoCuadrado }"
              @click="
                configPantalla.viendoCuadrado = !configPantalla.viendoCuadrado
              "
            >
              ⬜ Cuadrado
            </button>
          </div>
        </div>

        <div class="form-section" v-if="refModoVista === 'triple'">
          <label class="section-label">📋 Tercera Columna</label>
          <div class="option-grid">
            <button
              type="button"
              class="option-btn"
              :class="{ selected: configPantalla.viendoSecuencia3 }"
              @click="
                configPantalla.viendoSecuencia3 =
                  !configPantalla.viendoSecuencia3
              "
            >
              🎵 Secuencia
            </button>
            <button
              type="button"
              class="option-btn"
              :class="{ selected: configPantalla.viendoInstrucciones3 }"
              @click="
                configPantalla.viendoInstrucciones3 =
                  !configPantalla.viendoInstrucciones3
              "
            >
              📖 Instrucciones
            </button>
            <button
              type="button"
              class="option-btn"
              :class="{ selected: configPantalla.viendoCuadrado3 }"
              @click="
                configPantalla.viendoCuadrado3 = !configPantalla.viendoCuadrado3
              "
            >
              ⬜ Cuadrado
            </button>
          </div>
        </div>
        <div
          class="form-section"
          v-if="
            configPantalla.viendoSecuencia3 || configPantalla.viendoSecuencia
          "
        >
          <label class="section-label">🎵 Configuración de Secuencia</label>
          <div class="input-row">
            <div class="input-group half">
              <label>📏 Letra</label>
              <div class="range-group">
                <select
                  :value="configPantalla.tamanioParte"
                  @change="handleSelectChange($event, 'tamanioParte')"
                  class="select-input"
                >
                  <option v-for="opt in opcionesTamanioParte" :key="opt.valor" :value="opt.valor">{{ opt.label }}</option>
                </select>
                <span class="range-value"
                  >{{ configPantalla.tamanioParte }}px</span
                >
              </div>
            </div>
            <div class="input-group half">
              <label>📐 Alto</label>
              <div class="range-group">
                <select
                  :value="configPantalla.anchoParte"
                  @change="handleSelectChange($event, 'anchoParte')"
                  class="select-input"
                >
                  <option v-for="opt in opcionesAnchoParte" :key="opt.valor" :value="opt.valor">{{ opt.label }}</option>
                </select>
                <span class="range-value"
                  >{{ configPantalla.anchoParte }}px</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="guardarConfiguracionPantalla()" class="btn-primary">
          💾 Guardar Configuración
        </button>
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
  max-width: 800px;
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
.form-input {
  width: 100%;
  min-width: 0;
  padding: 12px 16px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 8px;
  background-color: #2a2a2a;
  color: white !important;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  background-color: #333333;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  color: white !important;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Range inputs */
.range-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-input {
  flex: 1;
  height: 6px;
  background: #2a2a2a;
  border: 1px solid rgba(106, 76, 147, 0.4);
  border-radius: 3px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.range-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.range-value {
  min-width: 50px;
  text-align: right;
  color: #a78bfa;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Select inputs */
.select-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 8px;
  background-color: #2a2a2a;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.select-input:hover {
  border-color: #8b5cf6;
  background-color: #333333;
}

.select-input:focus {
  border-color: #8b5cf6;
  background-color: #333333;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.select-input option {
  background-color: #2a2a2a;
  color: white;
  padding: 8px;
}

/* Option grid */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.option-btn:hover {
  border-color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.1);
  transform: translateY(-1px);
}

.option-btn.selected {
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-color: #6a4c93;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(106, 76, 147, 0.4);
}

/* Layout buttons */
.layout-btn {
  flex-direction: row;
  gap: 8px;
}

.layout-icon {
  font-family: monospace;
  font-size: 1.2rem;
  color: #a78bfa;
}

.option-btn.selected .layout-icon {
  color: white;
}

/* Checkbox styling */
.checkbox-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  color: white;
}

.checkbox-item input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 4px;
  background-color: #2a2a2a;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-item input[type='checkbox']:checked + .checkmark {
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-color: #6a4c93;
}

.checkbox-item input[type='checkbox']:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
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

/* Partitura section styling */
.partitura-section {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.1) 0%,
    rgba(106, 76, 147, 0.1) 100%
  );
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
}

.partitura-section .section-label {
  color: #c4b5fd;
  font-size: 1rem;
  margin-bottom: 16px;
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
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
