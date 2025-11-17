z
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'
import { Tiempo } from '../../modelo/tiempo'
import emoticonOrigen from './emoticonOrigen.vue'
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
</script>

<template>
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
              placeholder="Filtrar..."
              style="width: 100%"
            />
          </th>
        </template>
        <th>
          <span
            @click="viendoFiltroTabla = !viendoFiltroTabla"
            style="cursor: pointer"
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
          :class="{ tocando: index === nroCancion && verCancionActual,
            seleccionado: index === viendoDetalle
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
          :class="{ tocandodetalle: index === nroCancion && verCancionActual,
                  seleccionado: index === viendoDetalle
           }"
        >
          <td colspan="5" style="text-align: right">
            <div class="divDetalle">
              <div class="contDetalles">
                <div class="divItemDetalle">
                  <strong>Calidad:</strong
                  >{{ vectorCalidades[cancion.calidad] }}
                </div>

                <div class="divItemDetalle duracion-detalle">
                  Duracion:
                  <strong>
                    {{
                      tiempo.formatSegundos(
                        (60 / cancion.bpm) *
                          cancion.totalCompases *
                          cancion.compasCantidad,
                      )
                    }}</strong
                  >
                </div>
                <div class="divItemDetalle">
                  Compas:
                  <strong
                    >{{ cancion.compasCantidad }} /
                    {{ cancion.compasUnidad }}</strong
                  >
                </div>
                <div
                  class="divItemDetalle"
                  v-if="cancion.acordes && cancion.acordes.length > 0"
                >
                  <strong>Acordes:</strong>{{ cancion.acordes }}
                </div>
                <div class="divItemDetalle">
                  <strong>Tempo:</strong>{{ cancion.bpm }} BPM
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
                  🎼<strong>Partitura:</strong>{{ cancion.pentagramas.length }}
                </div>
              </div>

              <div class="botoneraDetalle">
                <button @click="Reproducir(cancion, index)">▶ Tocar</button>
                <button @click="agregandoLista = true">🗒️ Lista</button>
                <button @click="Borrar(cancion)" v-if="verBorrar">
                  🗑 Borrar
                </button>
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
table {
  border-collapse: collapse;
}

.tabla-canciones {
  width: 95%;
  margin-top: 20px;
  border: 1px solid;
}

tr {
  border-bottom: 1px solid #ccc;
}

/* Remove bottom border from row when detail is shown */
tr:has(+ tr[data-detail]) {
  border-bottom: none;
}

th,
td {
  padding: 8px;
}
.textoGrande {
  font-size: xx-large;
}

.divDetalle {
  border: 1px solid;
  width: 80%;
  margin-left: 10%;
}
.contDetalles {
  display: flex;
  flex-wrap: wrap;
}
.duracion-detalle {
  display: none;
}
.divItemDetalle {
  margin: 3px;
  margin-left: 30px;
  font-size: x-large;
}
.itemSeleccionable {
  border: 1px solid;
  border-radius: 8px;
}

/* Hide duration column on mobile devices */
@media (max-width: 767px) {
  .duracion-column {
    display: none;
  }

  .duracion-detalle {
    display: inherit;
  }

  .divItemDetalle {
    margin: 3px;
    margin-left: 3px;
    font-size: small;
  }
  .textoGrande {
    font-size: large;
  }
  .divDetalle {
    width: 95%;
    margin-left: 2.5%;
  }
  .tabla-canciones {
    width: 98%;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 10px;
  }
}

.tocando {
  background: radial-gradient(ellipse at bottom, #000000 0%, #6a700f 100%);
}
.tocandodetalle {
  background: radial-gradient(ellipse at top, #000000 0%, #6a700f 100%);
}
.seleccionado {
  background-color: #70726a;
}
</style>
