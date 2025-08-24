<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Cancion } from '../../modelo/cancion/cancion'
import subirmidi from './subirmidi.vue'
import { Pentagrama } from '../../modelo/cancion/pentagrama'
import { HelperPentagramas } from '../../modelo/pentagrama/helperPentagramas'
import { EstiloAcorde } from '../../modelo/pentagrama/estiloAcorde'
import { EstiloEditandoCompas } from '../../modelo/pentagrama/EstiloEditandoCompas'

const props = defineProps<{
  cancion: Cancion
}>()

const refEditandoAcorde = ref<EstiloEditandoCompas>(new EstiloEditandoCompas())
refEditandoAcorde.value.acordes.push(new EstiloAcorde(1, 1))

const emit = defineEmits(['cerrar', 'actualizoPentagrama'])
const idPentagramaEditando = ref(0)

// Obtener tipos y duraciones desde métodos estáticos
const tiposDisponibles = computed(() => EstiloAcorde.GetTipos())
const duracionesDisponibles = computed(() => EstiloAcorde.GetDuraciones())

function clickCancelarEdit() {
  emit('cerrar')
}

function clickAgregarPentagrama() {
  const nPentagrama = new Pentagrama()
  nPentagrama.instrumento = 'Nuevo Instrumento'
  props.cancion.pentagramas.push(nPentagrama)
}

function clickBorrarPentagrama() {
  props.cancion.pentagramas[idPentagramaEditando.value].compases = []
  emit('actualizoPentagrama')
}

function clickGenerarPentagrama() {
  const helpPenta = new HelperPentagramas()
  props.cancion.pentagramas[idPentagramaEditando.value] =
    helpPenta.creaPentagrama(props.cancion, refEditandoAcorde.value)
  emit('actualizoPentagrama')
}

function agregarAcorde() {
  refEditandoAcorde.value.acordes.push(
    new EstiloAcorde(1, refEditandoAcorde.value.notas.length),
  )
  //refEditandoAcorde.value.agregarAcorde()
}

function quitarAcorde(index: number) {
  refEditandoAcorde.value.acordes.splice(index, 1)
}
</script>
<template>
  <div>
    <span @click="clickCancelarEdit">[Cancelar]</span>

    <subirmidi :cancion="cancion"></subirmidi>
  </div>
  <div>
    Pentagramas
    <select>
      <option
        v-for="(pentagrama, index) in props.cancion.pentagramas"
        :key="index"
        :value="pentagrama"
      >
        {{ pentagrama.instrumento }}
      </option>
    </select>
    <span @click="clickAgregarPentagrama">[Agregar]</span>
  </div>
  <div>
    <span @click="clickGenerarPentagrama">[Generar Pentagrama]</span>
    <span @click="clickBorrarPentagrama">[Borrar Pentagrama]</span>
  </div>

  <div>
    <table>
      <thead>
        <tr>
          <th>Ritmo</th>
          <th v-for="(acorde, index) in refEditandoAcorde.acordes" :key="index">
            <div>
              <select v-model="acorde.duracionId">
                <option
                  v-for="(duracion, index) in duracionesDisponibles"
                  :key="index"
                  :value="index"
                >
                  {{ duracion }}
                </option>
              </select>
            </div>
            <div>
              <span @click="quitarAcorde(index)">[X]</span>
            </div>
          </th>
          <th><span @click="agregarAcorde">[Agregar Acorde]</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(nota, index) in refEditandoAcorde.notas" :key="index">
          <td>{{ nota }}</td>
          <td
            v-for="(acorde, indexnotaaco) in refEditandoAcorde.acordes"
            :key="indexnotaaco"
            @click="acorde.CambiarTipoNota(index)"
          >
            {{ acorde.tiposNota[index] }}
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
    {{ refEditandoAcorde.notas }}
  </div>
  <!-- Acordes dinámicos -->
  <div>
    <h3>Acordes</h3>

    <div
      v-for="(acorde, index) in refEditandoAcorde.acordes"
      :key="index"
      class="acorde-item"
    >
      <div>
        <label>Acorde {{ index + 1 }}:</label>
      </div>

      <div>
        Tipo: Duración:
        <select v-model="acorde.duracionId">
          <option
            v-for="(duracion, index) in duracionesDisponibles"
            :key="index"
            :value="index"
          >
            {{ duracion }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acorde-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}
</style>
