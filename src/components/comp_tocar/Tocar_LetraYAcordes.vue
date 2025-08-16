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
const letraDiv = ref<HTMLElement | null>(null) // Ref to the div
const mostrandoParte = ref(-1)
const mostrandoCompasParte = ref(-1)
const currentCompas = ref(0)
const renglones = ref([] as string[])
const CompasAcorde = ref([] as number[][])
const displayRef = ref(new Display(20))

watch(
  () => props.cancion,
  (cancion: Cancion) => {
    ActualizarCancion(cancion)
  },
)
const helperDisplay = new HelperDisplay()
function ActualizarCancion(cancion: Cancion) {
  displayRef.value = helperDisplay.getDisplay(cancion, 20)
}

function CalcularResaltado(newCompas: number) {
  let totalCompases = 0
  for (let i = 0; i < props.cancion.acordes.ordenPartes.length; i++) {
    let compasesxparte =
      props.cancion.acordes.partes[props.cancion.acordes.ordenPartes[i]].acordes
        .length
    if (newCompas < totalCompases + compasesxparte) {
      mostrandoParte.value = i
      mostrandoCompasParte.value = newCompas - totalCompases
      break
    }
    totalCompases += compasesxparte
  }
  currentCompas.value = newCompas
}

watch(
  () => props.compas,
  (newCompas) => {
    CalcularResaltado(newCompas)
    renglones.value.forEach((_renglon, index) => {
      CompasAcorde.value[index].forEach((compas) => {
        if (compas === newCompas) {
          // Scroll to the div if it's in the current view

          const configuracionPantalla = pantalla.getConfiguracionPantalla()
          const tamanioLetra = configuracionPantalla.tamanioLetra
          const tamanioAcorde = configuracionPantalla.tamanioAcorde
          const factorScroll = configuracionPantalla.factorScroll // Usar la nueva propiedad
          let ve = index * (tamanioLetra + tamanioAcorde) * factorScroll
          ve -= (tamanioLetra + tamanioAcorde) * 10
          const nuevaPos = Math.max(ve, 0)
          console.log(`Scrolling to ${nuevaPos}px`)
          moverScroll(nuevaPos)
          return
        }
      })
    })
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
        v-for="(renglon, index) in verso.renglonesDisplay"
        :key="index"
        :style="{ position: 'relative' }"
      >
        <div class="divletra">{{ renglon.contenido }}</div>
        <div
          v-for="(acorde, acordeIndex) in renglon.acordes"
          :style="{
            position: 'absolute',
            left: acorde.left + 'px',
            top: '-30px',
          }"
          :key="acordeIndex"
          :class="{ en_compas: acorde.compas === compas }"
          class="acordediv"
        >
          {{ acorde.contenido }}
        </div>
      </div>
    </div></div>
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
  margin-bottom: 40px;
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
</style>
