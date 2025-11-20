<script setup lang="ts">
import { ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'
import { Display } from '../../modelo/display/display'
import { HelperDisplay } from '../../modelo/display/helperDisplay'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import { useAppStore } from '../../stores/appStore'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()
const pantalla = new Pantalla()
const configuracionPantalla = pantalla.getConfiguracionPantalla()
const letraDiv = ref<HTMLElement | null>(null) // Ref to the div
const renglones = ref([] as string[])
const displayRef = ref(new Display(configuracionPantalla.columnas))
const helperNombreAcordes = HelperDisplayAcordesLatino.getInstance()
const appStore = useAppStore()
helperNombreAcordes.latino = appStore.perfil.CifradoLatino

const emit = defineEmits(['clickCompas'])
function clickCompas(compas: number) {
  emit('clickCompas', compas)
}
watch(
  () => props.cancion,
  (cancion: Cancion) => {
    ActualizarCancion(cancion)
  },
)
const helperDisplay = new HelperDisplay()
function ActualizarCancion(cancion: Cancion) {
  displayRef.value = helperDisplay.getDisplay(
    cancion,
    configuracionPantalla.columnas,
  )
}



watch(
  () => props.compas,
  () => {
    const configPantalla = pantalla.getConfiguracionPantalla()
    if (configPantalla.AutoScroll === false) return
    
    // Centrar el texto que está sonando usando el DOM
    scrollToCurrentChord()
  },
)

function scrollToCurrentChord() {
  // Usar setTimeout para asegurar que el DOM se haya actualizado
  setTimeout(() => {
    if (!letraDiv.value) return

    // Buscar el elemento que está actualmente sonando
    const currentElement = letraDiv.value.querySelector('.en_compas')

    if (currentElement) {
      // Obtener la posición del elemento relativa al contenedor
      const containerRect = letraDiv.value.getBoundingClientRect()
      const elementRect = currentElement.getBoundingClientRect()

      // Calcular la posición actual del elemento relativa al scroll
      const elementTop =
        elementRect.top - containerRect.top + letraDiv.value.scrollTop

      // Calcular la posición para centrar el elemento
      const containerHeight = letraDiv.value.clientHeight
      const scrollTo = elementTop - containerHeight / 2 + elementRect.height / 2

      // Hacer scroll suave al elemento centrado
      letraDiv.value.scrollTo({
        top: Math.max(0, scrollTo),
        behavior: 'smooth',
      })
    }
  }, 50) // Pequeño delay para asegurar que el DOM se actualice
}

function styleDivTocar() {
  return {
    height: pantalla.getAltoPantalla() + 'px',
  }
}
let yaActualizado = false
function Actualizado() {
  if (yaActualizado) return false
  yaActualizado = true
  if (
    props.cancion.letras.renglones.length > 0 &&
    renglones.value.length === 0
  ) {
    ActualizarCancion(props.cancion)
  }
  return false
}
function Actualizar() {
  ActualizarCancion(props.cancion)
}

defineExpose({ Actualizar })
</script>
<template>
  <div>
    <div v-if="Actualizado()">.. No cargada ..</div>
    <div
      style="position: relative"
      class="componenteMusical"
      :style="styleDivTocar()"
      ref="letraDiv"
    >
      <div
        v-for="(verso, index) in displayRef.Versos"
        :key="index"
        style="position: relative"
      >
        <div
          class="renglonDisplay"
          v-for="(renglon, index) in verso.renglonesDisplay"
          :key="index"
          :style="{ position: 'relative' }"
        >
          <div class="divletra" style="display: flex">
            <div
              v-for="(parte, parteIndex) in renglon.partes"
              :class="{ en_compas: parte.compas === compas }"
              :key="parteIndex"
              @click="clickCompas(parte.compas)"
            >
              {{ parte.contenido }}
            </div>
          </div>

          <div
            v-for="(acorde, acordeIndex) in renglon.acordes"
            :style="{
              'z-index': '-1',
              position: 'absolute',
              left: acorde.left + 'px',
              top: '-20px',
            }"
            @click="clickCompas(acorde.compas)"
            :key="acordeIndex"
            :class="{ en_compas: acorde.compas === compas }"
            class="acordediv"
          >
            {{ helperNombreAcordes.GetAcorde(acorde.contenido) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resumen {
  position: absolute;
  top: 20px;
  left: 5%;
}
.componenteMusical {
  padding-top: 30px;
  width: 100%;
  height: 100%;
  scrollbar-color: black transparent;
  scrollbar-width: thin;
  overflow-y: scroll;
  overflow-x: hidden;
}
.divletra {
  font-size: var(--tamanio-letra);
  color: white;
  margin-bottom: 25px;
  width: max-content;
  min-width: 100%;
}
.acordediv {
  font-size: var(--tamanio-acorde);
  margin: 1px;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
  margin-right: 4px;
}

.en_compas {
  color: rgb(121, 102, 233);
}

.acordediv.en_compas {
  color: rgb(194, 6, 6) !important;
  font-weight: bold;
  border: 1px solid rgb(194, 6, 6);
  background-color: white;
}

.renglonDisplay {
  z-index: 10;
}
</style>
