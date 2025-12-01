<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import subirxml from './subirxml.vue'
import { Pentagrama } from '../../modelo/cancion/pentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { EstiloEditandoCompas } from '../../modelo/pentagrama/EstiloEditandoCompas'
import editarCompas from '../comp_editar/editarCompasPentagrama.vue'
import combo from '../SelectInstrumento.vue'

import { DisplaySistemaPentagrama } from '../../modelo/pentagrama/DisplaySistemaPentagrama'
import { DisplayInstrumentoPentagrama } from '../../modelo/pentagrama/DisplayInstrumentoPentagrama'
import { DisplayCompasPentagrama } from '../../modelo/pentagrama/DisplayCompasPentagrama'
import { DisplayAcordesPentagrama } from '../../modelo/pentagrama/DisplayAcordesPentagrama'
import { DisplayNotaPentagrama } from '../../modelo/pentagrama/DisplayNotapentagrama'
import { PatronRitmico } from '../../modelo/pentagrama/PatronRitmico'
import { HelperEditPentagrama } from '../../modelo/pentagrama/editPentagrama/helperEditCompasPentagrama'
import type { DisplayModoPentagrama } from '../../modelo/pentagrama/displayModoPentagrama'

const props = defineProps<{
  cancion: Cancion
  compas: number
  editandoModo: number
}>()

const modos = ref<DisplayModoPentagrama[]>([])
const helper = new HelperPentagramas()

cargarModos()
function cargarModos() {
  modos.value = helper.GetModos(props.cancion)
}
const helperEdit = new HelperEditPentagrama()

const refDesdeOctava = ref(4)

watch(
  () => props.editandoModo,
  () => {
    calcularPentagramaEditando()
  },
)

watch(
  () => props.compas,
  () => {
    calcularPentagramaEditando()
  },
)
const patronSeleccionado = ref(0)
const acorde = props.cancion.acordes.GetTodosLosAcordes()[props.compas]
const refDisplayPentagrama = ref<DisplaySistemaPentagrama>(
  new DisplaySistemaPentagrama(),
)

const refEstiloEditandoAcorde = ref<EstiloEditandoCompas>(
  new EstiloEditandoCompas(),
)
const refPatrones = ref(PatronRitmico.GetPatrones())

refDisplayPentagrama.value.pentagramas.push(
  new DisplayInstrumentoPentagrama([], 'treble'),
)
const refCompasPentagrama = ref<DisplayCompasPentagrama>(
  new DisplayCompasPentagrama(0),
)
refCompasPentagrama.value.acordes.push(new DisplayAcordesPentagrama())
refCompasPentagrama.value.acordes[0].Notas.push(
  new DisplayNotaPentagrama('C', 4),
)
refCompasPentagrama.value.acordes[0].duracion = '4'
refDisplayPentagrama.value.pentagramas[0].compases.push(
  refCompasPentagrama.value,
)
const helpPenta = new HelperPentagramas()
refEstiloEditandoAcorde.value =
  refPatrones.value[patronSeleccionado.value].GetEstilo()
const notasBateria = ref(false)
const pentaObtenido = refEstiloEditandoAcorde.value.GetCompas(
  acorde,
  refDesdeOctava.value,
  notasBateria.value,
)
const pentagrama = Pentagrama.GetPentagramaDefault(1)
pentagrama.compases[0] = pentaObtenido

refDisplayPentagrama.value.pentagramas[0].compases[0] =
  helpPenta.creaCompasPentagrama(pentagrama, 0, props.cancion.escala)

refEstiloEditandoAcorde.value =
  refPatrones.value[patronSeleccionado.value].GetEstilo()

const emit = defineEmits(['actualizoPentagrama'])
const idPentagramaEditando = ref(0)

function clickBorrarModo(modo: DisplayModoPentagrama) {
  props.cancion.pentagramas = props.cancion.pentagramas.filter(
    (penta) => penta.nombre != modo.Nombre,
  )
  cargarModos()
  emit('actualizoPentagrama')
}

