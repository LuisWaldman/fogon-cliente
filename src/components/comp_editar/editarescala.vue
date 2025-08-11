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
const NotasPosicionadasEscala = ref([] as string[][])
const Escala = ref([] as string[])
const NuevaEscala = ref([] as string[])
const labelGradosEscala = ref(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'])
const NuevasNotasPosicionadasEscala = ref([] as string[][])

const helperMuisca = new MusicaHelper()
const TodasLasNotas = ref(helperMuisca.GetNotas())
function clickCambiarEscala() {
  
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

  
}
clickCambiarEscala()
function changeToEscala() {
  let nota = toEscala.value
  if (esMenor.value) {
    nota += 'm'
  }
  NuevaEscala.value = helperMuisca.GetAcordesdeescala(nota)
  NuevasNotasPosicionadasEscala.value =
    helperMuisca.GetNotasPosicionadasNuevaEscala(
      NotasPosicionadasEscala.value,
      Escala.value,
      NuevaEscala.value,
    )
}

const emit = defineEmits(['cerrar'])
function clickCancelarCambiarEscala() {
  emit('cerrar')
}
function clickConfirmarCambiarEscala() {
  helperMuisca.ActualizarEscala(
    appStore.editandocancion,
    Escala.value,
    NuevaEscala.value,
  )
  emit('cerrar')
}
</script>
<template>
  <div>
    <span
      class="lblCabecera"
      @click="clickCancelarCambiarEscala"
      >[cancelar]</span
    >
    <span
      class="lblCabecera"
      v-if="toEscala != desdeEscala"
      @click="clickConfirmarCambiarEscala"
      >[confirmar]</span
    >
  </div>
  <div >
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
            <span
              class="notaPosicionada"
              v-for="(notaPosicionada, posIndex) in nota"
              :key="posIndex"
            >
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

          <td v-for="(nota, index) in NuevaEscala" :key="index">
            {{ labelGradosEscala[index] }} - {{ nota }}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Nuevas Notas</td>
          <td
            v-for="(nota, index) in NuevasNotasPosicionadasEscala"
            :key="index"
          >
            <span
              class="notaPosicionada"
              v-for="(notaPosicionada, posIndex) in nota"
              :key="posIndex"
            >
              {{ notaPosicionada }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
td,
th {
  border: 1px solid #a9a8f6;
  padding: 6px;
  text-align: center;
}
.notaPosicionada {
  margin: 3px;
  font-weight: bold;
}
th {
  background-color: #353333;
  color: #a9a8f6;
}
</style>

function emit(arg0: string) {
  throw new Error('Function not implemented.')
}
