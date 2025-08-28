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
const refAcorde = ref(props.cancion.acordes.GetTodosLosAcordes()[props.compas])
const editCompas = ref(new EditCompasPentagrama('C4'))
const helper = new HelperEditPentagrama()
function Actualizar() {
  refCompas.value =
    props.cancion.pentagramas[props.pentagramaId].compases[props.compas]
  refAcorde.value = props.cancion.acordes.GetTodosLosAcordes()[props.compas]
  if (refCompas.value) {
    editCompas.value = helper.getDisplayEditCompas(
      refCompas.value,
      refAcorde.value,
    )
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
    {{ editCompas.acorde.acorde }}
    <input
      v-model="editCompas.acorde.octava"
      style="width: 30px"
      type="number"
      min="1"
      max="8"
    />
  </div>
  <div>
    <span @click="Redibujar()">[Actualizar]</span>
  </div>
  <div>
    <div style="display: flex">
      <div class="divNotaEdit"></div>
      <div class="divRitmo" v-for="(r, index) in editCompas.ritmo" :key="index">
        {{ r }}
      </div>
    </div>
    <div
      style="display: flex"
      v-for="(a, aIndex) in editCompas.acorde.notas"
      :key="aIndex"
    >
      <div class="divNotaEdit">{{ a }}</div>
      <div
        class="divPatronRitmo"
        v-for="(r, index) in editCompas.ritmo"
        :key="index"
      >
        {{ editCompas.notaacordes[index].patrones[aIndex] }}
      </div>
    </div>
  </div>

  <renglonpentagrama
    ref="CtrlrenglonPentagrama"
    :compas="-1"
    :cancion="cancion"
    :renglon="refDisplayPentagrama"
  />
</template>
<style scoped>
.divNotaEdit {
  width: 30px;
}
.divRitmo {
  width: 20px;
}
.divPatronRitmo {
  border: 1px solid;
  margin: 0px;
  width: 20px;
}
</style>
