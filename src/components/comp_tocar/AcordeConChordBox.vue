<script setup lang="ts">
//import ChordBox from 'vexchords'
import { onMounted, ref } from 'vue'
//import { AcordesGuitarraHelper } from '../../modelo/GuitarAcordes'

const props = defineProps<{
  acorde: string
}>()

const controlDiv = ref<HTMLElement | null>(null) // Ref to the div

console.log('Acorde.vue', props.acorde)

onMounted(() => {
  const selector = 'ponerAcorde' + Math.floor(Math.random() * 10000000)
  const div = document.createElement('div')
  div.id = selector
  controlDiv.value?.appendChild(div)
  /*
  const chord = new ChordBox('#' + selector, {
    // Customizations (all optional, defaults shown)
    width: 100, // canvas width
    height: 120, // canvas height
    circleRadius: 5, // circle radius (width / 20 by default)

    numStrings: 6, // number of strings (e.g., 4 for bass)
    numFrets: 5, // number of frets (e.g., 7 for stretch chords)
    showTuning: true, // show tuning keys

    defaultColor: '#666', // default color
    bgColor: '#FFF', // background color
    strokeColor: '#666', // stroke color (overrides defaultColor)
    textColor: '#666', // text color (overrides defaultColor)
    stringColor: '#666', // string color (overrides defaultColor)
    fretColor: '#666', // fret color (overrides defaultColor)
    labelColor: '#666', // label color (overrides defaultColor)

    fretWidth: 1, // fret width
    stringWidth: 1, // string width
  })
  chord.draw(AcordesGuitarraHelper.getAcorde(props.acorde))
  /*
  chord.draw({
    // array of [string, fret, label (optional)]
    chord: [
      [1, 3],
      [2, 2],
      [3, 1],
      [4, 0], // fret 0 = open string
      [5, 'x'], // fret x = muted string
      [6, 'x'],
    ],

    // optional: position marker
    position: 0, // start render at fret 5

    // optional: barres for barre chords
    barres: [
      //{ fromString: 6, toString: 1, fret: 0 },
      //{ fromString: 5, toString: 3, fret: 3 },
    ],

    // optional: tuning keys
    // tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  })*/
})
</script>

<template>
  <div>
    <div id="divponerAcorde" ref="controlDiv"></div>
    <div class="">{{ acorde }}</div>
  </div>
</template>

<style scoped>
.acordesPantalla {
  color: red;
  font-size: 200px;
}
</style>
