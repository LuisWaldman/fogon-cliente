<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import subirxml from './subirxml.vue'
import { Pentagrama } from '../../modelo/cancion/pentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/HelperPentagramas'
import { EstiloEditandoCompas } from '../../modelo/pentagrama/EstiloEditandoCompas'
import editarCompas from '../comp_editar/editarCompasPentagrama.vue'
import combo from '../comp_editar/comboInstrumentos.vue'

import { DisplaySistemaPentagrama } from '../../modelo/pentagrama/DisplaySistemaPentagrama'
import { DisplayInstrumentoPentagrama } from '../../modelo/pentagrama/DisplayInstrumentoPentagrama'
import { DisplayCompasPentagrama } from '../../modelo/pentagrama/DisplayCompasPentagrama'
import { DisplayAcordesPentagrama } from '../../modelo/pentagrama/DisplayAcordesPentagrama'
import { DisplayNotaPentagrama } from '../../modelo/pentagrama/DisplayNotapentagrama'
import { PatronRitmico } from '../../modelo/pentagrama/PatronRitmico'
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi'
import { HelperEditPentagrama } from '../../modelo/pentagrama/editPentagrama/helperEditCompasPentagrama'
import type { DisplayModoPentagrama } from '../../modelo/pentagrama/displayModoPentagrama'

const props = defineProps<{
  cancion: Cancion
  compas: number
  editandoModo: number
}>()

const modos = ref<DisplayModoPentagrama[]>([])
const helper = new HelperPentagramas()

cargarModos()
function cargarModos() {
  modos.value = helper.GetModos(props.cancion)
}
const helperEdit = new HelperEditPentagrama()

const refEditandoCompas = ref(0)
const refDesdeOctava = ref(4)


watch(
  () => props.editandoModo,
  () => {
    calcularPentagramaEditando()
  },
)
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
const pentagrama = Pentagrama.GetPentagramaDefault(1)
pentagrama.compases[0] = pentaObtenido

refDisplayPentagrama.value.pentagramas[0].compases[0] =
  helpPenta.creaCompasPentagrama(pentagrama, 0, props.cancion.escala)
const CtrlrenglonPentagrama = ref()
function ActualizarRitmo() {
  return
  const helpPenta = new HelperPentagramas()
  const pentaObtenido = refEstiloEditandoAcorde.value.GetCompas(
    acorde,
    refDesdeOctava.value,
    notasBateria.value,
  )

  const pentagrama = Pentagrama.GetPentagramaDefault(1)
  pentagrama.compases[0] = pentaObtenido
  refDisplayPentagrama.value.pentagramas[0].compases[0] =
    helpPenta.creaCompasPentagrama(pentagrama, 0, props.cancion.escala)
  CtrlrenglonPentagrama.value.Dibujar()
}

refEstiloEditandoAcorde.value =
  refPatrones.value[patronSeleccionado.value].GetEstilo()

const emit = defineEmits(['cerrar', 'actualizoPentagrama'])
const idPentagramaEditando = ref(0)

function clickCancelarEdit() {
  emit('cerrar')
}

function clickAgregarPentagrama() {
  const nPentagrama = Pentagrama.GetPentagramaDefault(
    props.cancion.totalCompases,
  )

  props.cancion.pentagramas.push(nPentagrama)

  emit('actualizoPentagrama')
}

function clickBorrarModo(modo: DisplayModoPentagrama) {
  props.cancion.pentagramas = props.cancion.pentagramas.filter(
    (penta) => penta.nombre != modo.Nombre,
  )
  cargarModos()
  emit('actualizoPentagrama')
}

function clickGenerarPentagrama() {
  console.log('Actualizando', refEstiloEditandoAcorde.value)
  helperEdit.CopiarEnPentagrama(
    props.cancion,
    idPentagramaEditando.value,
    props.compas,
  )
  emit('actualizoPentagrama')
}

function cambioInstrumento(modo: DisplayModoPentagrama, instrumento: string) {
  // actualiza el modo mostrado
  modo.Instrumento = instrumento

  // sincroniza los pentagramas que correspondan con ese modo
  for (const element of props.cancion.pentagramas) {
    if (element.nombre === modo.Nombre) {
      element.instrumento = instrumento
    }
  }

  // actualizar estados relacionados y notificar al padre
  ActualizarInstrumento()
  cargarModos() // opcional: si quieres regenerar la lista de modos desde la canción
  emit('actualizoPentagrama')

  console.log('Cambiado instrumento de modo', modo.Nombre, 'a', instrumento)
}

const editandoClave = ref("treble")
function calcularPentagramaEditando() {
  let cont = 0
  props.cancion.pentagramas.forEach((penta) => {
    if (penta.nombre === modos.value[props.editandoModo].Nombre && (editandoClave.value === penta.clave || modos.value[props.editandoModo].Claves.length === 1)) {
      idPentagramaEditando.value = cont
    }
    cont++
  })
}
function ActualizarInstrumento() {
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
    <subirxml :cancion="cancion"></subirxml>
  </div>
  <div v-if="modos.length > 0">
    <div><strong>Nombre</strong> <input v-model="modos[editandoModo].Nombre" /><span @click="clickBorrarModo(modos[editandoModo])">[BORRAR]</span></div>
    <div><strong>Instrumento</strong>
        <combo
          :instrumento="modos[editandoModo].Instrumento"
          @changeInstrumento="(nuevo) => cambioInstrumento(modos[editandoModo], nuevo)"
        ></combo>
  </div>
  
  <h5>Clave <template v-if="modos[editandoModo].Claves.length > 1">
    <select v-model="editandoClave" @change="calcularPentagramaEditando()">
      <option v-for="clave in modos[editandoModo].Claves" :key="clave" :value="clave">{{ clave === 'treble' ? 'Sol' : clave === 'bass' ? 'Fa' : clave }}</option>
    </select>

  </template></h5>
  
</div>

  <editarCompas
    v-if="cancion.pentagramas[idPentagramaEditando] && compas >= 0"
    :cancion="cancion"
    :pentagramaId="idPentagramaEditando"
    :compas="compas"
    @actualizoPentagrama="emit('actualizoPentagrama')"
  ></editarCompas>

  <div>
    <span @click="clickGenerarPentagrama">[Generar Pentagrama]</span>
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
