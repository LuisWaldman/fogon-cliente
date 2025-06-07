<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion'
import { watch } from 'vue'
import Acorde from './Acorde.vue'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const mostrandoParte = ref(-1)
const mostrandoCompasparte = ref(-1)

const acordes = ref([] as string[])
function calcularAcordes(cancion: Cancion) {
  acordes.value = []
  const parteIndex = mostrandoParte.value == -1 ? 0 : mostrandoParte.value
  const parte = cancion.acordes.partes[parteIndex]
  const desdeCompas =
    mostrandoCompasparte.value == -1 ? 0 : mostrandoCompasparte.value
  for (let i = desdeCompas; i < parte.acordes.length; i++) {
    const acordesSplit = parte.acordes[i].split(' ')
    acordes.value.push(...acordesSplit)

    acordes.value = [...new Set(acordes.value)]

    if (acordes.value.length > 4) {
      acordes.value = acordes.value.slice(0, 4)
      return
    }
  }
}

watch(
  () => props.cancion,
  (cancion: Cancion) => {
    calcularAcordes(cancion)
  },
)

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
        mostrandoCompasparte.value = newCompas - totalCompases
        calcularAcordes(props.cancion)

        break
      }
      totalCompases += compasesxparte
    }
  },
)
</script>

<template>
  <span style="font-size: large">Proximos Acordes</span>
  <div class="acordesPantalla">
    <Acorde
      :acorde="acorde"
      v-for="(acorde, index) in acordes"
      :key="index"
      class="acordediv"
    ></Acorde>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.acordesPantalla {
  display: flex;
}

.acordediv {
  font-size: var(--tamanio-acorde-parte);
  margin: 1px;
  padding: 5px;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
}

@media (max-width: 768px) {
  .acordediv {
    margin: 2px;
    padding: 2px;
    width: 40px;
    overflow: hidden;
    white-space: nowrap;
  }
}
.partediv {
  display: flex;
  flex-wrap: wrap;
}

.compas_actual {
  background-color: red;
  color: white;
}

.domi {
  color: #497aff;
}

/*
  Tonica
  color: #a9a8f6;
  Semi Dominante:
  color: blue;
  Dominante
  background-color: red;
*/
.repeticion {
  display: inline-block;
  margin: 4px;
}
.acordesPantalla {
}

.tituloSecuencia {
  font-size: 1em;
  color: #a9a8f6;
  margin-top: 10px;
}
</style>
