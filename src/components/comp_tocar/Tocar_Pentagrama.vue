<script setup lang="ts">
import renglonPentagrama from './Tocar_renglonPentagrama.vue'
import { ref, onMounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { DisplayPentagrama } from '../../modelo/pentagrama/displayPentagrama'
import type { DisplayModoPentagrama } from '../../modelo/pentagrama/displayModoPentagrama'

const emit = defineEmits(['clickCompas', 'clickCambioModo'])
const props = defineProps<{
  compas: number
  cancion: Cancion
  editando: boolean
}>()

const display = ref<DisplayPentagrama>(new DisplayPentagrama())
const modos = ref<DisplayModoPentagrama[]>([])

const helper = new HelperPentagramas()
onMounted(() => {
  Actualizar()
})

function Actualizar() {
  cargarModos()
  const newDisplay = helper.creaDisplayPentagrama(props.cancion, modos.value)
  display.value = newDisplay
}

cargarModos()
if (props.editando) {
  const items = localStorage.getItem('instrumentosPentagrama') || ''
  if (items.includes(',')) {
    console.log('Borrando instrumentos seleccionados en modo editar')
    localStorage.setItem('instrumentosPentagrama', items.split(',')[0] || '')
  }
}

function cargarModos() {
  const instrumentosenLocalstorage =
    localStorage.getItem('instrumentosPentagrama') || ''
  modos.value = helper.GetModos(props.cancion)
  if (instrumentosenLocalstorage != '' && modos.value.length > 0) {
    let encontradoTotal = false
    modos.value.forEach((modo) => {
      const encontrado = instrumentosenLocalstorage
        .split(',')
        .find((inst) => inst == modo.Nombre)
      modo.Ver = encontrado ? true : false
      if (encontrado) {
        encontradoTotal = true
      }
    })
    if (!encontradoTotal && modos.value.length > 0) {
      modos.value[0].Ver = true
    }
  }
}


function verInstrumento(modo: DisplayModoPentagrama, index: number) {
  if (props.editando) {
    localStorage.setItem('instrumentosPentagrama', modo.Nombre)
    Actualizar()
    emit('clickCambioModo', index)
    return
  }
  modo.Ver = !modo.Ver
  const instrumentosSeleccionados = modos.value
    .filter((m) => m.Ver)
    .map((m) => m.Nombre)
  localStorage.setItem(
    'instrumentosPentagrama',
    instrumentosSeleccionados.join(','),
  )
  Actualizar()
}

</script>
<template>
  <div class="componenteMusical">
    <div class="dropdown dropdown-superior-derecha">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="bi bi-eye"></i>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li
          v-for="(modo, index) in modos"
          :key="index"
          @click="verInstrumento(modo, index)"
        >
          <i class="bi bi-check-circle" v-if="modo.Ver"></i>
          {{ modo.Nombre }}
        </li>
      </ul>
    </div>

    <div v-for="(renglon, index) in display.renglones" :key="index">
      <renglonPentagrama
        :compas="props.compas"
        :renglon="renglon"
        :cancion="props.cancion"
        @clickCompas="emit('clickCompas', $event)"
      ></renglonPentagrama>
    </div>
  </div>
</template>

<style scoped>
.componenteMusical {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
}

.dropdown-superior-derecha {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 5;
}
</style>
