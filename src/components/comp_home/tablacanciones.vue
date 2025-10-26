<script setup lang="ts">
import { ref } from 'vue'
import type { ItemIndiceCancion } from '../../modelo/cancion/ItemIndiceCancion'
import { Tiempo } from '../../modelo/tiempo'
import emoticonOrigen from './emoticonOrigen.vue'
const emit = defineEmits(['tocar', 'borrar', 'agregar'])
const vectorCalidades: string[] = [
  'De Internet',
  'Texto Sincronizado',
  'Texto Corregido',
  'Ok',
]
const agregandoLista = ref(false)
const props = defineProps<{
  canciones: ItemIndiceCancion[]
  listasstore: string[]
  listasserverstore: string[]
}>()
const listaseleccionada = ref<string>('actual')

function clickAgregar(index: number) {
  emit('agregar', index, listaseleccionada.value)
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
const viendoDetalle = ref<number | null>(null)
function VerDetalle(index: number) {
  if (viendoDetalle.value === index) {
    viendoDetalle.value = null
  } else {
    viendoDetalle.value = index
  }
}

const tiempo = new Tiempo()
function Reproducir(index: number) {
  emit('tocar', props.canciones[index].origen)
}
function Borrar(index: number) {
  emit('borrar', props.canciones[index].origen)
}
</script>

<template>
  <table style="width: 85%; margin-top: 20px; border: 1px solid">
    <thead>
      <tr>
        <template v-if="!viendoFiltroTabla">
          <th>Tema</th>
          <th class="duracion-column">Duracion</th>
          <th>Escala</th>
        </template>
        <template v-if="viendoFiltroTabla">
          <th colspan="4">
            <input type="text" placeholder="Filtrar..." style="width: 100%" />
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
    <tbody v-if="canciones.length === 0">
      <tr>
        <td colspan="5" style="text-align: center">Sin canciones</td>
      </tr>
    </tbody>
    <tbody v-if="canciones.length > 0">
      <template v-for="(cancion, index) in canciones" :key="index">
        <tr @click="VerDetalle(index)">
          <td>
            <emoticonOrigen :origen="cancion.origen.origenUrl" />{{
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
          <td class="textoGrande">{{ cancion.escala }}</td>
          <td></td>
        </tr>
        <tr v-if="viendoDetalle === index" data-detail>
          <td colspan="5" style="text-align: right">
            <div class="divDetalle">
              <div class="contDetalles">
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
                <div class="divItemDetalle">
                  <strong>Calidad:</strong
                  >{{ vectorCalidades[cancion.calidad] }}
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
                <div class="divItemDetalle">
                  <strong>Tempo:</strong>{{ cancion.bpm }} BPM
                </div>
                <div class="divItemDetalle">
                  <strong>Partitura:</strong>{{ cancion.pentagramas.length }}
                </div>
                <div class="divItemDetalle">
                  <strong>Partitura:</strong>{{ cancion.pentagramas.length }}
                </div>
              </div>

              <div class="botoneraDetalle">
                <button @click="Reproducir(index)">▶ Tocar</button>
                <button @click="agregandoLista = true">🗒️ Lista</button>
                <button @click="Borrar(index)">🗑 Borrar</button>
              </div>

              <div class="botoneraDetalle" v-if="agregandoLista">
                <button @click="clickAgregar(index)">AGREGAR</button>
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
                      🧠 {{ lista }}
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
                
                <button @click="agregandoLista = false">❌</button>
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
}
</style>