function clickCopiarEnPentagrama() {
  console.log('Actualizando', refEstiloEditandoAcorde.value)
  helperEdit.CopiarEnPentagrama(
    props.cancion,
    idPentagramaEditando.value,
    props.compas,
  )
  emit('actualizoPentagrama')
}

function cambioInstrumento(modo: DisplayModoPentagrama, instrumento: string) {
  // actualiza el modo mostrado
  modo.Instrumento = instrumento

  // sincroniza los pentagramas que correspondan con ese modo
  for (const element of props.cancion.pentagramas) {
    if (element.nombre === modo.Nombre) {
      element.instrumento = instrumento
    }
  }

  // actualizar estados relacionados y notificar al padre
  cargarModos()
  emit('actualizoPentagrama')
}

const editandoClave = ref('treble')
function calcularPentagramaEditando() {
  let cont = 0
  props.cancion.pentagramas.forEach((penta) => {
    if (
      penta.nombre === modos.value[props.editandoModo].Nombre &&
      (editandoClave.value === penta.clave ||
        modos.value[props.editandoModo].Claves.length === 1)
    ) {
      idPentagramaEditando.value = cont
    }
    cont++
  })
}

const agregandoPentagrama = ref(false)
const pentagramaAgregado = ref(1)
const nuevoPentagramaClave = ref('Sol')
function clickAddPentagrama() {
  agregandoPentagrama.value = !agregandoPentagrama.value
}
function clickCancelAddPentagrama() {
  agregandoPentagrama.value = false
}
function clickAddOkPentagrama() {
  const nPentagrama = Pentagrama.GetPentagramaDefault(
    props.cancion.totalCompases,
  )
  nPentagrama.clave =
    nuevoPentagramaClave.value === 'Sol' ||
    nuevoPentagramaClave.value === 'Sol y Fa'
      ? 'treble'
      : 'bass'
  nPentagrama.nombre = `Pentagrama ${pentagramaAgregado.value}`
  props.cancion.pentagramas.push(nPentagrama)
  if (nuevoPentagramaClave.value === 'Sol y Fa') {
    const nPentagrama2 = Pentagrama.GetPentagramaDefault(
      props.cancion.totalCompases,
    )
    nPentagrama2.clave = 'bass'
    nPentagrama2.nombre = `Pentagrama ${pentagramaAgregado.value}`
    props.cancion.pentagramas.push(nPentagrama2)
  }
  pentagramaAgregado.value++
  agregandoPentagrama.value = false

  emit('actualizoPentagrama')
  cargarModos()
  calcularPentagramaEditando()
}
</script>
<template>
  <div class="pentagrama-container">
    <div class="botoneraLateral">
      <subirxml :cancion="cancion"></subirxml>
      <button @click="clickAddPentagrama">➕ Agregar Pentagrama</button>
      <button
        v-if="modos.length > 0"
        @click="clickBorrarModo(modos[editandoModo])"
        class="btn-danger"
      >
        🗑️ Borrar Pentagrama
      </button>
      <button @click="clickCopiarEnPentagrama">📋 Copiar en Pentagrama</button>
    </div>

    <div v-if="agregandoPentagrama" class="modal-agregar">
      <div class="form-group">
        <label>Clave nuevo pentagrama</label>
        <select v-model="nuevoPentagramaClave" class="styled-select">
          <option value="Sol">Sol</option>
          <option value="Fa">Fa</option>
          <option value="Sol y Fa">Sol y Fa</option>
          <option value="Bateria">Bateria</option>
        </select>
      </div>
      <div class="button-group">
        <button @click="clickAddOkPentagrama" class="btn-success">
          ✓ Aceptar
        </button>
        <button @click="clickCancelAddPentagrama" class="btn-cancel">
          ✗ Cancelar
        </button>
      </div>
    </div>

    <div v-if="modos.length > 0" class="config-panel">
      <div class="form-group">
        <label>Nombre</label>
        <input v-model="modos[editandoModo].Nombre" class="styled-input" />
      </div>

      <div class="form-group">
        <label>Instrumento</label>
        <combo
          v-model="modos[editandoModo].Instrumento"
          @update:modelValue="
            (nuevo) => cambioInstrumento(modos[editandoModo], nuevo)
          "
        ></combo>
      </div>

      <div class="form-group" v-if="modos[editandoModo].Claves.length > 1">
        <label>Clave</label>
        <select
          v-model="editandoClave"
          @change="calcularPentagramaEditando()"
          class="styled-select"
        >
          <option
            v-for="clave in modos[editandoModo].Claves"
            :key="clave"
            :value="clave"
          >
            {{ clave === 'treble' ? 'Sol' : clave === 'bass' ? 'Fa' : clave }}
          </option>
        </select>
      </div>
    </div>

    <div class="editor-panel">
      <editarCompas
        v-if="cancion.pentagramas[idPentagramaEditando] && compas >= 0"
        :cancion="cancion"
        :pentagramaId="idPentagramaEditando"
        :compas="compas"
        @actualizoPentagrama="emit('actualizoPentagrama')"
      ></editarCompas>
    </div>
  </div>
