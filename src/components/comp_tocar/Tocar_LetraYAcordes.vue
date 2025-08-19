<script setup lang="ts">
import { ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'
import { Display } from '../../modelo/display/display'
import { HelperDisplay } from '../../modelo/display/helperDisplay'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()
const pantalla = new Pantalla()
const configuracionPantalla = pantalla.getConfiguracionPantalla()
const letraDiv = ref<HTMLElement | null>(null) // Ref to the div
const renglones = ref([] as string[])
const displayRef = ref(new Display(20))

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

function CalcularRenglon(newCompas: number): number {
  let renglon = 0
  let encontrado = false
  for (let i = 0; i < displayRef.value.Versos.length; i++) {
    const verso = displayRef.value.Versos[i]
    for (let j = 0; j < verso.renglonesDisplay.length; j++) {
      for (let k = 0; k < verso.renglonesDisplay[j].partes.length; k++) {
        const partes = verso.renglonesDisplay[j].partes[k]
        if (partes.compas === newCompas) {
          encontrado = true
          return renglon < 3 ? 0 : renglon - 3
        }
      }
      renglon++
    }
    if (encontrado) break
  }
  return renglon
}

watch(
  () => props.compas,
  (newCompas) => {
    const renglon = CalcularRenglon(newCompas)
    console.log('Renglon:', renglon)

    const ScrollTo =
      renglon *
      (configuracionPantalla.tamanioLetra +
        configuracionPantalla.tamanioAcorde) *
      configuracionPantalla.factorScroll
    console.log('ScrollTo:', ScrollTo)
    moverScroll(ScrollTo)
  },
)

function moverScroll(posX: number) {
  letraDiv.value?.scrollTo({ top: posX, behavior: 'smooth' })
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
      <div v-for="(verso, index) in displayRef.Versos" :key="index">
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
              top: '-' + (configuracionPantalla.tamanioAcorde + 2) + 'px',
            }"
            :key="acordeIndex"
            :class="{ en_compas: acorde.compas === compas }"
            class="acordediv"
          >
            {{ acorde.contenido }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.componenteMusical {
  padding-top: 30px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
.divletra {
  font-size: var(--tamanio-letra);
  color: white;
  margin-bottom: var(--tamanio-acorde);
}

.en_compas {
  background-color: rgb(114, 72, 72);
  color: white;
}

.acordediv {
  font-size: var(--tamanio-acorde);
  margin: 1px;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
  margin-right: 4px;
}
.renglonDisplay {
  z-index: 10;
}
</style>
