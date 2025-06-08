<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion'
import { watch } from 'vue'
import Acorde from './Acorde.vue'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const acordes = ref([] as string[])
const todosAcordes = ref([] as string[])

function calcularAcordes(compas: number) {
  acordes.value = []
  const desdeCompas = compas > 0 ? compas : 0
  console.log('Calculando acordes desde compas:', desdeCompas)

  for (let i = desdeCompas; i < todosAcordes.value.length; i++) {
    console.log('Calculando acordes para compas:', i, todosAcordes.value[i])
    const acordesSplit = todosAcordes.value[i].split(' ')
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
    todosAcordes.value = cancion.acordes.GetTodosLosAcordes()
    calcularAcordes(props.compas)
  },
)

watch(
  () => props.compas,
  (newCompas) => {
    console.log('Compas cambiado:', newCompas)
    calcularAcordes(newCompas)
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
