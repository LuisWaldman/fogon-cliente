<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'
import type { FiltroIndice } from '../../modelo/indices/filtroIndice'
import { FiltroIndiceBusqueda } from '../../modelo/indices/filtroIndiceBusqueda'
import { FiltroEscala } from '../../modelo/indices/filtroEscala'
import { FiltroTempo } from '../../modelo/indices/filtroTempo'
import { FiltroVideo } from '../../modelo/indices/filtroVideo'
import { FiltroPartes } from '../../modelo/indices/filtroPartes'
import { filtroAcordes } from '../../modelo/indices/filtroAcordes'
import { FiltroEtiquetas } from '../../modelo/indices/filtroEtiquetas'
import { FiltroCalidad } from '../../modelo/indices/filtroCalidad'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'

const appStore = useAppStore()
const helper = HelperDisplayAcordesLatino.getInstance()
helper.latino = appStore.perfil.CifradoLatino

// Definir emisores
const emit = defineEmits<{
  resultados: [canciones: ItemIndiceCancion[]]
}>()

const refResultadoCanciones = ref<ItemIndiceCancion[]>(
  appStore.aplicacion.indiceHelper.BusquedaCanciones,
)
const refEstadoBusqueda = ref(' ')
const busqueda = ref('')

/* refs para controlar los filtros (false = no seleccionado) */
const filtroEscala = ref(false)
const filtroTempo = ref(false)
const cfiltroVideo = ref(false)
const filtroPartitura = ref(false)
const filtroCantAcordes1 = ref(false)
const filtroDuracion = ref(false)
const filtroCalidad = ref(false)
const filtroEtiquetas = ref(false)
const filtroPartes = ref(false)

// Refs para controlar qué dropdown está abierto
const dropdownEscalaAbierto = ref(false)
const dropdownTempoAbierto = ref(false)
const dropdownPartituraAbierto = ref(false)
const dropdownAcordesAbierto = ref(false)
const dropdownDuracionAbierto = ref(false)
const dropdownCalidadAbierto = ref(false)
const dropdownGrupoAbierto = ref(false)
const dropdownPartesAbierto = ref(false)

