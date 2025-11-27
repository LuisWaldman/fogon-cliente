<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import { InstrumentoLineasCompasBuildHelper } from '../../modelo/instrucciones/InstrumentoLineasCompasBuildHelperHarmonica'
import type { InstrumentoLineasCompas } from '../../modelo/instrucciones/InstrumentoLineasCompas'
import { InstrumentoLineas } from '../../modelo/instrucciones/InstrumentoLineas'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const acordes = ref([] as string[])
const compaces = ref([] as InstrumentoLineasCompas[])
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
const instrumento = ref<InstrumentoLineas>(InstrumentoLineas.GetGuitarraEstandar())
  
function calcularCompaces(compas: number) {
  calcularAcordes(compas)
  compaces.value = []

  const newCompaces: InstrumentoLineasCompas[] = []
  for (let i = 0; i < acordes.value.length; i++) {
    const acordesSplit = acordes.value[i]
    newCompaces.push(
      InstrumentoLineasCompasBuildHelper.getAcorde(instrumento.value, acordesSplit, props.cancion.compasCantidad),
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
  calcularCompaces(props.compas)
})
</script>

<template>
  <div class="acordesArmonicoPantalla">
    <div class="nombreCuerdas">
      <div v-for="(cuerda, indexcu) in instrumento.notaLinea" :key="indexcu">{{ cuerda }}</div>
    </div>
    <div class="contenidoAcordes">
      
      <div class="compas" v-for="(compas, indexcm) in compaces" :key="indexcm">
        <div class="parteCompas" v-for="(parte, indexp) in compas.valorGolpePorLinea" :key="indexp">
          
      <div v-for="(cuerda, indexcu) in parte" :key="indexcu">
        
        {{ cuerda }}
      </div>

         

        </div>


      </div>
    </div>

    
    
  </div>
</template>

<style scoped>
.acordesArmonicoPantalla {
  display: flex;
}
.compas {
  display: flex;
  flex-direction: column;
}
.parteCompas {
  display: flex;
  flex-direction: row;
}
</style>
