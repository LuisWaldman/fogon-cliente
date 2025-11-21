<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import { useAppStore } from '../../stores/appStore'
import { Cancion } from '../../modelo/cancion/cancion'
import { useRouter, type Router } from 'vue-router'
import { Acordes, Parte } from '../../modelo/cancion/acordes'
import { Letra } from '../../modelo/cancion/letra'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'
import SelectEscala from '../SelectEscala.vue'

const emit = defineEmits(['cerrar'])
const modeloLetra = [
  'Cancion 16 versos',
  'Soneto',
  'Decima',
  '2 Decimas',
  'Vacia',
]

const sonetoPrimeraParte: string[] = [
  'Lorem ipsum dolor ',
  'sit amet claro,/n',
  'consectetur et  ',
  'magna luce pura,/n',
  'adipiscing elit, ',
  ' forma segura,/n',
  'sed do tempor, tempor',
  'ut labore raro./n',
  'Incididunt ut dolore, ',
  ' vita amparo,/n',
  'aliqua regnat,  ',
  'aura que perdura,/n',
  'veniam minimus,  ',
  'voluptas que procura,/n',
  'quis nostrud arte, ',
  ' lumen que declaro./n',
]
const sonetoSegundaParte: string[] = [
  'Ut enimat magna,  ',
  'saga sonante,/n',
  'ullamco voces,  ',
  'dulce melodía,/n',
  'laboris aura,  ',
  'canto delirante./n',
  'Irure spiritus,  ',
  'clara la armonía,/n',
  'dolor in velit, ',
  ' eco fulgurante,/n',
  'esse laborum,  ',
  'fin de poesía./n',
]
const parteMusical = ['', '', '', '/n']
const modeloLetraId = ref(0)
const reftema = ref('')
const refbanda = ref('')
const refBPM = ref(80)
const refcompas = ref('4_4')
const funciones = [
  'I-IV-V-I',
  'I-II-IV-V',
  'I-II-V-VI',
  'I-III-VI-V',
  'I-III-V-VI',
  'I-VI-IV-V',
  'I-V-VI-V',
  'I-VI-II-V',
  'I-V-I-IV',
]
const funcionesSeleccionadas = ref(new Set<string>())
const conIntro = ref(false)
const conOutro = ref(false)
const conPuente = ref(false)
const refescala = ref('C')

const appStore = useAppStore()
const helper = HelperDisplayAcordesLatino.getInstance()
helper.latino = appStore.perfil.CifradoLatino

let router: Router | null = null
onMounted(() => {
  router = useRouter()
})

function GetAcordesParte(acordesEscala: string[], funcion: string): string[] {
  const indice = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
  const partes = funcion.split('-')
  const acordesParte: string[] = []
  for (const parte of partes) {
    const idx = indice.indexOf(parte)
    if (idx !== -1 && idx < acordesEscala.length) {
      acordesParte.push(acordesEscala[idx])
    } else {
      acordesParte.push('?')
    }
  }
  return acordesParte
}

function nuevaCancion() {
  // Lógica para crear una nueva canción

  const appStore = useAppStore()
  const partes: Parte[] = []
  const ordenPartes: number[] = []
  if (funcionesSeleccionadas.value.size === 0) {
    partes.push(new Parte('vacio', ['?', '?', '?', '?']))
  } else {
    const musica = new MusicaHelper()
    const acordes = musica.GetAcordesdeescala(refescala.value)
    console.log(acordes)
    let parte = 0

    for (var funcion of funcionesSeleccionadas.value) {
      partes.push(new Parte(funcion, GetAcordesParte(acordes, funcion)))
      ordenPartes.push(parte)
      parte++
    }
  }
  const cancion: string = reftema.value
  const banda: string = refbanda.value
  const acordes = new Acordes(partes, ordenPartes)
  const letra: string[][] = []
  if (conIntro.value) {
    letra.push(parteMusical)
  }
  letra.push(sonetoPrimeraParte)
  if (conPuente.value) {
    letra.push(parteMusical)
  }
  letra.push(sonetoSegundaParte)
  if (conOutro.value) {
    letra.push(parteMusical)
  }

  const letras: Letra = new Letra(letra)
  const totalLetra = letra.flat().length
  const totalAcordes = acordes.GetTotalAcordes()
  let aagregar = (totalLetra - totalAcordes) / 4
  let partecont = 0
  while (aagregar > 0) {
    acordes.ordenPartes.push(partecont)
    aagregar--
    partecont++
    partecont = partecont % partes.length
  }
  const bpm: number = refBPM.value
  const calidad: number = 0
  const compasSeleccionado = refcompas.value.split('_')
  const compasCantidad: number = parseInt(compasSeleccionado[0])
  const compasUnidad: number = parseInt(compasSeleccionado[1])
  const escala: string = refescala.value
  appStore.editandocancion = new Cancion(
    cancion,
    banda,
    acordes,
    letras,
    bpm,
    calidad,
    compasCantidad,
    compasUnidad,
    escala,
  )
  router?.push('/editar')
}
function toggleFuncion(funcion: string) {
  if (funcionesSeleccionadas.value.has(funcion)) {
    funcionesSeleccionadas.value.delete(funcion)
  } else {
    funcionesSeleccionadas.value.add(funcion)
  }
}
function chgIntro() {
  conIntro.value = !conIntro.value
}
function chgOutro() {
  conOutro.value = !conOutro.value
}
function chgPuente() {
  conPuente.value = !conPuente.value
}
</script>

