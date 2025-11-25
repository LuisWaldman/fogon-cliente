<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'
import { Tiempo } from '../../modelo/tiempo'
import emoticonOrigen from './emoticonOrigen.vue'
import compartirctrl from '../compartir.vue'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'

const helper = HelperDisplayAcordesLatino.getInstance()
const emit = defineEmits(['tocar', 'borrar'])
const vectorCalidades: string[] = [
  'De Internet',
  'Texto Sincronizado',
  'Texto Corregido',
  'Ok',
]
const agregandoLista = ref(false)
const agregandoALista = ref(false)
const props = defineProps<{
  canciones: ItemIndiceCancion[]
  listasstore: string[]
  listasserverstore: string[]
  verBorrar: boolean
  verCancionActual: boolean
  nroCancion: number
  cargando: boolean
  agregarLista: (index: number, listaseleccionada: string) => Promise<void>
}>()
const listaseleccionada = ref<string>('actual')

async function clickAgregar(index: number) {
  agregandoALista.value = true
  try {
    await props.agregarLista(index, listaseleccionada.value)
  } finally {
    agregandoALista.value = false
    agregandoLista.value = false
  }
}
function arreglartexto(texto: string): string {
  if (texto == null || texto === undefined) return ''
  let processed = texto.replace(/-/g, ' ')
  if (processed.length === 0) return processed

  // First letter lowercase, rest uppercase
  processed =
    processed.charAt(0).toUpperCase() + processed.slice(1).toLocaleLowerCase()

  // Truncate if longer than 50 characters
  if (processed.length > 50) {
    processed = processed.substring(0, 47) + '...'
  }

  return processed
}

const viendoFiltroTabla = ref(false)
const filtroTexto = ref<string>('')
const viendoDetalle = ref<number | null>(null)
const viendoOpcionesExtra = ref<number | null>(null)

const cancionesFiltradas = computed(() => {
  if (!viendoFiltroTabla.value) return props.canciones
  if (!filtroTexto.value) return props.canciones
  const texto = filtroTexto.value.toLowerCase()
  return props.canciones.filter((cancion) => {
    const banda = (cancion.banda || '').toLowerCase()
    const cancionNombre = (cancion.cancion || '').toLowerCase()
    return banda.includes(texto) || cancionNombre.includes(texto)
  })
})

function VerDetalle(index: number) {
  viendoDetalle.value = index
}

const tiempo = new Tiempo()
function Reproducir(cancion: ItemIndiceCancion, index: number) {
  emit('tocar', cancion, index)
}
function Borrar(cancion: ItemIndiceCancion) {
  emit('borrar', cancion)
}
const compartiendo = ref(false)
function dejarDeCompartir() {
  compartiendo.value = false
}
function Compartir() {
  compartiendo.value = true
}
</script>

