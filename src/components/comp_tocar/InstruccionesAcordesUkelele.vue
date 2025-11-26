<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import AcordeUkelele from './AcordeUkelele.vue'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const acordes = ref([] as string[])
const todosAcordes = ref(props.cancion.acordes.GetTodosLosAcordes() as string[])

function calcularAcordes(compas: number) {
  acordes.value = []
  const desdeCompas = compas > 0 ? compas : 0

  for (let i = desdeCompas; i < todosAcordes.value.length; i++) {
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
    calcularAcordes(newCompas)
  },
)

onMounted(() => {
  calcularAcordes(props.compas)
})
</script>

<template>
  <div class="acordesPantalla">
    <AcordeUkelele
      :acorde="acorde"
      v-for="(acorde, index) in acordes"
      :key="index"
      class="acordediv"
    ></AcordeUkelele>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.acordesPantalla {
  display: flex;
  flex-wrap: wrap;
}

.acordediv {
  font-size: var(--tamanio-acorde-parte);
  margin: 1px;
  min-width: 100px;
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
