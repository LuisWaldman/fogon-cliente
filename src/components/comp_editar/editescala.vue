<script lang="ts" setup>
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { useAppStore } from '../../stores/appStore'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'

defineProps<{
  cancion: Cancion
}>()

const toEscala = ref('')
const desdeEscala = ref('')
const esMenor = ref(false)
const appStore = useAppStore()
const cambiandoEscalaEstado = ref('')
const cambiandoModo = ref(false)
const NotasPosicionadasEscala = ref([] as string[][])
const Escala = ref([] as string[])
const labelGradosEscala = ref(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'])

const helperMuisca = new MusicaHelper()
const TodasLasNotas = ref(helperMuisca.GetNotas())
function clickCambiarEscala() {
  if (cambiandoEscalaEstado.value == '') {
    if (appStore.editandocancion.escala) {
      desdeEscala.value = appStore.editandocancion.escala
      if (desdeEscala.value.includes('m')) {
        esMenor.value = true
        desdeEscala.value = desdeEscala.value.replace('m', '')
      }
      // Obtener la escala de acordes basada en la escala actual
      Escala.value = helperMuisca.GetAcordesdeescala(
        appStore.editandocancion.escala,
      )

      NotasPosicionadasEscala.value = helperMuisca.GetNotasPosicionadasEscala(
        appStore.editandocancion,
        Escala.value,
      )
      toEscala.value = desdeEscala.value
    } else {
      toEscala.value = 'C'
    }

    cambiandoEscalaEstado.value = 'cambiando'
  } else {
    cambiandoEscalaEstado.value = ''
  }
}

function cambiarModo() {
  cambiandoModo.value = !cambiandoModo.value
}

function changeToEscala() {
  if (toEscala.value) {
    cambiandoEscalaEstado.value = ''
  }
}
</script>

<template>
  <div>
    <span class="lblCabecera">Escala {{ cancion.escala }}</span>
    <span class="lblCabecera" @click="clickCambiarEscala">[cambiar]</span>
  </div>
  <div v-if="cambiandoEscalaEstado == 'cambiando'">
    <table style="border-collapse: collapse; width: 100%">
      <thead>
        <tr>
          <th></th>
          <th v-for="(nota, index) in Escala" :key="index">
            {{ labelGradosEscala[index] }} - {{ nota }}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Notas</td>
          <td v-for="(nota, index) in NotasPosicionadasEscala" :key="index">
            <span v-for="(notaPosicionada, posIndex) in nota" :key="posIndex">
              {{ notaPosicionada }}
            </span>
          </td>
        </tr>

        <tr>
          <td>
            <select v-model="toEscala" @change="changeToEscala">
              <option
                v-for="(nota, index) in TodasLasNotas"
                :key="index"
                :value="nota"
              >
                {{ nota }}
              </option>
            </select>
          </td>
          <td>a</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped></style>
