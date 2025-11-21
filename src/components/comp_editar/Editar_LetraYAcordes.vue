<script setup lang="ts">
import { ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'

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
const Acordes = ref([] as string[][])
const CompasAcorde = ref([] as number[][])
const AcordesLeft = ref([] as number[][])
watch(
  () => props.cancion,
  (cancion: Cancion) => {
    ActualizarCancion(cancion)
  },
)

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
          moverScroll(nuevaPos)
          return
        }
      })
    })
  },
)

const CaracterxRenglon = 80 // Ancho promedio de un carácter en píxeles
const anchoCaracter = 10 // Ancho promedio de un carácter en píxeles
const editandoRenglon = ref(-1)
const editandoCaracter = ref(-1)

function clickEditarRenglon(event: MouseEvent, index: number) {
  editandoRenglon.value = index
  renglonTexto.value = renglones.value[index]

  // Calcular la posición del carácter basado en la posición del mouse
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = event.clientX - rect.left

  // Estimar la posición del carácter (usando el ancho promedio del carácter)
  const caracterPos = Math.round(clickX / anchoCaracter)
  editandoCaracter.value = Math.min(caracterPos, renglones.value[index].length)
  // Hacer focus en el input en el próximo tick
  setTimeout(() => {
    const doc = document.getElementById(
      `renglonInput${index}`,
    ) as HTMLInputElement
    if (doc) {
      doc.focus()
      doc.setSelectionRange(editandoCaracter.value, editandoCaracter.value)
    }
  }, 0)
}

function ActualizarCancion(cancion: Cancion) {
  renglones.value = []
  Acordes.value = []
  AcordesLeft.value = []
  CompasAcorde.value = []
  let renglonActual = ''
  let TodosAcordes = cancion.acordes.GetTodosLosAcordes()
  let indiceAcorde = 0
  let acordesActual: string[] = []
  let acordesLeftActual: number[] = []
  let compasActual: number[] = []
  cancion.letras.renglones.flat().forEach((renglon) => {
    if (indiceAcorde < TodosAcordes.length) {
      let acorde = TodosAcordes[indiceAcorde]
      acordesActual.push(acorde)
      acordesLeftActual.push(renglonActual.length * anchoCaracter)
      compasActual.push(indiceAcorde)
    } else {
      acordesActual.push('¿?')
      acordesLeftActual.push(renglonActual.length * anchoCaracter)
      compasActual.push(-1)
    }
    indiceAcorde++
    renglonActual += renglon
    // SI LLEGO A UN NUEVO RENGLON
    if (
      renglonActual.includes('/n') ||
      renglonActual.length > CaracterxRenglon
    ) {
      if (renglonActual.includes('/n')) {
        const parte = renglonActual.split('/n')
        renglonActual = parte[1] || ''
        renglones.value.push(parte[0])
      } else {
        const nuevoRenglon = renglonActual.slice(0, CaracterxRenglon)
        renglones.value.push(nuevoRenglon)
        renglonActual = renglonActual.slice(CaracterxRenglon)
      }

      Acordes.value.push(acordesActual)
      AcordesLeft.value.push(acordesLeftActual)
      CompasAcorde.value.push(compasActual)
      acordesActual = []
      acordesLeftActual = []
      compasActual = []

      if (renglonActual.trim().length > 0) {
        acordesActual = ['.']
        acordesLeftActual = [0]
        compasActual = [indiceAcorde - 1]
      }
    }
  })
  renglones.value.push(renglonActual)
  Acordes.value.push(acordesActual)
  AcordesLeft.value.push(acordesLeftActual)
  CompasAcorde.value.push(compasActual)

  // Si no termino todos los acordes, agrego un renglon vacío
  if (indiceAcorde < TodosAcordes.length) {
    renglonActual = ''
    acordesActual = []
    acordesLeftActual = []
    compasActual = []
    while (indiceAcorde < TodosAcordes.length) {
      acordesActual.push(TodosAcordes[indiceAcorde])
      renglonActual += '¿' + TodosAcordes[indiceAcorde] + '?'
      acordesLeftActual.push(renglonActual.length * anchoCaracter)
      compasActual.push(indiceAcorde)
      indiceAcorde++
    }

    renglones.value.push(renglonActual)
    Acordes.value.push(acordesActual)
    AcordesLeft.value.push(acordesLeftActual)
    CompasAcorde.value.push(compasActual)
  }
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
const renglonTexto = ref('')
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
        v-for="(renglon, index) in renglones"
        :key="index"
        :style="{ position: 'relative' }"
      >
        <div class="divletra" @mouseup="clickEditarRenglon($event, index)">
          <div v-if="index !== editandoRenglon">{{ renglon }}</div>
          <div v-if="index === editandoRenglon">&nbsp;</div>
        </div>

        <input
          v-if="index === editandoRenglon"
          :id="'renglonInput' + index"
          type="text"
          class="input-renglon"
          v-model="renglonTexto"
        />
        <div
          v-for="(acorde, acordeIndex) in Acordes[index]"
          :style="{
            position: 'absolute',
            left: AcordesLeft[index][acordeIndex] + 'px',
            top: '-30px',
          }"
          :key="acordeIndex"
          :class="{ en_compas: CompasAcorde[index][acordeIndex] === compas }"
          class="acordediv"
        >
          {{ acorde }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-renglon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: transparent;
  color: white;
  font-size: var(--tamanio-letra);
  border: none;
  outline: none;
}
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
