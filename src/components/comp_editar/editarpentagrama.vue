<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import subirmidi from './subirmidi.vue'
import { Pentagrama } from '../../modelo/cancion/pentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { EstiloAcorde } from '../../modelo/pentagrama/estiloAcorde'
import { EstiloEditandoCompas } from '../../modelo/pentagrama/EstiloEditandoCompas'
import renglonpentagrama from '../comp_tocar/Tocar_renglonPentagrama.vue'
import { DisplaySistemaPentagrama } from '../../modelo/pentagrama/DisplaySistemaPentagrama'
import { DisplayInstrumentoPentagrama } from '../../modelo/pentagrama/DisplayInstrumentoPentagrama'
import { DisplayCompasPentagrama } from '../../modelo/pentagrama/DisplayCompasPentagrama'
import { DisplayAcordesPentagrama } from '../../modelo/pentagrama/DisplayAcordesPentagrama'
import { DisplayNotaPentagrama } from '../../modelo/pentagrama/DisplayNotapentagrama'
import { PatronRitmico } from '../../modelo/pentagrama/PatronRitmico'

const props = defineProps<{
  cancion: Cancion
}>()
const refEditandoCompas = ref(0)
const patronSeleccionado = ref(0)
const acorde =
  props.cancion.acordes.GetTodosLosAcordes()[refEditandoCompas.value]
const refDisplayPentagrama = ref<DisplaySistemaPentagrama>(
  new DisplaySistemaPentagrama(),
)

const refEstiloEditandoAcorde = ref<EstiloEditandoCompas>(
  new EstiloEditandoCompas(),
)
const refPatrones = ref(PatronRitmico.GetPatrones())

refDisplayPentagrama.value.pentagramas.push(new DisplayInstrumentoPentagrama())
const refCompasPentagrama = ref<DisplayCompasPentagrama>(
  new DisplayCompasPentagrama(),
)
refCompasPentagrama.value.acordes.push(new DisplayAcordesPentagrama())
refCompasPentagrama.value.acordes[0].Notas.push(
  new DisplayNotaPentagrama('C', 4),
)
refCompasPentagrama.value.acordes[0].duracion = '4'
refDisplayPentagrama.value.pentagramas[0].compases.push(
  refCompasPentagrama.value,
)
const helpPenta = new HelperPentagramas()
refEstiloEditandoAcorde.value =
  refPatrones.value[patronSeleccionado.value].GetEstilo()
const pentaObtenido = refEstiloEditandoAcorde.value.GetCompas(acorde)
refDisplayPentagrama.value.pentagramas[0].compases[0] =
  helpPenta.creaCompasPentagrama(pentaObtenido)
const CtrlrenglonPentagrama = ref()
function ActualizarRitmo() {
  const helpPenta = new HelperPentagramas()
  const pentaObtenido = refEstiloEditandoAcorde.value.GetCompas(acorde)
  refDisplayPentagrama.value.pentagramas[0].compases[0] =
    helpPenta.creaCompasPentagrama(pentaObtenido)
  CtrlrenglonPentagrama.value.Dibujar()
}

function cambiarPatronSeleccionado() {
  refEstiloEditandoAcorde.value =
    refPatrones.value[patronSeleccionado.value].GetEstilo()
  ActualizarRitmo()
}

refEstiloEditandoAcorde.value =
  refPatrones.value[patronSeleccionado.value].GetEstilo()

const emit = defineEmits(['cerrar', 'actualizoPentagrama'])
const idPentagramaEditando = ref(0)

// Obtener tipos y duraciones desde métodos estáticos
const duracionesDisponibles = computed(() => EstiloAcorde.GetDuraciones())

function clickCancelarEdit() {
  emit('cerrar')
}

function clickAgregarPentagrama() {
  const nPentagrama = new Pentagrama()
  nPentagrama.instrumento = 'Nuevo Instrumento'
  props.cancion.pentagramas.push(nPentagrama)
}

function clickBorrarPentagrama() {
  props.cancion.pentagramas[idPentagramaEditando.value].compases = []
  emit('actualizoPentagrama')
}

function clickGenerarPentagrama() {
  const helpPenta = new HelperPentagramas()
  console.log('ACtualizando', refEstiloEditandoAcorde.value)
  props.cancion.pentagramas[idPentagramaEditando.value].compases =
    helpPenta.creaPentagrama(
      props.cancion,
      refEstiloEditandoAcorde.value,
    ).compases
  emit('actualizoPentagrama')
}

function agregarAcorde() {
  refEstiloEditandoAcorde.value.acordes.push(
    new EstiloAcorde(1, refEstiloEditandoAcorde.value.notas.length),
  )
  ActualizarRitmo()
}

function click_CambiarTipoNota(acorde: EstiloAcorde, index: number) {
  acorde.CambiarTipoNota(index)
  ActualizarRitmo()
}

function quitarAcorde(index: number) {
  refEstiloEditandoAcorde.value.acordes.splice(index, 1)
  ActualizarRitmo()
}
</script>
<template>
  {{ acorde }}
  <div>
    <span @click="clickCancelarEdit">[Cancelar]</span>

    <subirmidi :cancion="cancion"></subirmidi>
  </div>
  <div>
    Pentagramas
    <select v-model="idPentagramaEditando">
      <option
        v-for="(pentagrama, index) in props.cancion.pentagramas"
        :key="index"
        :value="index"
      >
        {{ pentagrama.instrumento }}
      </option>
    </select>
    <span @click="clickAgregarPentagrama">[Agregar]</span>
  </div>
  <div>
    <span @click="clickGenerarPentagrama">[Generar Pentagrama]</span>
    <span @click="clickBorrarPentagrama">[Borrar Pentagrama]</span>
  </div>

  <div>
    Patron Ritmico
    <select @click="cambiarPatronSeleccionado()" v-model="patronSeleccionado">
      <option
        v-for="(patron, index) in refPatrones"
        :key="index"
        :value="index"
      >
        {{ patron.nombre }}
      </option>
    </select>
    <table>
      <thead>
        <tr>
          <th>Ritmo</th>
          <th
            v-for="(acorde, index) in refEstiloEditandoAcorde.acordes"
            :key="index"
          >
            <div>
              <select v-model="acorde.duracionId" @change="ActualizarRitmo()">
                <option
                  v-for="(duracion, index) in duracionesDisponibles"
                  :key="index"
                  :value="index"
                >
                  {{ duracion }}
                </option>
              </select>
            </div>
            <div>
              <span @click="quitarAcorde(index)">[X]</span>
            </div>
          </th>
          <th><span @click="agregarAcorde">[+]</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(nota, index) in refEstiloEditandoAcorde.notas" :key="index">
          <td>{{ nota }}</td>
          <td
            v-for="(acorde, indexnotaaco) in refEstiloEditandoAcorde.acordes"
            :key="indexnotaaco"
            @click="click_CambiarTipoNota(acorde, index)"
          >
            {{ acorde.tiposNota[index] }}
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
  <renglonpentagrama
    ref="CtrlrenglonPentagrama"
    :cancion="cancion"
    :renglon="refDisplayPentagrama"
  />
</template>

<style scoped>
.acorde-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}
</style>
