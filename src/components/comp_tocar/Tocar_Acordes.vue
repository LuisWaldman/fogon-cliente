<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion'
import { watch } from 'vue'
import { VistaControl } from '../../modelo/VistaControl'

const props = defineProps<{
  compas: number
  cancion: Cancion
  vista: VistaControl
}>()

const mostrandoParte = ref(-1)
const mostrandoCompasParte = ref(-1)
const currentCompas = ref(0)

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
    currentCompas.value = newCompas
  },
)
</script>

<template>
  <div>
    <div v-for="(parte, index) in cancion.acordes.ordenPartes" :key="index">
      <div>{{ cancion.acordes.partes[parte].nombre }}</div>
      <div style="display: flex; flex-wrap: wrap">
        <div
          v-for="(aco, index_aco) in cancion.acordes.partes[parte].acordes"
          :key="index_aco"
          class="acorde"
          :style="{
            'max-height': vista.alto + 'px',
            width: vista.tamanioReferencia * 3 + 'px',
            'font-size': vista.tamanioReferencia + 'px',
          }"
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
  font-size: large;
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
