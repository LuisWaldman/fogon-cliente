<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import { Parte } from '../../modelo/cancion/acordes'

const props = defineProps<{
  cancion: Cancion
  acordesCancion: string[]
}>()
class ParteAcordes {
  nombre: string
  acordes: string[][]
  colspan: number[][]

  constructor(nombre: string, acordes: string[][], colspan: number[][]) {
    this.nombre = nombre
    this.acordes = acordes
    this.colspan = colspan
  }
}
const acordesDePartes = ref<ParteAcordes[]>([])
function CargarCancion() {
  acordesDePartes.value = []
  for (const parte of props.cancion.acordes.partes) {
    const acordesEnParte: string[][] = []
    const colspan: number[][] = []
    for (const acorde of parte.acordes) {
      const division = acorde.split(' ')
      acordesEnParte.push(division)
      const colspanFila: number[] = []
      if (division.length === 1) {
        colspanFila.push(4)
      } else if (division.length === 2) {
        colspanFila.push(2, 2)
      } else if (division.length === 3) {
        colspanFila.push(2, 1, 1)
      } else {
        // Manejar otros casos si es necesario
        for (let i = 0; i < division.length; i++) {
          colspanFila.push(1)
        }
      }
      colspan.push(colspanFila)
    }

    acordesDePartes.value.push(
      new ParteAcordes(parte.nombre, acordesEnParte, colspan),
    )
  }
}
onMounted(() => {
  CargarCancion()
})
const desdePosicion = ref(1)
const hastaPosicion = ref(4)

const exdesdePosicion = ref(1)
const exhastaPosicion = ref(4)
const editandoParte = ref(-1)
const editandoCompas = ref(-1)
const editandoNota = ref(-1)
function clickNotaAcorde(parte: number, compas: number, nota: number) {
  editandoCompas.value = compas
  editandoParte.value = parte
  editandoNota.value = nota
  let desdeSpan = 0
  for (let i = 0; i < nota; i++) {
    desdeSpan += acordesDePartes.value[parte].colspan[compas][i]
  }
  desdePosicion.value = desdeSpan
  hastaPosicion.value =
    desdeSpan + acordesDePartes.value[parte].colspan[compas][nota]

  exdesdePosicion.value = desdePosicion.value
  exhastaPosicion.value = hastaPosicion.value
}
function agregar() {
  props.cancion.acordes.partes.push(new Parte('Nueva Parte', []))
  CargarCancion()
}
const quitando = ref(false)
const reordenando = ref(false)
function quitarOk(parteIndex: number) {
  props.cancion.acordes.partes.splice(parteIndex, 1)
  CargarCancion()
  quitando.value = false
}
function quitar() {
  editandoParte.value = -1
  quitando.value = !quitando.value
}

function reordenar() {
  editandoParte.value = -1
  reordenando.value = !reordenando.value
}
const dragrandoOrden = ref(false)
const dragenterOrden = ref(false)
const dragenterAdd = reactive(new Map<string, boolean>())
function onDragStartOrdenParte(event: DragEvent, indexparte: number) {
  dragrandoOrden.value = true
  event.dataTransfer!.setData('text/plain', indexparte.toString())
}
function onDragEndOrdenParte() {
  dragrandoOrden.value = false
}

function onDragOverParte(event: DragEvent) {
  event.preventDefault()
}

function onDragEnterOrdenParte() {
  dragenterOrden.value = true
}

function onDragLeaveOrdenParte() {
  dragenterOrden.value = false
}

