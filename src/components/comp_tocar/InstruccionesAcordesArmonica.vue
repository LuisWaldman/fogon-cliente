<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import { InstrumentoLineasCompasBuildHelperArmonica } from '../../modelo/instrucciones/InstrumentoLineasCompasBuildHelperArmonica'
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
const instrumento = ref<InstrumentoLineas>(
  InstrumentoLineas.GetHarmonicaEstandar(),
)

const escalaArmonica = ref('C');
function calcularCompaces(compas: number) {
  calcularAcordes(compas)
  compaces.value = []

  const newCompaces: InstrumentoLineasCompas[] = []
  for (let i = 0; i < acordes.value.length; i++) {
    const acordesSplit = acordes.value[i]
    newCompaces.push(
      InstrumentoLineasCompasBuildHelperArmonica.getAcorde(
        instrumento.value,
        acordesSplit,
        props.cancion.compasCantidad,
        escalaArmonica.value,
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
  calcularCompaces(props.compas)
})

</script>

<template>
  <div class="acordesArmonicoPantalla">
  <div>Armonica en: {{ escalaArmonica }}</div> 
    <div class="contenidoAcordes">
      <div class="compas" v-for="(compas, indexcm) in compaces" :key="indexcm">
        <div class="nombreCuerdas" v-if="indexcm === 0 || indexcm % 4 === 0">
          <div
            v-for="(cuerda, indexcu) in instrumento.nombreLinea"
            :key="indexcu"
          >
            ➖
          </div>
        </div>
        <div class="cuerdas">
          <div
            class="lineaCuerda"
            v-for="(lineaCuerda, indexcu) in compas.valorGolpePorLinea"
            :key="indexcu"
          >
            <span
              class="parteCompas"
              v-for="(valor, indexp) in lineaCuerda"
              :key="indexp"
            >
              {{ valor == '' ? '&nbsp;' : valor }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acordesArmonicoPantalla {
  display: flex;
  flex-direction: column;
  font-size: large;
}

.contenidoAcordes {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.compas {
  display: flex;
  flex-direction: row;
  gap: 5px;
  font-family: monospace;
}

.nombreCuerdas {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: monospace;
  font-weight: bold;
  padding-right: 5px;
}

.cuerdas {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lineaCuerda {
  display: flex;
  white-space: nowrap;
  position: relative;
}

.lineaCuerda::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background-color: currentColor;
  z-index: 1;
  pointer-events: none;
}

.parteCompas {
  display: inline-block;
  width: 3ch;
  text-align: center;
  position: relative;
  z-index: 2;
}
</style>
