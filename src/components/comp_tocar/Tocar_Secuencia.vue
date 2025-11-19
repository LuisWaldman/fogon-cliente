<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import { ResumenSecuencia } from '../../modelo/cancion/ResumenSecuencia'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import { useAppStore } from '../../stores/appStore'
import { Pantalla } from '../../modelo/pantalla'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const resumenSecuencia = ref<ResumenSecuencia>(
  ResumenSecuencia.GetResumen(props.cancion),
)

function Actualizar(cancion: Cancion) {
  resumenSecuencia.value = ResumenSecuencia.GetResumen(cancion)
}

const ctrlSecuencia = ref<HTMLElement | null>(null) // Ref to the div

const pantalla = new Pantalla()
const configPantalla = pantalla.getConfiguracionPantalla()

function moverScroll(posX: number) {
  ctrlSecuencia.value?.scrollTo({ top: posX, behavior: 'smooth' })
}

onMounted(() => {
  Actualizar(props.cancion)
})
//  :style="EstiloSecuencia()" :ref="ctrlSecuencia">
function EstiloSecuencia() {
  return {
    height: configPantalla.anchoParte + 'px',
  }
}
watch(
  () => props.cancion,
  (newCancion) => {
    Actualizar(newCancion)
  },
)

watch(
  () => props.compas,
  (newCompas) => {
    resumenSecuencia.value?.ActualizarCompas(newCompas)

    if (configPantalla.AutoScroll) {
      //const total = resumenSecuencia.value.resumenPartes.length
      const enParte = resumenSecuencia.value.parte
      // Calcular la posición de scroll basada en la parte actual
      const positionY = enParte * configPantalla.tamanioAcordeParte * 2
      moverScroll(positionY)
    }
  },
)

let actualizadoAsk = false
function Actualizado() {
  if (actualizadoAsk) {
    actualizadoAsk = true
    Actualizar(props.cancion)
  }

  return false
}

Actualizar(props.cancion)

const helper = HelperDisplayAcordesLatino.getInstance()
const appStore = useAppStore()
helper.latino = appStore.perfil.CifradoLatino
</script>

<template>
  <div v-if="Actualizado()" @click="Actualizar(props.cancion)">
    .. No cargada ..
  </div>

  <div class="contSecuencia" :style="EstiloSecuencia()" ref="ctrlSecuencia">
    <div
      v-for="(parte, index) in resumenSecuencia.resumenPartes"
      :key="index"
      class="secuencia"
    >
      <div>
        <span
          class="nombreParte"
          :class="{
            compas_actual: resumenSecuencia.parte === index,
          }"
          >{{ cancion.acordes.partes[parte.parteId].nombre }}</span
        >
      </div>
      <div class="ordendiv">
        <div
          class="acordeSecuencia"
          v-for="(acorde, acordeIndex) in cancion.acordes.partes[parte.parteId]
            .acordes"
          :key="acordeIndex"
          :class="{
            acordeSeleccionado:
              resumenSecuencia.compasdeparte === acordeIndex &&
              resumenSecuencia.parte === index,
          }"
        >
          {{ helper.GetAcorde(acorde) }}
        </div>

        <div class="repeticion" v-if="parte.cantPartes > 1">
          <span v-if="resumenSecuencia.parte === index"
            >&nbsp;{{ resumenSecuencia.repeticionparte + 1 }} /
            {{ parte.cantPartes }}</span
          ><span v-else>&nbsp; x {{ parte.cantPartes }}</span>
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
  margin-right: 10px;
}

.contSecuencia {
  flex-wrap: wrap;
  overflow-y: scroll;
  scrollbar-color: black transparent;
  scrollbar-width: thin;
}
.secuencia {
  font-size: var(--tamanio-parte);
  flex-wrap: wrap;
}

.acordeSeleccionado {
  color: rgb(194, 6, 6) !important;
  font-weight: bold;
  border: 1px solid rgb(194, 6, 6);
  background-color: white;
}

.ordendiv {
  color: #a9a8f6;
  margin-right: 10px;
  display: flex;
  flex-wrap: wrap;
}

.tituloSecuencia {
  font-size: xx-large;
  color: #a9a8f6;
  margin-top: 10px;
}

.partediv {
  display: flex;
  flex-wrap: wrap;
}

.domi {
  color: #497aff;
}

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
.nombreParte {
  font-size: large;
  font-weight: bold;
}
</style>
