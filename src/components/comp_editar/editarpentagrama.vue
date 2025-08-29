<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import subirmidi from './subirmidi.vue'
import { Pentagrama } from '../../modelo/cancion/pentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { EstiloAcorde } from '../../modelo/pentagrama/estiloAcorde'
import { EstiloEditandoCompas } from '../../modelo/pentagrama/EstiloEditandoCompas'
import renglonpentagrama from '../comp_tocar/Tocar_renglonPentagrama.vue'
import editarCompas from '../comp_editar/editarCompasPentagrama.vue'

import { DisplaySistemaPentagrama } from '../../modelo/pentagrama/DisplaySistemaPentagrama'
import { DisplayInstrumentoPentagrama } from '../../modelo/pentagrama/DisplayInstrumentoPentagrama'
import { DisplayCompasPentagrama } from '../../modelo/pentagrama/DisplayCompasPentagrama'
import { DisplayAcordesPentagrama } from '../../modelo/pentagrama/DisplayAcordesPentagrama'
import { DisplayNotaPentagrama } from '../../modelo/pentagrama/DisplayNotapentagrama'
import { PatronRitmico } from '../../modelo/pentagrama/PatronRitmico'
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi'
import { HelperEditPentagrama } from '../../modelo/pentagrama/editPentagrama/helperEditCompasPentagrama'

const props = defineProps<{
  cancion: Cancion
  compas: number
}>()
const helperEdit = new HelperEditPentagrama()

const refEditandoCompas = ref(0)
const refDesdeOctava = ref(4)

const refInstrumentos = ref(InstrumentoMidi.GetInstrumentos())

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

refDisplayPentagrama.value.pentagramas.push(
  new DisplayInstrumentoPentagrama([], 'treble'),
)
const refCompasPentagrama = ref<DisplayCompasPentagrama>(
  new DisplayCompasPentagrama(0),
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
const notas = ref(refEstiloEditandoAcorde.value.notasInstrumentos)
const notasBateria = ref(false)
const pentaObtenido = refEstiloEditandoAcorde.value.GetCompas(
  acorde,
  refDesdeOctava.value,
  notasBateria.value,
)
refDisplayPentagrama.value.pentagramas[0].compases[0] =
  helpPenta.creaCompasPentagrama(pentaObtenido, 0)
const CtrlrenglonPentagrama = ref()
function ActualizarRitmo() {
  return
  const helpPenta = new HelperPentagramas()
  const pentaObtenido = refEstiloEditandoAcorde.value.GetCompas(
    acorde,
    refDesdeOctava.value,
    notasBateria.value,
  )
  refDisplayPentagrama.value.pentagramas[0].compases[0] =
    helpPenta.creaCompasPentagrama(pentaObtenido, 0)
  CtrlrenglonPentagrama.value.Dibujar()
}
/*
function cambiarPatronSeleccionado() {
  refEstiloEditandoAcorde.value =
    refPatrones.value[patronSeleccionado.value].GetEstilo()
  ActualizarRitmo()
}
*/
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
  nPentagrama.instrumento = 'Piano'
  props.cancion.pentagramas.push(nPentagrama)
}

function clickBorrarPentagrama() {
  props.cancion.pentagramas[idPentagramaEditando.value].compases = []
  emit('actualizoPentagrama')
}

function clickGenerarPentagrama() {
  console.log('ACtualizando', refEstiloEditandoAcorde.value)
  helperEdit.CopiarEnPentagrama(
    props.cancion,
    idPentagramaEditando.value,
    props.compas,
  )
  emit('actualizoPentagrama')
}

function cambioClave() {
  refDisplayPentagrama.value.pentagramas[0].clave =
    props.cancion.pentagramas[idPentagramaEditando.value].clave
  ActualizarRitmo()
}
function ActualizorInstrumento() {
  const esBateria = props.cancion.pentagramas[
    idPentagramaEditando.value
  ].instrumento
    .toLowerCase()
    .includes('bater')
  if (esBateria != notasBateria.value) {
    notasBateria.value = esBateria
    if (esBateria) notas.value = refEstiloEditandoAcorde.value.notasBateria
    else notas.value = refEstiloEditandoAcorde.value.notasInstrumentos
  }
}
</script>
<template>
  <div>
    <span @click="clickCancelarEdit">[Ok]</span>

    <subirmidi :cancion="cancion"></subirmidi>
  </div>
  <div>
    Pentagramas
    <select v-model="idPentagramaEditando" @change="ActualizorInstrumento">
      <option
        v-for="(pentagrama, index) in props.cancion.pentagramas"
        :key="index"
        :value="index"
      >
        {{ pentagrama.instrumento }} - {{ pentagrama.clave }}
      </option>
    </select>
    <span @click="clickAgregarPentagrama">[Agregar]</span>
  </div>

  <div v-if="cancion.pentagramas[idPentagramaEditando]">
    Instrumento:
    <select
      v-model="cancion.pentagramas[idPentagramaEditando].instrumento"
      @change="ActualizorInstrumento"
    >
      <option
        v-for="(inst, index) in refInstrumentos"
        :key="index"
        :value="inst.nombre"
      >
        {{ inst.nombre }}
      </option>
    </select>
    <select
      v-model="cancion.pentagramas[idPentagramaEditando].clave"
      @change="cambioClave"
    >
      <option value="treble">Sol</option>
      <option value="bass">Fa</option>
    </select>
  </div>
  <editarCompas
    :cancion="cancion"
    :pentagramaId="idPentagramaEditando"
    :compas="compas"
    @actualizoPentagrama="emit('actualizoPentagrama')"
  ></editarCompas>

  <div>
    <span @click="clickGenerarPentagrama">[Generar Pentagrama]</span>
    <span @click="clickBorrarPentagrama">[Borrar Pentagrama]</span>
  </div>
</template>

<style scoped>
.acorde-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}
</style>
