<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import { Pantalla } from '../../modelo/pantalla'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const mostrandoParte = ref(-1)
const mostrandoCompasParte = ref(-1)
const currentCompas = ref(0)

const pantalla = new Pantalla()
function styleDivTocar() {
  return {
    height: pantalla.getAltoPantalla() + 'px',
  }
}
watch(
  () => props.compas,
  (newCompas) => {
    let totalCompases = 0
    for (let i = 0; i < props.cancion.acordes.ordenPartes.length; i++) {
      let compasesxparte =
        props.cancion.acordes.partes[props.cancion.acordes.ordenPartes[i]]
          .acordes.length
      if (newCompas < totalCompases + compasesxparte) {
        mostrandoParte.value = i
        mostrandoCompasParte.value = newCompas - totalCompases
        break
      }
      totalCompases += compasesxparte
    }

    const tamanioLetra = pantalla.getConfiguracionPantalla().tamanioAcordesolo
    let ve = mostrandoParte.value * tamanioLetra * 2.8
    ve -= tamanioLetra * 0
    const nuevaPos = Math.max(ve, 0)
    moverScroll(nuevaPos)

    currentCompas.value = newCompas
  },
)

const letraDiv = ref<HTMLElement | null>(null) // Ref to the div
function moverScroll(posX: number) {
  letraDiv.value?.scrollTo({ top: posX, behavior: 'smooth' })
}
</script>

<template>
  <div ref="letraDiv" class="overflow-auto divDeLetra" :style="styleDivTocar()">
    <div v-for="(parte, index) in cancion.acordes.ordenPartes" :key="index">
      <div>{{ cancion.acordes.partes[parte].nombre }}</div>
      <div style="display: flex; flex-wrap: wrap">
        <div
          v-for="(aco, index_aco) in cancion.acordes.partes[parte].acordes"
          :key="index_aco"
          class="acorde"
          :class="{
            compas_actual:
              mostrandoParte === index && mostrandoCompasParte === index_aco,
          }"
        >
          {{ aco }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.divDeLetra {
  scrollbar-color: black transparent;
  scrollbar-width: thin;
}

.read-the-docs {
  color: #888;
}

.parte {
  display: flex;
  margin: 1px;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
}
.acorde {
  font-size: var(--tamanio-acordesolo);
  margin: 1px;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
  color: #a9a8f6;
  margin-right: 10px;
}
.ordenparte {
  border: 1px solid #888;
  width: 25%;
}

.compas_actual {
  background-color: red;
  color: white;
}
</style>
