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
    compasEditable.iniciaparte = (i == 0) ? true : false
    if (contSecuencia < props.cancion.acordes.ordenPartes.length) {
      const parte = props.cancion.acordes.ordenPartes[contSecuencia]
      if (
        contAcordeEnSecuencia >=
        props.cancion.acordes.partes[parte].acordes.length
      ) {
        contSecuencia++
        contAcordeEnSecuencia = 0
        compasEditable.acorde = props.cancion.acordes.partes[parte].acordes[
          contAcordeEnSecuencia
        ]
        compasEditable.nroSecuencia = contSecuencia
        compasEditable.iniciaparte = true
      } else {
        compasEditable.acorde = props.cancion.acordes.partes[parte].acordes[
          contAcordeEnSecuencia
        ]        
        compasEditable.nroSecuencia = contSecuencia
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
        :class="{editdiv: true, comienzoparte: compas.iniciaparte, finparte: compas.finparte}"
        v-for="(compas, indexcompas) in renglon"
        :key="indexcompas"
      >
        <div>
          <strong>{{ compas.acorde }}</strong>
        </div>
        <div v-if="compas.letra.trim() != ''">
          {{ compas.letra }}
        </div>
        <div v-else>♪</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editdivconteiner {
  border: 1px solid;
  padding: 4px;
  width: auto;
  height: auto;
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
  padding: 0px;
  margin: 0px;
  width: 60px;
  height: 80px;
}
.comienzoparte {
  border-left: 8px solid;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.finparte {
  border-left: 8px solid;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
</style>
