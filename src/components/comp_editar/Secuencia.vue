<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import type { Parte } from '../../modelo/cancion/acordes'

import editarParte from './editarParte.vue'
const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const mostrandoParte = ref(-1)
const mostrandoCompasparte = ref(-1)
const currentCompas = ref(0)
const viendoSecuencia = ref(0)
const viendoRepSecuencia = ref(0)

const emit = defineEmits(['cambioCompas'])
const viendoParte = ref(false)
const parte = ref(null as Parte | null)
function cambiarCompas(compas: number) {
  emit('cambioCompas', compas)
  currentCompas.value = compas
}

function clickSecuencia(secuencia: number) {
  viendoSecuencia.value = secuencia
  viendoRepSecuencia.value = 0
  viendoParte.value = true
  parte.value = props.cancion.acordes.partes[secuResu.value[secuencia]]

  cambiarCompas(desdeacorde.value[secuencia])
}

const secuResu = ref([] as number[])
const reperesu = ref([] as number[])
const desdeacorde = ref([] as number[])

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
  let newdesdeacorde: number[] = []
  let metiendo = -1
  let desdeCont = 0
  cancion.acordes.ordenPartes.forEach((element) => {
    if (metiendo != element) {
      newresu.push(element)
      newpartesresu.push(1)
      metiendo = element
      newdesdeacorde.push(desdeCont)
    } else {
      newpartesresu[newpartesresu.length - 1] += 1
    }
    desdeCont += cancion.acordes.partes[element].acordes.length
  })
  desdeacorde.value = newdesdeacorde
  secuResu.value = newresu
  reperesu.value = newpartesresu
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
    <span style="font-size: large">Secuencia</span>
    <div style="display: flex; flex-wrap: wrap">
      <div
        v-for="(parte, index) in secuResu"
        :key="index"
        class="secuencia"
        @click="clickSecuencia(index)"
      >
        <div class="ordendiv">
          <span
            :class="{
              compas_actual: mostrandoResumenParteIndex === index,
            }"
            >{{ cancion.acordes.partes[parte].nombre }}</span
          >
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
  <editarParte
    v-if="viendoParte && parte !== null"
    :parte="parte"
  ></editarParte>
  <div>
    <span style="font-size: large">Modificar:</span>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.secuencia {
  font-size: var(--tamanio-parte);
  display: flex;
  flex-wrap: wrap;
  border: 1px solid;
  margin: 1px;
  padding: 5px;
  border-radius: 5px;
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