<template>
  <div class="modal-backdrop" @click="emit('cerrar')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>🎵 Nueva Canción</h2>
        <button class="close-btn" @click="emit('cerrar')" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div class="modal-body">
        <div class="form-section">
          <div class="input-group">
            <label for="tema">🎤 Tema</label>
            <input
              id="tema"
              type="text"
              placeholder="Ingrese el título de la canción"
              v-model="reftema"
              class="form-input"
            />
          </div>

          <div class="input-group">
            <label for="banda">🎸 Banda</label>
            <input
              id="banda"
              type="text"
              placeholder="Ingrese el nombre de la banda"
              v-model="refbanda"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-section">
          <div class="input-row">
            <div class="input-group half">
              <label for="bpm">⏱️ Tempo (BPM)</label>
              <input
                id="bpm"
                type="number"
                v-model="refBPM"
                min="40"
                max="240"
                class="form-input"
              />
            </div>
            <div class="input-group half">
              <label for="compas">🎼 Compás</label>
              <select id="compas" v-model="refcompas" class="">
                <option value="2_4">2/4</option>
                <option value="3_4">3/4</option>
                <option value="4_4">4/4</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="input-row">
            <div class="input-group half">
              <label for="modelo">📝 Modelo de Letra</label>
              <select id="modelo" v-model="modeloLetraId" class="">
                <option
                  v-for="(modelo, index) in modeloLetra"
                  :key="index"
                  :value="index"
                >
                  {{ modelo }}
                </option>
              </select>
            </div>
            <div class="input-group half">
              <label>🎼 Escala</label>
              <SelectEscala v-model="refescala" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <label class="section-label">🎵 Funciones Armónicas</label>
          <div class="option-grid">
            <button
              v-for="funcion in funciones"
              :key="funcion"
              type="button"
              class="option-btn"
              :class="{ selected: funcionesSeleccionadas.has(funcion) }"
              @click="toggleFuncion(funcion)"
            >
              {{ funcion }}
            </button>
          </div>
        </div>

        <div class="form-section">
          <label class="section-label">🎼 Estructura</label>
          <div class="option-grid">
            <button
              type="button"
              class="option-btn"
              :class="{ selected: conIntro }"
              @click="chgIntro()"
            >
              Intro
            </button>
            <button
              type="button"
              class="option-btn"
              :class="{ selected: conPuente }"
              @click="chgPuente()"
            >
              Puente
            </button>
            <button
              type="button"
              class="option-btn"
              :class="{ selected: conOutro }"
              @click="chgOutro()"
            >
              Outro
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="emit('cerrar')" class="btn-secondary">
          Cancelar
        </button>
        <button @click="nuevaCancion()" class="btn-primary">
          ➕ Crear Canción
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
  max-width: 600px;
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
.form-input,
.form-select {
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

.form-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #8b5cf6;
  background-color: #333333;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  color: white !important;
}

.form-select:focus {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Select dropdown styling */
.form-select option {
  background-color: #2a2a2a !important;
  color: white !important;
  padding: 8px 16px;
  border: none;
  font-size: 1rem;
}

.form-select option:hover {
  background-color: #6a4c93 !important;
  color: white !important;
}

.form-select option:checked,
.form-select option:selected {
  background-color: #8b5cf6 !important;
  color: white !important;
  font-weight: 500;
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

/* Option grid */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
  min-width: 120px;
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
}@media (max-width: 480px) {
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
