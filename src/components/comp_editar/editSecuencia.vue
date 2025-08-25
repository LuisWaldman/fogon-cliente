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
const mostrandoCompasparte = ref(-1)
const currentCompas = ref(0)
const viendoSecuencia = ref(-1)
const viendoRepSecuencia = ref(0)

const mostrandoParte = ref(-1)
const emit = defineEmits(['cambioCompas'])
const viendoParte = ref(false)
const parte = ref(null as Parte | null)
function cambiarCompas(compas: number) {
  emit('cambioCompas', compas)
  //currentCompas.value = compas
}

const secuResu = ref([] as number[])
const reperesu = ref([] as number[])
const desdeacorde = ref([] as number[])

const mostrandoResumenParteIndex = ref(-1)
const mostrandoResumenParte = ref(-1)

watch(
  () => props.cancion,
  (newCancion) => {
    ActualizarCancion(newCancion)
  },
)

function ActualizarCancion(cancion: Cancion) {
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
      ActualizarCancion(props.cancion)
    }
  }
  return false
}

watch(
  () => props.compas,
  (newCompas) => {
    console.log("CCompas", newCompas)
    let totalCompases = 0
    for (let i = 0; i < props.cancion.acordes.ordenPartes.length; i++) {
      let compasesxparte =
        props.cancion.acordes.partes[props.cancion.acordes.ordenPartes[i]]
          .acordes.length
      if (newCompas < totalCompases + compasesxparte) {
        mostrandoParte.value = i
        mostrandoCompasparte.value = newCompas - totalCompases
        console.log("UBICANDO", mostrandoParte.value, mostrandoCompasparte.value)
        break
      }
      totalCompases += compasesxparte
    }
    currentCompas.value = newCompas
    ActualizarCancion(props.cancion)
  },
)

ActualizarCancion(props.cancion)
function Actualizar() {
  ActualizarCancion(props.cancion)
}
function clickAcorde(acorde: number, index: number)
{
  mostrandoCompasparte.value = acorde
  mostrandoResumenParteIndex.value = index
  console.log("Cambiando compás a:", desdeacorde.value[index] + mostrandoCompasparte.value)
  cambiarCompas(
      desdeacorde.value[index] + mostrandoCompasparte.value,
    )
}



defineExpose({
  Actualizar,
})
</script>

<template>
  <div v-if="Actualizado()" @click="ActualizarCancion(props.cancion)">
    .. No cargada ..
    
  </div>
  {{ compas }} {{ currentCompas }}
  <div v-if="reperesu.length > 0">
    <div style="display: flex; flex-wrap: wrap">
      <div
        v-for="(parte, index) in secuResu"
        :key="index"
        class="secuencia"
        :class="{ secuencia_actual: viendoSecuencia === index }"
        
      >
              <div>
          <span
            style="color: #a9a8f6; font-size: small"
            :class="{
              compas_actual: mostrandoResumenParteIndex === index,
            }"
            >{{ cancion.acordes.partes[parte].nombre }}</span
          >
        <div class="repeticion" v-if="reperesu[index] > 1">
          <span v-if="mostrandoResumenParteIndex != index"
            >x {{ reperesu[index] }}</span
          >
          <span v-if="mostrandoResumenParteIndex == index"
            >{{ mostrandoResumenParte + 1 }} / {{ reperesu[index] }}</span
          >
        </div>
        </div>
        <div class="ordendiv">
          <span
            class="acordeSecuencia"
            v-for="(acorde, acordeIndex) in cancion.acordes.partes[parte]
              .acordes"
            :key="acordeIndex"
            @click="clickAcorde(acordeIndex, index)"
            :class="{ 'acordeSeleccionado': mostrandoCompasparte === acordeIndex && mostrandoResumenParteIndex === index }"
          >
          {{ acorde }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="viendoParte && parte !== null">
    <span style="font-size: large">Partes</span>
    <editarParte :parte="parte"></editarParte>
  </div>
  <div>
    <span style="font-size: large">Modificar:</span>
  </div>
</template>

<style scoped>

.read-the-docs {
  color: #292828;
}
.acordeSecuencia {
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
  border: 1px solid;
  border: 1px solid;
  color: rgb(202, 49, 49);
  font-size: large;
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
  background-color: rgb(190, 120, 120);
  color: rgb(54, 52, 52);
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
.secuencia_actual {
  background-color: #424141 !important;
}
</style>
