<script setup lang="ts">
import renglonPentagrama from './Tocar_renglonPentagrama.vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { DisplayPentagrama } from '../../modelo/pentagrama/displayPentagrama'
import type { DisplayModoPentagrama } from '../../modelo/pentagrama/displayModoPentagrama'
import { Pantalla } from '../../modelo/pantalla'

const emit = defineEmits(['clickCompas', 'clickCambioModo'])
const props = defineProps<{
  compas: number
  cancion: Cancion
  editando: boolean
  compasxRenglon: number
}>()

const display = ref<DisplayPentagrama>(new DisplayPentagrama())
display.value.compasxRenglon = props.compasxRenglon
const modos = ref<DisplayModoPentagrama[]>([])

const helper = new HelperPentagramas()
const pantalla = new Pantalla()
const pentagramaDiv = ref<HTMLElement | null>(null) // Ref to the div
const scrollTop = ref(0)
watch(
  () => props.compas,
  () => {
    const configPantalla = pantalla.getConfiguracionPantalla()
    if (configPantalla.AutoScroll === false) return

    // Centrar el compás que está sonando
    scrollToCurrentChord()
  },
)

function scrollToCurrentChord() {
  // Usar setTimeout para asegurar que el DOM se haya actualizado
  setTimeout(() => {
    if (!pentagramaDiv.value) return

    // Buscar el renglón que contiene el compás actual
    let renglonActualIndex = -1
    
    for (let i = 0; i < display.value.renglones.length; i++) {
      const renglon = display.value.renglones[i]
      if (renglon.pentagramas.length === 0) continue
      
      const desdecompas = renglon.pentagramas[0].compases[0].nroCompas
      const hastacompas = renglon.pentagramas[0].compases[renglon.pentagramas[0].compases.length - 1].nroCompas
      
      if (props.compas >= desdecompas && props.compas <= hastacompas) {
        renglonActualIndex = i
        break
      }
    }
    
    if (renglonActualIndex >= 0) {
      const renglones = pentagramaDiv.value.querySelectorAll('.renglon-pentagrama')
      const renglonElement = renglones[renglonActualIndex]
      
      if (renglonElement) {
        // Obtener la posición del renglón relativa al contenedor
        const containerRect = pentagramaDiv.value.getBoundingClientRect()
        const elementRect = renglonElement.getBoundingClientRect()

        // Calcular la posición actual del elemento relativa al scroll
        const elementTop = elementRect.top - containerRect.top + pentagramaDiv.value.scrollTop

        // Calcular la posición para centrar el elemento
        const containerHeight = pentagramaDiv.value.clientHeight
        const scrollTo = elementTop - containerHeight / 2 + elementRect.height / 2

        // Hacer scroll suave al elemento centrado
        pentagramaDiv.value.scrollTo({
          top: Math.max(0, scrollTo),
          behavior: 'smooth',
        })
      }
    }
  }, 50) // Pequeño delay para asegurar que el DOM se actualice
}

function styleDivTocar() {
  return {
    height: pantalla.getAltoPantalla() + 'px',
  }
}

const handleScroll = () => {
  if (pentagramaDiv.value) {
    scrollTop.value = pentagramaDiv.value.scrollTop // Actualiza la posición del scroll
  }
}

onMounted(() => {
  Actualizar()
  if (pentagramaDiv.value) {
    pentagramaDiv.value.addEventListener('scroll', handleScroll)
  }
})

function Actualizar() {
  cargarModos()
  
  const newDisplay = helper.creaDisplayPentagrama(props.cancion, modos.value, props.compasxRenglon)
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

// Eliminar el evento de scroll cuando se desmonta el componente
onUnmounted(() => {
  if (pentagramaDiv.value) {
    pentagramaDiv.value.removeEventListener('scroll', handleScroll)
  }
})
</script>
<template>
  <div class="componenteMusical" ref="pentagramaDiv" :style="styleDivTocar()">
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

    <div v-for="(renglon, index) in display.renglones" :key="index" class="renglon-pentagrama">
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