</template>

<style scoped>
.pentagrama-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

/* Button Styles - matching editarLetraYAcordes lateral */
.botoneraLateral {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(169, 168, 246, 0.2);
  flex-wrap: wrap;
  border-radius: 8px;
}

.botoneraLateral button {
  padding: 12px 16px;
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
}

.botoneraLateral button:hover {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(169, 168, 246, 0.3);
}

.botoneraLateral button:active {
  transform: translateY(0);
}

.botoneraLateral button.btn-danger {
  border-color: rgba(255, 99, 71, 0.5);
  background: rgba(255, 99, 71, 0.1);
  color: #ff6347;
}

.botoneraLateral button.btn-danger:hover {
  border-color: rgba(255, 99, 71, 0.8);
  background: rgba(255, 99, 71, 0.2);
  box-shadow: 0 4px 16px rgba(255, 99, 71, 0.3);
}

/* Modal and Form Styles */
.modal-agregar {
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  color: #a9a8f6;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.styled-input,
.styled-select {
  width: 100%;
  padding: 10px 12px;
  background: rgba(169, 168, 246, 0.1);
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 6px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.styled-input:focus,
.styled-select:focus {
  outline: none;
  border-color: #a9a8f6;
  background: rgba(169, 168, 246, 0.15);
  box-shadow: 0 0 0 3px rgba(169, 168, 246, 0.1);
}

.styled-select option {
  background: #1a1a1a;
  color: #fff;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.button-group button {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-success {
  background: rgba(46, 204, 113, 0.1);
  border-color: rgba(46, 204, 113, 0.5);
  color: #2ecc71;
}

.btn-success:hover {
  background: rgba(46, 204, 113, 0.2);
  border-color: #2ecc71;
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
}

.btn-cancel {
  background: rgba(231, 76, 60, 0.1);
  border-color: rgba(231, 76, 60, 0.5);
  color: #e74c3c;
}

.btn-cancel:hover {
  background: rgba(231, 76, 60, 0.2);
  border-color: #e74c3c;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.3);
}

/* Panels */
.content-panel,
.config-panel,
.editor-panel {
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.config-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Responsive design */
@media (max-width: 768px) {
  .botoneraLateral {
    flex-direction: column;
    gap: 4px;
    padding: 8px;
  }

  .botoneraLateral button {
    width: 100%;
    font-size: 0.8rem;
    padding: 10px 12px;
  }

  .button-group {
    flex-direction: column;
  }

  .pentagrama-container {
    padding: 8px;
    gap: 8px;
  }
}
</style>
