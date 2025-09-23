<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import { ResumenSecuencia } from '../../modelo/cancion/ResumenSecuencia'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino';
import { useAppStore } from '../../stores/appStore';

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

onMounted(() => {
  Actualizar(props.cancion)
})

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

  <div style="display: flex; flex-wrap: wrap">
    <div
      v-for="(parte, index) in resumenSecuencia.resumenPartes"
      :key="index"
      class="secuencia"
    >
      <div>
        <span
          style="color: #a9a8f6; font-size: small"
          :class="{
            compas_actual: resumenSecuencia.parte === index,
          }"
          >{{ cancion.acordes.partes[parte.parteId].nombre }}</span
        >

        <div class="repeticion" v-if="parte.cantPartes > 1">
          <span v-if="resumenSecuencia.parte === index"
            >&nbsp;{{ resumenSecuencia.repeticionparte + 1 }} /
            {{ parte.cantPartes }}</span
          ><span v-else>&nbsp; x {{ parte.cantPartes }}</span>
        </div>
      </div>
      <div class="ordendiv">
        <span
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
        </span>
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
