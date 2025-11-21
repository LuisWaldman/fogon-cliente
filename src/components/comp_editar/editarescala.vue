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
function clickConfirmarCambiarEscala() {
  helperMuisca.ActualizarEscala(
    appStore.editandocancion,
    Escala.value,
    NuevaEscala.value,
  )
  emit('cerrar', true)
}
</script>
<template>
  <div></div>
  <div>
    <table style="border-collapse: collapse; width: 100%">
      <thead>
        <tr>
          <th></th>
          <th
            v-for="(nota, index) in Escala.slice(0, 7)"
            :key="index"
            :class="{
              tonicaprincipal: index === 0,
              tonicarelativa: index === 2 || index === 5,
              subdominante: index === 1 || index === 3,
              dominantesecundaria: index === 6,
              dominante: index === 4,
            }"
          >
            {{ labelGradosEscala[index] }} - {{ nota }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Notas</td>
          <td
            v-for="(nota, index) in NotasPosicionadasEscala.slice(0, 7)"
            :key="index"
            :class="{
              tonicaprincipal: index === 0,
              tonicarelativa: index === 2 || index === 5,
              subdominante: index === 1 || index === 3,
              dominantesecundaria: index === 6,
              dominante: index === 4,
            }"
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
            <button
              class="lblCabecera"
              v-if="toEscala != desdeEscala"
              @click="clickConfirmarCambiarEscala"
            >
              ✔️
            </button>
          </td>

          <td
            v-for="(nota, index) in NuevasNotasPosicionadasEscala.slice(0, 7)"
            :key="index"
            :class="{
              tonicaprincipal: index === 0,
              tonicarelativa: index === 2 || index === 5,
              subdominante: index === 1 || index === 3,
              dominantesecundaria: index === 6,
              dominante: index === 4,
            }"
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
  color: #a9a8f6;
}

/* Modificadores para cabeceras (th) */
th.tonicaprincipal {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #cfda41 100%),
    linear-gradient(to bottom, #cfda41, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

th.tonicarelativa {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #cfda41 100%),
    linear-gradient(to bottom, #ddba59, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

th.subdominante {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #b8651b 100%),
    linear-gradient(to bottom, #d1a442, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

th.dominantesecundaria {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #cc4125 100%),
    linear-gradient(to bottom, #cc4125, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

th.dominante {
  background:
    radial-gradient(ellipse at center bottom, transparent 60%, #8b0000 100%),
    linear-gradient(to bottom, #8b0000, transparent 70%) !important;
  color: #fff !important;
  font-weight: bold;
}

/* Modificadores para celdas (td) */
td.tonicaprincipal {
  background: linear-gradient(to center, rgba(218, 165, 32, 0.1), transparent);
  border: 2px solid #daa520;
}

td.tonicarelativa {
  background: linear-gradient(to center, rgba(184, 134, 11, 0.1), transparent);
  border: 2px solid #b8860b;
}

td.subdominante {
  background: linear-gradient(to center, rgba(210, 105, 30, 0.1), transparent);
  border: 2px solid #b8651b;
}

td.dominantesecundaria {
  background: linear-gradient(to center, rgba(205, 92, 92, 0.1), transparent);
  border: 2px solid #cc4125;
}

td.dominante {
  background: linear-gradient(to center, rgba(160, 82, 45, 0.1), transparent);
  border: 2px solid #8b0000;
}
</style>
