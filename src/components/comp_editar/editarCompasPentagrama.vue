<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'
import type { Cancion } from '../../modelo/cancion/cancion'
import type { Pentagrama } from '../../modelo/cancion/pentagrama'
import renglonpentagrama from '../comp_tocar/Tocar_renglonPentagrama.vue'
import { DisplayInstrumentoPentagrama } from '../../modelo/pentagrama/DisplayInstrumentoPentagrama'
import { DisplayCompasPentagrama } from '../../modelo/pentagrama/DisplayCompasPentagrama'
import { DisplayAcordesPentagrama } from '../../modelo/pentagrama/DisplayAcordesPentagrama'
import { DisplayNotaPentagrama } from '../../modelo/pentagrama/DisplayNotapentagrama'
import { DisplaySistemaPentagrama } from '../../modelo/pentagrama/DisplaySistemaPentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { HelperEditPentagrama } from '../../modelo/pentagrama/editPentagrama/helperEditCompasPentagrama'
import { EditCompasPentagrama } from '../../modelo/pentagrama/editPentagrama/editCompasPentagrama'
const refDisplayPentagrama = ref<DisplaySistemaPentagrama>(
  new DisplaySistemaPentagrama(),
)
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

const CtrlrenglonPentagrama = ref()
const props = defineProps<{
  pentagramaId: number
  cancion: Cancion
  compas: number
}>()

const refCompas = ref(
  props.cancion.pentagramas[props.pentagramaId].compases[props.compas],
)
const editCompas = ref(new EditCompasPentagrama())
const helper = new HelperEditPentagrama()
function Actualizar() {
  refCompas.value =
    props.cancion.pentagramas[props.pentagramaId].compases[props.compas]

  
  if (refCompas.value) {
    editCompas.value = helper.getDisplay(refCompas.value)
    refDisplayPentagrama.value.pentagramas[0].compases[0] =
      helpPenta.creaCompasPentagrama(refCompas.value, 0)
    CtrlrenglonPentagrama.value.Dibujar()
  }
}

function Redibujar() {
  props.cancion.pentagramas[props.pentagramaId].compases[props.compas] =
    helper.getCompas(editCompas.value)
}

onMounted(() => {
  Actualizar()
})

watch(
  () => props.compas,
  () => {
    Actualizar()
  },
)

watch(
  () => props.pentagramaId,
  () => {
    Actualizar()
  },
)
</script>
<template>
  <div>
    <span @click="Redibujar()">[Actualizar]</span>
  </div>
  <div>
    {{ editCompas }}
  </div>

  <renglonpentagrama
    ref="CtrlrenglonPentagrama"
    :compas="-1"
    :cancion="cancion"
    :renglon="refDisplayPentagrama"
  />
</template>
