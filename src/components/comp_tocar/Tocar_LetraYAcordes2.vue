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
          :style="{
            position: 'relative',
            paddingTop: '30px',
            minHeight: '60px',
          }"
        >
          <!-- Contenedor para acordes con altura fija -->
          <div class="acordes-container">
            <div
              v-for="(acorde, acordeIndex) in renglon.acordes"
              :style="{
                position: 'absolute',
                left: acorde.left + 'px',
                top: '0px',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                minWidth: '20px',
              }"
              @click="clickCompas(acorde.compas)"
              :key="acordeIndex"
              :class="{ en_compas: acorde.compas === compas }"
              class="acordediv"
            >
              {{ helperNombreAcordes.GetAcorde(acorde.contenido) }}
            </div>
          </div>

          <!-- Contenedor para letras -->
          <div
            class="divletra"
            style="display: flex; position: relative; z-index: 1"
          >
            <div
              v-for="(parte, parteIndex) in renglon.partes"
              :class="{ en_compas: parte.compas === compas }"
              :key="parteIndex"
              @click="clickCompas(parte.compas)"
              :style="{ position: 'relative' }"
            >
              {{ parte.contenido }}
            </div>
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
.renglonDisplay {
  z-index: 10;
  margin-bottom: 15px;
}

.acordes-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  z-index: 2;
}

.divletra {
  font-size: var(--tamanio-letra);
  color: white;
  width: max-content;
  min-width: 100%;
  margin-top: 5px;
}

.acordediv {
  font-size: var(--tamanio-acorde);
  padding: 2px 4px;
  border-radius: 3px;
  display: inline-block;
  color: #a9a8f6;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
  line-height: 1.2;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.en_compas {
  color: rgb(121, 102, 233);
}

.acordediv.en_compas {
  color: rgb(194, 6, 6) !important;
  font-weight: bold;
  border: 1px solid rgb(194, 6, 6);
  background-color: white;
  z-index: 3;
}
</style>
