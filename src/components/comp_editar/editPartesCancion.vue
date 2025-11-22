<script lang="ts" setup>
import { ref } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { useAppStore } from '../../stores/appStore'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'
import { VistaParte } from './vistaParteCancion';

const props = defineProps<{
  cancion: Cancion
  acordesCancion: string[]
}>()
const VistaPartes = ref(VistaParte.GetFromCancion(props.cancion))
const refagregandoAcorde = ref(false)
function agregarAcorde() {
  refagregandoAcorde.value = true
}
function cerrarAgregando() {
  refagregandoAcorde.value = false
}

function agregoAcorde(nuevoAcorde: string) {
  if (!props.acordesCancion.includes(nuevoAcorde)) {
    props.acordesCancion.push(nuevoAcorde)
  }
  refagregandoAcorde.value = false
}
const toEscala = ref('')
const desdeEscala = ref('')
const esMenor = ref(false)
const appStore = useAppStore()
const NotasPosicionadasEscala = ref([] as string[][])
const Escala = ref([] as string[])
const labelGradosEscala = ref(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'])

const helperMuisca = new MusicaHelper()

function clickCambiarEscala() {
  if (appStore.editandocancion.escala) {
    desdeEscala.value = props.cancion.escala
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
</script>
<template>
  <div>
    <div
      class="clsParte"
      v-for="(parte, indexparte) in props.cancion.acordes.partes"
      :key="indexparte"
    >
      <div>{{ parte.nombre }}</div>
      <div class="conteinerCompases">
        <div class="compas">
          <div class="parteCompasEntero">LA</div>
        </div>
        
        <div class="compas">
          <div class="parteCompasMitad">LA</div>
          <div class="parteCompasMitad">SOL</div>
        </div>

        <div class="compas">
          <div class="parteCompasEntero">RE</div>
        </div>
        
        <div class="compas">
          <div class="parteCompasCuarto">LA</div>
          <div class="parteCompasMitad">SOL</div>
          <div class="parteCompasCuarto">SOL7</div>
        </div>

      </div>
    </div>
  </div>
  <div>
    <table style="border-collapse: collapse; width: 100%">
      <thead>
        <tr>
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
      </tbody>
    </table>
  </div>
  <div>
    <div class="acordesInfo">
      {{ props.acordesCancion.join(', ') }}
    </div>
    <div class="botoneraAcordes">
      <button @click="agregarAcorde">🎸 AGREGAR</button>
      <button>🗑️ QUITAR</button>
    </div>
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

/* Acordes info styling */
.acordesInfo {
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 8px;
  margin-bottom: 16px;
  color: #a9a8f6;
  font-size: 1rem;
  line-height: 1.4;
}

/* Button Styles - matching previous component style */
.botoneraAcordes {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(169, 168, 246, 0.2);
  flex-wrap: wrap;
}

.botoneraAcordes button {
  padding: 12px 20px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 8px;
  background: rgba(169, 168, 246, 0.1);
  color: #a9a8f6;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  flex: 1;
  min-width: 140px;
}

.botoneraAcordes button:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(169, 168, 246, 0.3);
  color: #fff;
}

.botoneraAcordes button:active {
  transform: translateY(0);
}

/* Estilos para las partes y compases */
.clsParte {
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  border-left: 4px solid #a9a8f6;
  border-radius: 4px;
}

.clsParte > div:first-child {
  font-size: 1.1rem;
  font-weight: bold;
  color: #a9a8f6;
  margin-bottom: 8px;
  text-decoration: underline;
}

.conteinerCompases {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: stretch;
}

.compas {
  display: flex;
  min-height: 40px;
  border: 1px solid rgba(169, 168, 246, 0.4);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  align-items: stretch;
  position: relative;
}

/* Compás con acorde entero (simple) */
.compas:has(.parteCompasEntero) {
  min-width: 80px;
  background: rgba(169, 168, 246, 0.1);
  border: 2px solid rgba(169, 168, 246, 0.6);
}

/* Compás con dos mitades (doble) */
.compas:has(.parteCompasMitad) {
  min-width: 120px;
  background: rgba(255, 165, 0, 0.1);
  border: 2px solid rgba(255, 165, 0, 0.6);
}

/* Compás con combinación (cuádruple) */
.compas:has(.parteCompasCuarto) {
  min-width: 160px;
  background: rgba(255, 69, 0, 0.1);
  border: 2px solid rgba(255, 69, 0, 0.6);
}

.parteCompasEntero {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: #a9a8f6;
  background: rgba(169, 168, 246, 0.2);
  border-radius: 2px;
  padding: 8px;
}

.parteCompasMitad {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffb347;
  background: rgba(255, 165, 0, 0.2);
  border-radius: 2px;
  margin: 2px;
  padding: 6px;
  border-right: 1px solid rgba(255, 165, 0, 0.4);
}

.parteCompasMitad:last-child {
  border-right: none;
}

.parteCompasCuarto {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ff6347;
  background: rgba(255, 69, 0, 0.2);
  border-radius: 2px;
  margin: 1px;
  padding: 4px;
  border-right: 1px solid rgba(255, 69, 0, 0.4);
}

.parteCompasCuarto:last-child {
  border-right: none;
}

/* Efectos hover para los acordes */
.parteCompasEntero:hover {
  background: rgba(169, 168, 246, 0.4);
  color: #fff;
}

.parteCompasMitad:hover {
  background: rgba(255, 165, 0, 0.4);
  color: #fff;
}

.parteCompasCuarto:hover {
  background: rgba(255, 69, 0, 0.4);
  color: #fff;
}

/* Responsive design para compases */
@media (max-width: 768px) {
  .conteinerCompases {
    gap: 6px;
  }
  
  .compas:has(.parteCompasEntero) {
    min-width: 60px;
  }
  
  .compas:has(.parteCompasMitad) {
    min-width: 100px;
  }
  
  .compas:has(.parteCompasCuarto) {
    min-width: 140px;
  }
  
  .parteCompasEntero {
    font-size: 0.9rem;
    padding: 6px;
  }
  
  .parteCompasMitad {
    font-size: 0.8rem;
    padding: 4px;
  }
  
  .parteCompasCuarto {
    font-size: 0.7rem;
    padding: 3px;
  }
}

/* Responsive design for buttons */
@media (max-width: 768px) {
  .botoneraAcordes {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }

  .botoneraAcordes button {
    width: 100%;
    font-size: 0.8rem;
    padding: 10px 16px;
    min-width: unset;
  }

  .acordesInfo {
    padding: 12px;
    font-size: 0.9rem;
  }
}
</style>
