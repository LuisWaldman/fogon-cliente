<script setup lang="ts">
import { ChordBox } from 'vexchords'
import { onMounted, ref, watch } from 'vue'
import { AcordesUkeleleHelper } from '../../modelo/instrucciones/AcordesUkeleleHelper'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import { useAppStore } from '../../stores/appStore'
import type { AcordesCuerdas } from '../../modelo/instrucciones/AcordesCuerdas'

const props = defineProps<{
  acorde: string
}>()

const controlDiv = ref<HTMLElement | null>(null)
const refAcorde = ref<AcordesCuerdas | null>(null)

const helper = HelperDisplayAcordesLatino.getInstance()
const appStore = useAppStore()
helper.latino = appStore.perfil.CifradoLatino

// Función para actualizar el acorde
const updateAcorde = () => {
  refAcorde.value = AcordesUkeleleHelper.getAcorde(props.acorde)
  drawChord()
}

const drawChord = () => {
  if (!controlDiv.value || !refAcorde.value) return

  // Limpiar el contenido anterior
  controlDiv.value.innerHTML = ''

  // Crear un ID único para el selector
  const selector = 'chord-' + Math.floor(Math.random() * 10000000)
  const div = document.createElement('div')
  div.id = selector
  controlDiv.value.appendChild(div)

  // Crear el ChordBox con VexFlow para ukelele (4 cuerdas)
  const chord = new ChordBox('#' + selector, {
    width: 100,
    height: 120,
    circleRadius: 5,
    numStrings: 4,
    numFrets: 4,
    showTuning: false,
    defaultColor: '#a9a8f6',
    bgColor: 'transparent',
    strokeColor: '#a9a8f6',
    textColor: '#a9a8f6',
    stringColor: '#a9a8f6',
    fretColor: '#a9a8f6',
    labelColor: '#a9a8f6',
    fretWidth: 1,
    stringWidth: 1,
  })

  // Convertir los datos de AcordesUkelele al formato de ChordBox
  const chordData: Array<[number, number | string]> = []
  const barres: Array<{ fromString: number; toString: number; fret: number }> =
    []

  // Las cuerdas en refAcorde.value.cuerda están en orden 1-4
  // ChordBox espera [string, fret] donde string va de 1 (más aguda) a 4 (más grave)
  refAcorde.value.cuerda.forEach((nota, index) => {
    const stringNumber = index + 1
    if (nota === 'x') {
      chordData.push([stringNumber, 'x'])
    } else {
      const fret = parseInt(nota)
      chordData.push([stringNumber, fret])
    }
  })

  // Si hay cejilla, agregarla
  if (refAcorde.value.cejilla && refAcorde.value.cejilla > 0) {
    // Encontrar el rango de cuerdas para la cejilla
    const fretCejilla = refAcorde.value.cejilla
    const cuerdasConCejilla = refAcorde.value.cuerda
      .map((nota, index) => ({ nota, index: index + 1 }))
      .filter(({ nota }) => parseInt(nota) === fretCejilla)

    if (cuerdasConCejilla.length > 1) {
      barres.push({
        fromString: cuerdasConCejilla[cuerdasConCejilla.length - 1].index,
        toString: cuerdasConCejilla[0].index,
        fret: fretCejilla,
      })
    }
  }

  chord.draw({
    chord: chordData,
    position: refAcorde.value.cejilla || 0,
    barres: barres,
  })
}

onMounted(() => {
  updateAcorde()
})

// Watch para detectar cambios en la prop acorde
watch(
  () => props.acorde,
  () => {
    updateAcorde()
  },
)
</script>

<template>
  <div class="divTocarAcorde">
    <div class="chord-name">{{ helper.GetAcorde(acorde) }}</div>
    <div ref="controlDiv"></div>
  </div>
</template>

<style scoped>
.divTocarAcorde {
  display: inline-block;
  text-align: center;
}
.chord-name {
  color: #a9a8f6;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}
</style>
