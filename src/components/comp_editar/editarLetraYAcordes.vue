<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { useAppStore } from '../../stores/appStore'
import { CompasEditable } from './compaseditable'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const compaces = ref<CompasEditable[][]>([])
const refParteSeleccionada = ref<number>(-1)
function seleccionarParte(compas: CompasEditable) {
  refParteSeleccionada.value = compas.nroSecuencia
}
function calcularCompaces() {
  const appStore = useAppStore()
  console.log('EditarLetraYAcordes mounted with compas:', appStore.compas)
  let renglon = []
  let renglones = []
  let letra = props.cancion.letras.GetTodosLosRenglones()
  console.log('letra:', letra)
  let cont = 0
  let contSecuencia = 0
  let contAcordeEnSecuencia = 0

  for (let i = 0; i < letra.length; i++) {
    const compasEditable = new CompasEditable()
    compasEditable.iniciaparte = i == 0 ? true : false
    if (contSecuencia < props.cancion.acordes.ordenPartes.length) {
      const parte = props.cancion.acordes.ordenPartes[contSecuencia]
      if (
        contAcordeEnSecuencia >=
        props.cancion.acordes.partes[parte].acordes.length
      ) {
        // Marcar el compas anterior como término de parte
        if (renglon.length > 0) {
          renglon[renglon.length - 1].terminaparte = true
        }
        contSecuencia++
        contAcordeEnSecuencia = 0
        compasEditable.acorde =
          props.cancion.acordes.partes[parte].acordes[contAcordeEnSecuencia]
        compasEditable.nroSecuencia = contSecuencia
        compasEditable.iniciaparte = true
      } else {
        compasEditable.acorde =
          props.cancion.acordes.partes[parte].acordes[contAcordeEnSecuencia]
        compasEditable.nroSecuencia = contSecuencia
        compasEditable.terminaparte =
          contAcordeEnSecuencia ===
          props.cancion.acordes.partes[parte].acordes.length - 1
            ? true
            : false
        contAcordeEnSecuencia++
      }

      compasEditable.letra = letra[i]
      renglon.push(compasEditable)
      cont++

      if (letra[i].includes('/n')) {
        renglones.push(renglon)
        renglon = []
      } else {
      }
    }
  }
  // Marcar el último compas como término de parte
  if (renglon.length > 0) {
    renglon[renglon.length - 1].terminaparte = true
  }
  renglones.push(renglon)
  compaces.value = renglones
}

onMounted(() => {
  calcularCompaces()
})
</script>
<template>
  <div class="editdivconteiner">
    <div
      class="editrenglon"
      v-for="(renglon, indexrenglon) in compaces"
      :key="indexrenglon"
    >
      <div
        :class="{
          editdiv: true,
          comienzoparte: compas.iniciaparte,
          finparte: compas.terminaparte,
          editandoSecuencia: refParteSeleccionada === compas.nroSecuencia,
        }"
        v-for="(compas, indexcompas) in renglon"
        :key="indexcompas"
        @click="seleccionarParte(compas)"
      >
        <div class="acordediv">
          {{ compas.acorde }}
        </div>
        <div v-if="compas.letra.trim() != ''" class="divletra">
          {{ compas.letra }}
        </div>
        <div class="divletra" v-else>♪</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editdivconteiner {
  border: 1px solid;
  padding: 4px;
  width: 100%;
  height: auto;
}

.acordediv {
  font-size: var(--tamanio-acorde);
  margin: 1px;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
  margin-right: 4px;
}

.editrenglon {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0px;
  margin-bottom: 14px;
}
.editdiv {
  border: 1px solid;
  border-top: 5px solid rgb(189, 139, 98);
  padding: 4px;
  overflow: hidden;
  margin: 0px;
  height: 80px;
}
.comienzoparte {
  border-left: 8px solid;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.editandoSecuencia {
  border-top: 2px solid rgb(255, 0, 0);
}
.divletra {
  font-size: var(--tamanio-letra);
  color: white;
  width: max-content;
  min-width: 100%;
}

.finparte {
  border-right: 8px solid;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-right: 2px;
}
</style>
