<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const mostrandoParte = ref(-1)
const mostrandoCompasparte = ref(-1)
const currentCompas = ref(0)

const secuResu = ref([] as number[])
const reperesu = ref([] as number[])

const mostrandoResumenParteIndex = ref(-1)
const mostrandoResumenParte = ref(-1)

watch(
  () => props.cancion,
  (newCancion) => {
    Actualizar(newCancion)
  },
)

function Actualizar(cancion: Cancion) {
  let newresu: number[] = []
  let newpartesresu: number[] = []
  let metiendo = -1
  cancion.acordes.ordenPartes.forEach((element) => {
    if (metiendo != element) {
      newresu.push(element)
      newpartesresu.push(1)
      metiendo = element
    } else {
      newpartesresu[newpartesresu.length - 1] += 1
    }
  })
  secuResu.value = newresu
  reperesu.value = newpartesresu
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
        mostrandoCompasparte.value = newCompas - totalCompases
        break
      }
      totalCompases += compasesxparte
    }
    currentCompas.value = newCompas
    calcularresumenparte()
  },
)

function calcularresumenparte() {
  if (reperesu.value.length == 0) {
    return
  }

  let cont = reperesu.value[0]
  let i = 0
  while (cont <= mostrandoParte.value) {
    i++
    cont += reperesu.value[i]
  }

  mostrandoResumenParteIndex.value = i
  mostrandoResumenParte.value =
    reperesu.value[i] - (cont - mostrandoParte.value)
}
let actualizadoAsk = false
function Actualizado() {
  if (reperesu.value.length == 0) {
    if (actualizadoAsk) {
      actualizadoAsk = true
      Actualizar(props.cancion)
    }
  }
  return false
}

Actualizar(props.cancion)
</script>

<template>
  <div v-if="Actualizado()" @click="Actualizar(props.cancion)">
    .. No cargada ..
  </div>
  <div v-if="reperesu.length > 0">
    <div style="display: flex; flex-wrap: wrap">
      <div v-for="(parte, index) in secuResu" :key="index" class="secuencia">
        <div>
          <span
            style="color: #a9a8f6; font-size: small"
            :class="{
              compas_actual: mostrandoResumenParteIndex === index,
            }"
            >{{ cancion.acordes.partes[parte].nombre }}</span
          >
        </div>
        <div class="ordendiv">
          <span
            class="acordeSecuencia"
            v-for="(acorde, acordeIndex) in cancion.acordes.partes[parte]
              .acordes"
            :key="acordeIndex"
            :class="{
              acordeSeleccionado:
                mostrandoCompasparte === acordeIndex &&
                mostrandoResumenParteIndex === index,
            }"
          >
            {{ acorde }}
          </span>
        </div>
        <div class="repeticion" v-if="reperesu[index] > 1">
          <span v-if="mostrandoResumenParteIndex != index"
            >x {{ reperesu[index] }}</span
          >
          <span v-if="mostrandoResumenParteIndex == index"
            >{{ mostrandoResumenParte + 1 }} / {{ reperesu[index] }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.acordeSecuencia {
  color: #a9a8f6;
  font-size: var(--tamanio-parte);
  margin-right: 5px;
}
.secuencia {
  font-size: var(--tamanio-parte);
  flex-wrap: wrap;
  border: 1px solid;
  margin: 1px;
  padding: 5px;
  border-radius: 5px;
}
.acordeSeleccionado {
  background-color: #a9a8f6;
  color: black;
}

.ordendiv {
  margin: 1px;
  padding: 5px;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
  margin-right: 10px;
}

.acordediv {
  font-size: var(--tamanio-acorde-parte);
  margin: 1px;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;

  margin-right: 10px;
}

.tituloSecuencia {
  font-size: xx-large;
  color: #a9a8f6;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .ordendiv {
    margin: 2px;
    width: 30px;
    overflow: hidden;
    white-space: nowrap;
  }
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
  border: 1px solid;
  padding: 10px;
  border-radius: 2%;
}

.tituloSecuencia {
  color: #a9a8f6;
  margin-top: 10px;
}
</style>