function onDropOrdenParte(event: DragEvent, targetIndex: number) {
  event.preventDefault()
  const draggedIndex = parseInt(event.dataTransfer!.getData('text/plain'))
  if (draggedIndex !== targetIndex) {
    const part = props.cancion.acordes.partes.splice(draggedIndex, 1)[0]
    props.cancion.acordes.partes.splice(targetIndex, 0, part)
    CargarCancion()
    alert(`Parte "${part.nombre}" movida a posición ${targetIndex + 1}`)
  }
  dragenterOrden.value = false
}
const drageandoAcorde = ref(false)
function onDragEndAcorde() {
  drageandoAcorde.value = false
  dragenterAdd.clear()
}
function onDragStartAcorde(
  event: DragEvent,
  indexparte: number,
  nota?: string,
) {
  console.log('onDragStartAcorde PARA QUE COMPILE', { indexparte, nota })
  drageandoAcorde.value = true
  dragenterAdd.clear()
  event.dataTransfer!.setData('text/plain', nota || '')
}
function onDragOverAdd(event: DragEvent) {
  event.preventDefault()
}
function onDragEnterAdd(indexparte: number, compasindex: number) {
  dragenterAdd.set(`${indexparte}-${compasindex}`, true)
}
function onDragLeaveAdd(indexparte: number, compasindex: number) {
  dragenterAdd.set(`${indexparte}-${compasindex}`, false)
}
function onDropAdd(event: DragEvent, indexparte: number, compasindex: number) {
  console.log('onDropAdd PARA QUE COMPILE', { indexparte, compasindex })
  event.preventDefault()
  const chord = event.dataTransfer!.getData('text/plain')
  if (chord) {
    props.cancion.acordes.partes[indexparte].acordes.push(chord)
    CargarCancion()
    alert(
      `Acorde "${chord}" agregado a nueva compás en parte "${props.cancion.acordes.partes[indexparte].nombre}"`,
    )
  }
  dragenterAdd.clear()
}
</script>
<template>
  <div>
    <div v-for="(parte, indexparte) in acordesDePartes" :key="indexparte">
      <div
        class="destinoOrdenParte"
        :class="{ destinoOrdenPartehover: dragenterOrden }"
        v-if="dragrandoOrden"
        @dragover="onDragOverParte"
        @drop="(event) => onDropOrdenParte(event, indexparte)"
        @dragenter="onDragEnterOrdenParte"
        @dragleave="onDragLeaveOrdenParte"
      ></div>
      <div
        class="clsParte"
        @dragstart="(event) => onDragStartOrdenParte(event, indexparte)"
        @dragend="onDragEndOrdenParte"
        :draggable="reordenando"
      >
        <div
          v-if="indexparte != editandoParte"
          @click="editandoParte = indexparte"
        >
          {{ parte.nombre }}

          <button @click="quitarOk(indexparte)" v-if="quitando">
            🗑️ QUITAR
          </button>
        </div>
        <div v-else>
          <input v-model="parte.nombre" />
          <div class="ctrlMandoEdit">
            <div
              class="notaCompas"
              v-for="nota in props.acordesCancion"
              :key="nota"
              draggable="true"
              @dragstart="(event) => onDragStartAcorde(event, indexparte, nota)"
              @dragend="onDragEndAcorde"
            >
              {{ nota }}
            </div>
          </div>
        </div>

        <div class="conteinerCompases">
          <div
            class="conteinerCompas"
            v-for="(compas, compasindex) in parte.acordes"
            :key="compasindex"
          >
            <div class="compas">
              <div
                class="notaCompas"
                v-for="(nota, notindex) in compas"
                :key="notindex"
                draggable="true"
                @dragstart="
                  (event) => onDragStartAcorde(event, indexparte, nota)
                "
                @dragend="onDragEndAcorde"
              >
                <select
                  v-model="parte.acordes[compasindex][notindex]"
                  v-if="indexparte == editandoParte"
                >
                  <option v-for="nota in props.acordesCancion" :key="nota">
                    {{ nota }}
                  </option>
                </select>
                <span
                  v-else
                  @click="clickNotaAcorde(indexparte, compasindex, notindex)"
                  >{{ nota }}</span
                >
              </div>
            </div>
            <div>+</div>
            <div
              class="destinoOrdenParte destinoOrdenPartehover"
              v-if="dragenterAdd.get(`${indexparte}-${compasindex}`)"
              @dragover="onDragOverAdd"
              @drop="(event) => onDropAdd(event, indexparte, compasindex)"
              @dragenter="onDragEnterAdd(indexparte, compasindex)"
              @dragleave="onDragLeaveAdd(indexparte, compasindex)"
            >
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="botoneraAcordes">
      <button @agregar="agregar">🎸 AGREGAR</button>
      <button @click="quitar">🗑️ QUITAR</button>
      <button @click="reordenar">↕️ REORDENAR</button>
    </div>
  </div>
</template>
<style scoped>
.destinoOrdenParte {
  border: 1px rgb(225, 226, 168) solid;
  height: 7px;
  background-color: #757061;
}

.destinoOrdenPartehover {
  border: 2px rgb(225, 226, 168) solid;
  height: 9px;
  background-color: #a9a8f6;
}

.notaCompas {
  padding: 4px 8px;
  margin: 2px;
  background: rgba(169, 168, 246, 0.2);
  border-radius: 4px;
  font-weight: 600;
  color: #a9a8f6;
  cursor: pointer;
  transition: background 0.3s ease;
}
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
.ctrlMandoEdit {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.conteinerCompas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
