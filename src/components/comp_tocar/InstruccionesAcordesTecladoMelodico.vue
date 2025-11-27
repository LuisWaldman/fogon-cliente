<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import { InstrumentoLineasCompasBuildHelperArmonica } from '../../modelo/instrucciones/InstrumentoLineasCompasBuildHelperArmonica'
import type { InstrumentoLineasCompas } from '../../modelo/instrucciones/InstrumentoLineasCompas'
import { InstrumentoLineas } from '../../modelo/instrucciones/InstrumentoLineas'
import { InstrumentoTeclasCompasBuildHelper } from '../../modelo/instrucciones/InstrumentoTeclasCompasBuildHelper'
import type { AcordesTeclasArmonico } from '../../modelo/instrucciones/AcordesTeclasArmonico'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const acordes = ref([] as string[])
const compaces = ref([] as AcordesTeclasArmonico[])
const todosAcordes = ref(props.cancion.acordes.GetTodosLosAcordes() as string[])

function calcularAcordes(compas: number) {
  acordes.value = []
  const desdeCompas = compas > 0 ? compas : 0

  for (let i = desdeCompas; i < todosAcordes.value.length; i++) {
    const acordesSplit = todosAcordes.value[i].split(' ')
    acordes.value.push(...acordesSplit)
    if (acordes.value.length > 4) {
      acordes.value = acordes.value.slice(0, 4)
      return
    }
  }
}
const instrumento = ref<InstrumentoLineas>(
  InstrumentoLineas.GetGuitarraEstandar(),
)
const desdeNota = ref(0)
const hastaNota = ref(15)
const muestraNotas = ref([] as string[])
function calcularNotas() {
  const notas: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  for (let i = desdeNota.value; i <= hastaNota.value; i++) {
    const nota = notas[i % 12]
    const octava = Math.floor(i / 12)
    muestraNotas.value.push(`${nota}${octava}`)
  }
}
function calcularCompaces(compas: number) {
  calcularAcordes(compas)
  compaces.value = []

  const newCompaces: AcordesTeclasArmonico[] = []
  for (let i = 0; i < acordes.value.length; i++) {
    const acordesSplit = acordes.value[i]
    newCompaces.push(
      InstrumentoTeclasCompasBuildHelper.getAcorde(
        acordesSplit,
        props.cancion.compasCantidad * 2,
      ),
    )
  }
  compaces.value = newCompaces
}

watch(
  () => props.cancion,
  (cancion: Cancion) => {
    todosAcordes.value = cancion.acordes.GetTodosLosAcordes()
    calcularCompaces(props.compas)
  },
)

watch(
  () => props.compas,
  (newCompas) => {
    calcularCompaces(newCompas)
  },
)
onMounted(() => {
  calcularNotas()
  calcularCompaces(props.compas)
})
</script>

<template>
  <div class="instrucciones">
    <div class="notasTecladoMelodico">
      <div
        v-for="nota in muestraNotas"
        :key="nota"
        class="notaTecladoMelodico"
      >
        {{ nota }}
      </div>
    </div>

  </div>
  {{ compaces }}

</template>

<style scoped>
</style>