<template>
  
  <compartirctrl
    v-if="compartiendo"
    :titulo="`Compartir Cancion`"
    :link="`link de la cancion`"
    @cerrar="dejarDeCompartir"
  />
  <table class="tabla-canciones">
    <thead>
      <tr>
        <template v-if="!viendoFiltroTabla">
          <th>Tema</th>
          <th class="duracion-column">Duracion</th>
          <th>Escala</th>
        </template>
        <template v-if="viendoFiltroTabla">
          <th colspan="4">
            <input
              v-model="filtroTexto"
              type="text"
              placeholder="Buscar por banda o canción..."
              aria-label="Filtrar canciones"
            />
          </th>
        </template>
        <th>
          <span
            @click="viendoFiltroTabla = !viendoFiltroTabla"
            role="button"
            :aria-label="viendoFiltroTabla ? 'Cerrar filtro' : 'Abrir filtro'"
            tabindex="0"
            @keydown.enter="viendoFiltroTabla = !viendoFiltroTabla"
            @keydown.space.prevent="viendoFiltroTabla = !viendoFiltroTabla"
          >
            {{ viendoFiltroTabla ? '❌' : '🔍' }}
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="props.cargando">
        <td colspan="5">🔥Cargando...</td>
      </tr>
    </tbody>
    <tbody v-if="canciones.length === 0 && props.cargando == false">
      <tr>
        <td colspan="5" style="text-align: center">Sin canciones</td>
      </tr>
    </tbody>
    <tbody v-if="canciones.length > 0 && props.cargando == false">
      <template v-for="(cancion, index) in cancionesFiltradas" :key="index">
        <tr
          @click="VerDetalle(index)"
          :class="{
            tocando: index === nroCancion && verCancionActual,
            seleccionado: index === viendoDetalle,
          }"
        >
          <td>
            <emoticonOrigen :origen="cancion.origenUrl" />{{
              arreglartexto(cancion.banda)
            }}

            <div class="textoGrande">{{ arreglartexto(cancion.cancion) }}</div>
          </td>

          <td class="textoGrande duracion-column">
            {{
              tiempo.formatSegundos(
                (60 / cancion.bpm) *
                  cancion.totalCompases *
                  cancion.compasCantidad,
              )
            }}
          </td>
          <td class="textoGrande">
            <span v-if="cancion.escala">{{
              helper.GetAcorde(cancion.escala)
            }}</span>
          </td>
          <td></td>
        </tr>
        <tr
          v-if="viendoDetalle === index"
          data-detail
          :class="{
            tocandodetalle: index === nroCancion && verCancionActual,
            seleccionado: index === viendoDetalle,
          }"
        >
          <td colspan="5" style="text-align: right">
            <div class="divDetalle">
              <div class="contDetalles">
                <div class="divItemDetalle">
                  <strong>Calidad:</strong>
                  {{ vectorCalidades[cancion.calidad] }}
                </div>

                <div class="divItemDetalle duracion-detalle">
                  <strong>Duración:</strong>
                  {{
                    tiempo.formatSegundos(
                      (60 / cancion.bpm) *
                        cancion.totalCompases *
                        cancion.compasCantidad,
                    )
                  }}
                </div>
                <div class="divItemDetalle">
                  <strong>Compás:</strong> {{ cancion.compasCantidad }}/{{
                    cancion.compasUnidad
                  }}
                </div>
                <div
                  class="divItemDetalle"
                  v-if="cancion.acordes && cancion.acordes.length > 0"
                >
                  <strong>Acordes:</strong> {{ cancion.acordes }}
                </div>
                <div class="divItemDetalle">
                  <strong>Tempo:</strong> {{ cancion.bpm }} BPM
                </div>
                <div
                  class="divItemDetalle itemSeleccionable"
                  v-if="cancion.video"
                >
                  📺
                </div>
                <div
                  class="divItemDetalle"
                  v-if="cancion.pentagramas.length > 0"
                >
                  🎼 <strong>Partitura:</strong>
                  {{ cancion.pentagramas.length }}
                </div>
              </div>

              <div class="botoneraDetalle botoneraExtra">
                <button @click="Reproducir(cancion, index)">▶ Tocar</button>
                <button @click="agregandoLista = true">🗒️ Lista</button>
                <button
                  @click="
                    viendoOpcionesExtra =
                      viendoOpcionesExtra === index ? null : index
                  "
                  v-if="viendoOpcionesExtra !== index"
                >
                  +
                </button>
                <template v-if="viendoOpcionesExtra === index">
                  <button @click="Compartir">🔗 Compartir</button>
                  <button @click="Borrar(cancion)" v-if="verBorrar">
                    🗑️ Borrar
                  </button>
                  <button>✏️ Editar</button>
                  <button>↕️ Reordenar</button>
                  <button @click="viendoOpcionesExtra = null">−</button>
                </template>
              </div>

              <div class="botoneraDetalle" v-if="agregandoLista">
                <select v-model="listaseleccionada" style="width: 60%">
                  <optgroup>
                    <option value="actual">Lista de reproduccion</option>
                  </optgroup>
                  <optgroup>
                    <option
                      v-for="lista in props.listasstore"
                      :key="lista"
                      :value="'local_' + lista"
                    >
                      💾 {{ lista }}
                    </option>
                  </optgroup>
                  <optgroup>
                    <option
                      v-for="lista in props.listasserverstore"
                      :key="lista"
                      :value="'server_' + lista"
                    >
                      🗄️ {{ lista }}
                    </option>
                  </optgroup>
                </select>
                <button
                  @click="clickAgregar(index)"
                  :disabled="agregandoALista"
                >
                  {{ agregandoALista ? '🔥 Agregando...' : 'AGREGAR' }}
                </button>
                <button
                  @click="agregandoLista = false"
                  :disabled="agregandoALista"
                >
                  ❌
                </button>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
/* Table Base Styles */
.tabla-canciones {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(169, 168, 246, 0.1);
  border: 1px solid rgba(169, 168, 246, 0.2);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

/* Header Styles */
.tabla-canciones thead {
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.15),
    rgba(106, 112, 15, 0.15)
  );
  border-bottom: 2px solid rgba(169, 168, 246, 0.3);
}

.tabla-canciones th {
  padding: 16px 12px;
  color: #a9a8f6;
  font-weight: 600;
  font-size: 1rem;
  text-align: left;
  position: relative;
}

.tabla-canciones th:last-child {
  text-align: center;
  width: 60px;
}

/* Filter Input Styles */
.tabla-canciones input[type='text'] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #a9a8f6;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tabla-canciones input[type='text']:focus {
  outline: none;
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 0 20px rgba(169, 168, 246, 0.2);
}