const notas: string[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

// Crear escalas mayores y menores
const escalas = [
  ...notas.map((nota) => ({
    value: nota,
    label: `${helper.GetAcorde(nota)} Mayor`,
  })),
  ...notas.map((nota) => ({
    value: `${nota}m`,
    label: `${helper.GetAcorde(nota)} Menor`,
  })),
].sort((a, b) => a.label.localeCompare(b.label))

const filtroEscalaNota = ref(['C'])
const filtroTempoBPM = ref(['0_60'])
const filtroPartituraSeleccionada = ref([''])
const filtroCantAcordesSeleccionada = ref([''])
const filtroDuracionSeleccionada = ref(['todas'])
const filtroCalidadSeleccionada = ref(['0', '1', '2', '3'])
const filtroGrupoSeleccionado = ref([])
const filtroPartesSeleccionada = ref([''])

// Opciones para los dropdowns
const opcionesTempo = [
  { value: '0_60', label: 'Largo (Menos de 60 BPM)' },
  { value: '61_66', label: 'Largo a Adagio (61 a 66 BPM)' },
  { value: '67_76', label: 'Adagio (67 a 76 BPM)' },
  { value: '77_108', label: 'Andante (77 a 108 BPM)' },
  { value: '109_120', label: 'Moderato (109 a 120 BPM)' },
  { value: '121_168', label: 'Allegro (121 a 168 BPM)' },
  { value: '169_176', label: 'Vivace (169 a 176 BPM)' },
  { value: '177_200', label: 'Presto (177 a 200 BPM)' },
  { value: '201_300', label: 'Prestissimo (201 a 300 BPM)' },
]

const opcionesPartitura = [
  { value: 'todas', label: 'Todas' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'no_disponible', label: 'No Disponible' },
]

const opcionesAcordes = [
  { value: '0_3', label: '3 o menos' },
  { value: '4_4', label: '4' },
  { value: '4_6', label: '4 a 6' },
  { value: '6_100', label: 'más de 6' },
]

const opcionesDuracion = [
  { value: 'todas', label: 'Todas' },
  { value: 'corta', label: 'Corta (menos de 3 min)' },
  { value: 'media', label: 'Media (3-5 min)' },
  { value: 'larga', label: 'Larga (más de 5 min)' },
]

const opcionesCalidad = [
  { value: '0', label: 'De Internet' },
  { value: '1', label: 'Texto Sincronizado' },
  { value: '2', label: 'Texto Corregido' },
  { value: '3', label: 'Ok' },
]

const opcionesGrupo = [
  { value: 'Rock Nacional', label: 'Rock Nacional' },
  { value: 'Tango', label: 'Tango' },
  { value: 'Folclore', label: 'Folclore' },
  { value: 'Cumbia', label: 'Cumbia' },
  { value: 'Rock Internacional', label: 'Rock Internacional' },
  { value: 'Música Moderna', label: 'Música Moderna' },
  { value: 'sonetos', label: 'Sonetos' },
  { value: 'brasilero', label: 'Brasilero' },
  { value: 'chanson_francesa', label: 'Francés' },
  { value: 'brasilero', label: 'Brasilero' },
  { value: 'estilo_latino', label: 'Estilo Latino' },
  { value: 'cumbia', label: 'Cumbia' },
]

const opcionesPartes = [
  { value: 'una', label: 'Una parte' },
  { value: 'dos', label: 'Dos partes' },
  { value: 'tres', label: 'Tres partes' },
  { value: 'cuatro', label: 'Cuatro partes' },
  { value: 'mas_de_cuatro', label: 'Más de cuatro partes' },
]

function toggleCheckbox(array: string[], value: string) {
  const index = array.indexOf(value)
  if (index > -1) {
    array.splice(index, 1)
  } else {
    array.push(value)
  }
}

function buscarCanciones() {
  console.log('buscando canciones...')
  refEstadoBusqueda.value = 'buscando...'
  const filtros: FiltroIndice[] = []
  if (busqueda.value.trim() !== '') {
    filtros.push(new FiltroIndiceBusqueda(busqueda.value.trim()))
  }
  if (filtroEscala.value) {
    const escalasSeleccionadas = filtroEscalaNota.value.join(',')
    filtros.push(new FiltroEscala(escalasSeleccionadas))
  }
  if (filtroTempo.value) {
    const temposSeleccionados = filtroTempoBPM.value.join(',')
    filtros.push(new FiltroTempo(temposSeleccionados))
  }
  if (filtroCantAcordes1.value) {
    const acordesSeleccionados = filtroCantAcordesSeleccionada.value.join(',')
    // Suponiendo que tienes un filtro para cantidad de acordes
    filtros.push(new filtroAcordes(acordesSeleccionados))
  }
  if (filtroCalidad.value) {
    const calidadesSeleccionadas = filtroCalidadSeleccionada.value.join(',')
    // Suponiendo que tienes un filtro para cantidad de acordes
    filtros.push(new FiltroCalidad(calidadesSeleccionadas))
  }

  if (cfiltroVideo.value) {
    filtros.push(new FiltroVideo())
  }
  // Agregar filtro de partes si está activo
  if (filtroPartes.value) {
    const partesSeleccionadas = filtroPartesSeleccionada.value.join(',')
    filtros.push(new FiltroPartes(partesSeleccionadas))
  }

  if (filtroEtiquetas.value) {
    const partesSeleccionadas = filtroGrupoSeleccionado.value.join(',')
    filtros.push(new FiltroEtiquetas(partesSeleccionadas))
  }
  //FiltroEtiquetas

  appStore.aplicacion.indiceHelper
    .Buscar(filtros)
    .then(() => {
      refResultadoCanciones.value =
        appStore.aplicacion.indiceHelper.BusquedaCanciones
      refEstadoBusqueda.value = ''
      // Emitir los resultados al componente padre
      emit('resultados', refResultadoCanciones.value)
    })
    .catch(() => {
      refEstadoBusqueda.value = 'error'
    })
}

const viendoFiltros = ref(false)
function VerFiltros() {
  viendoFiltros.value = !viendoFiltros.value
}
</script>

<template>
  <div
    style="
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    "
  >
    <p class="primer-parrafo">Busca Canciones</p>
    <div
      style="
        margin-bottom: 5px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      "
    >
      <input
        type="text"
        v-model="busqueda"
        placeholder="Buscar..."
        style="width: 60%"
        @keydown.enter="buscarCanciones()"
      />
      {{ refEstadoBusqueda }}
    </div>

    <div
      style="
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 10px;
      "
    >
      <button @click="buscarCanciones()">Buscar</button>
      <button @click="VerFiltros()">Filtros</button>
    </div>

    <div
      v-if="viendoFiltros"
      style="width: 100%; display: flex; flex-wrap: wrap; gap: 15px"
    >
      <!-- Escala -->
      <div class="filtro" :class="{ seleccionado: filtroEscala }">
        <div class="filtro-header" @click="filtroEscala = !filtroEscala">
          Escala
        </div>
        <div v-if="filtroEscala" class="dropdown-container">
          <div
            class="dropdown-header"
            @click="dropdownEscalaAbierto = !dropdownEscalaAbierto"
          >
            Seleccionar escalas ({{ filtroEscalaNota.length }}) ▼
          </div>
          <div v-if="dropdownEscalaAbierto" class="dropdown-content">
            <label
              v-for="escala in escalas"
              :key="escala.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :checked="filtroEscalaNota.includes(escala.value)"
                @change="toggleCheckbox(filtroEscalaNota, escala.value)"
              />
              {{ escala.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Etiqueta -->
      <div class="filtro" :class="{ seleccionado: filtroEtiquetas }">
        <div class="filtro-header" @click="filtroEtiquetas = !filtroEtiquetas">
          Etiquetas
        </div>
        <div v-if="filtroEtiquetas" class="dropdown-container">
          <div
            class="dropdown-header"
            @click="dropdownGrupoAbierto = !dropdownGrupoAbierto"
          >
            Seleccionar ({{ filtroGrupoSeleccionado.length }}) ▼
          </div>
          <div v-if="dropdownGrupoAbierto" class="dropdown-content">
            <label
              v-for="opcion in opcionesGrupo"
              :key="opcion.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                @change="toggleCheckbox(filtroGrupoSeleccionado, opcion.value)"
              />
              {{ opcion.label }}
            </label>
          </div>
        </div>
      </div>

      
      <!-- Calidad -->
      <div class="filtro" :class="{ seleccionado: filtroCalidad }">
        <div class="filtro-header" @click="filtroCalidad = !filtroCalidad">
          Calidad
        </div>
        <div v-if="filtroCalidad" class="dropdown-container">
          <div
            class="dropdown-header"
            @click="dropdownCalidadAbierto = !dropdownCalidadAbierto"
          >
            Seleccionar ({{ filtroCalidadSeleccionada.length }}) ▼
          </div>
          <div v-if="dropdownCalidadAbierto" class="dropdown-content">
            <label
              v-for="opcion in opcionesCalidad"
              :key="opcion.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :checked="filtroCalidadSeleccionada.includes(opcion.value)"
                @change="
                  toggleCheckbox(filtroCalidadSeleccionada, opcion.value)
                "
              />
              {{ opcion.label }}
            </label>
          </div>
        </div>
      </div>
      <!-- Tempo -->
      <div class="filtro" :class="{ seleccionado: filtroTempo }">
        <div class="filtro-header" @click="filtroTempo = !filtroTempo">
          Tempo
        </div>
        <div v-if="filtroTempo" class="dropdown-container">
          <div
            class="dropdown-header"
            @click="dropdownTempoAbierto = !dropdownTempoAbierto"
          >
            Seleccionar tempo ({{ filtroTempoBPM.length }}) ▼
          </div>
          <div v-if="dropdownTempoAbierto" class="dropdown-content">
            <label
              v-for="opcion in opcionesTempo"
              :key="opcion.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :checked="filtroTempoBPM.includes(opcion.value)"
                @change="toggleCheckbox(filtroTempoBPM, opcion.value)"
              />
              {{ opcion.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Video sincronizado -->
      <div class="filtro" :class="{ seleccionado: cfiltroVideo }">
        <div class="filtro-header" @click="cfiltroVideo = !cfiltroVideo">
          Video
        </div>
      </div>

      <!-- Partitura -->
      <div class="filtro" :class="{ seleccionado: filtroPartitura }">
        <div class="filtro-header" @click="filtroPartitura = !filtroPartitura">
          Partituras
        </div>
        <div v-if="filtroPartitura" class="dropdown-container">
          <div
            class="dropdown-header"
            @click="dropdownPartituraAbierto = !dropdownPartituraAbierto"
          >
            Seleccionar ({{ filtroPartituraSeleccionada.length }}) ▼
          </div>
          <div v-if="dropdownPartituraAbierto" class="dropdown-content">
            <label
              v-for="opcion in opcionesPartitura"
              :key="opcion.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :checked="filtroPartituraSeleccionada.includes(opcion.value)"
                @change="
                  toggleCheckbox(filtroPartituraSeleccionada, opcion.value)
                "
              />
              {{ opcion.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Cantidad de Acordes -->
      <div class="filtro" :class="{ seleccionado: filtroCantAcordes1 }">
        <div
          class="filtro-header"
          @click="filtroCantAcordes1 = !filtroCantAcordes1"
        >
          Acordes
        </div>
        <div v-if="filtroCantAcordes1" class="dropdown-container">
          <div
            class="dropdown-header"
            @click="dropdownAcordesAbierto = !dropdownAcordesAbierto"
          >
            Seleccionar ({{ filtroCantAcordesSeleccionada.length }}) ▼
          </div>
          <div v-if="dropdownAcordesAbierto" class="dropdown-content">
            <label
              v-for="opcion in opcionesAcordes"
              :key="opcion.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :checked="filtroCantAcordesSeleccionada.includes(opcion.value)"
                @change="
                  toggleCheckbox(filtroCantAcordesSeleccionada, opcion.value)
                "
              />
              {{ opcion.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Partes -->
      <div class="filtro" :class="{ seleccionado: filtroPartes }">
        <div class="filtro-header" @click="filtroPartes = !filtroPartes">
          Partes
        </div>
        <div v-if="filtroPartes" class="dropdown-container">
          <div
            class="dropdown-header"
            @click="dropdownPartesAbierto = !dropdownPartesAbierto"
          >
            Seleccionar ({{ filtroPartesSeleccionada.length }}) ▼
          </div>
          <div v-if="dropdownPartesAbierto" class="dropdown-content">
            <label
              v-for="opcion in opcionesPartes"
              :key="opcion.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :checked="filtroPartesSeleccionada.includes(opcion.value)"
                @change="toggleCheckbox(filtroPartesSeleccionada, opcion.value)"
              />
              {{ opcion.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Duracion -->
      <div class="filtro" :class="{ seleccionado: filtroDuracion }">
        <div class="filtro-header" @click="filtroDuracion = !filtroDuracion">
          Duracion
        </div>
        <div v-if="filtroDuracion" class="dropdown-container">
          <div
            class="dropdown-header"
            @click="dropdownDuracionAbierto = !dropdownDuracionAbierto"
          >
            Seleccionar ({{ filtroDuracionSeleccionada.length }}) ▼
          </div>
          <div v-if="dropdownDuracionAbierto" class="dropdown-content">
            <label
              v-for="opcion in opcionesDuracion"
              :key="opcion.value"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :checked="filtroDuracionSeleccionada.includes(opcion.value)"
                @change="
                  toggleCheckbox(filtroDuracionSeleccionada, opcion.value)
                "
              />
              {{ opcion.label }}
            </label>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.primer-parrafo {
  font-size: x-large;
}

.filtro {
  margin-left: 5px;
  margin-right: 5px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: default;
  position: relative;
  min-width: 120px;
  border: 1px solid transparent;
}
.filtro .filtro-header {
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}
.filtro.seleccionado {
  background-color: rgba(138, 43, 226);
  border: 1px solid rgba(138, 43, 226, 0.4);
  color: white;
  padding: 6px 12px;
  min-width: 200px;
}

/* Dropdown styles */
.dropdown-container {
  margin-top: 10px;
}

.dropdown-header {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  color: #333;
}

.dropdown-header:hover {
  background-color: #e9ecef;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  padding: 5px 0;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
}

.checkbox-item:hover {
  background-color: #f8f9fa;
}

.checkbox-item input[type='checkbox'] {
  margin-right: 8px;
}
</style>