/* Filter Icon Styles */
.tabla-canciones th span {
  display: inline-block;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.tabla-canciones th span:hover {
  background: rgba(169, 168, 246, 0.2);
  transform: scale(1.1);
}

/* Row Styles */
.tabla-canciones tbody tr {
  border-bottom: 1px solid rgba(169, 168, 246, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.tabla-canciones tbody tr:hover {
  background: rgba(169, 168, 246, 0.05);
  transform: translateY(-1px);
}

/* Remove bottom border from row when detail is shown */
.tabla-canciones tr:has(+ tr[data-detail]) {
  border-bottom: none;
}

/* Cell Styles */
.tabla-canciones td {
  padding: 16px 12px;
  vertical-align: middle;
}

.tabla-canciones td:first-child {
  font-weight: 500;
}

/* Text Styles */
.textoGrande {
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  margin-top: 4px;
  line-height: 1.3;
}

.duracion-column {
  width: 120px;
  text-align: center;
  color: rgba(169, 168, 246, 0.8);
}

/* Detail Panel Styles */
.divDetalle {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.9),
    rgba(44, 44, 44, 0.5)
  );
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 6px;
  margin: 2px;
  padding: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.contDetalles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 4px;
  margin-bottom: 6px;
}

.divItemDetalle {
  padding: 4px 8px;
  background: rgba(169, 168, 246, 0.05);
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 4px;
  font-size: 0.85rem;
  color: #a9a8f6;
  transition: all 0.3s ease;
  text-align: left;
}

.divItemDetalle:hover {
  background: rgba(169, 168, 246, 0.1);
  border-color: rgba(169, 168, 246, 0.4);
}

.divItemDetalle strong {
  color: #fff;
  margin-right: 8px;
}

.itemSeleccionable {
  cursor: pointer;
  text-align: center;
  font-size: 1.5rem;
  padding: 16px;
}

.itemSeleccionable:hover {
  background: rgba(169, 168, 246, 0.2);
  transform: scale(1.05);
}

/* Button Styles */
.botoneraDetalle {
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  align-items: center;
  margin-top: 4px;
}

.botoneraExtra {
  justify-content: flex-end;
}

.botoneraDetalle button {
  padding: 6px 12px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 4px;
  background: rgba(169, 168, 246, 0.1);
  color: #a9a8f6;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.botoneraDetalle button:hover:not(:disabled) {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(169, 168, 246, 0.3);
}

.botoneraDetalle button:active {
  transform: translateY(0);
}

.botoneraDetalle button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.botoneraDetalle select {
  flex: 1;
  min-width: 150px;
  padding: 6px 8px;
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #a9a8f6;
  font-size: 0.85rem;
}

/* State Styles */
.tocando {
  background: linear-gradient(
    135deg,
    rgba(106, 112, 15, 0.3) 0%,
    rgba(169, 168, 246, 0.2) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  border-left: 4px solid #6a700f;
  animation: pulse 2s infinite;
}

.tocandodetalle {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(106, 112, 15, 0.2) 50%,
    rgba(169, 168, 246, 0.1) 100%
  );
  border-left: 4px solid #6a700f;
}

.seleccionado {
  background: rgba(169, 168, 246, 0.1);
  border-left: 4px solid #a9a8f6;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Loading and Empty States */
.tabla-canciones tbody td[colspan] {
  text-align: center;
  padding: 40px 20px;
  font-size: 1.2rem;
  color: rgba(169, 168, 246, 0.7);
}

/* Responsive Design */
@media (max-width: 768px) {
  .tabla-canciones {
    margin: 10px;
    width: calc(100% - 20px);
  }

  .duracion-column {
    display: none;
  }

  .duracion-detalle {
    display: block;
  }

  .textoGrande {
    font-size: 1.1rem;
  }

  .tabla-canciones th,
  .tabla-canciones td {
    padding: 12px 8px;
  }

  .divDetalle {
    margin: 0;
    padding: 4px;
  }

  .contDetalles {
    grid-template-columns: 1fr;
    gap: 3px;
  }

  .divItemDetalle {
    padding: 3px 6px;
    font-size: 0.75rem;
  }

  .botoneraDetalle {
    flex-direction: column;
    gap: 2px;
  }

  .botoneraDetalle button,
  .botoneraDetalle select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .tabla-canciones {
    font-size: 0.9rem;
  }

  .textoGrande {
    font-size: 1rem;
  }

  .tabla-canciones th,
  .tabla-canciones td {
    padding: 10px 6px;
  }
}

/* Dark theme enhancements */
@media (prefers-color-scheme: dark) {
  .tabla-canciones {
    border-color: rgba(169, 168, 246, 0.3);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .tabla-canciones {
    border: 2px solid #a9a8f6;
  }

  .tabla-canciones td,
  .tabla-canciones th {
    border: 1px solid rgba(169, 168, 246, 0.5);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .tabla-canciones tbody tr,
  .botoneraDetalle button,
  .divItemDetalle,
  .tabla-canciones th span,
  .tabla-canciones input[type='text'] {
    transition: none;
  }

  .tocando {
    animation: none;
  }

  .tabla-canciones tbody tr:hover,
  .botoneraDetalle button:hover,
  .itemSeleccionable:hover {
    transform: none;
  }
}
</style>
