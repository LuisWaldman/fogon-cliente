<script setup lang="ts">
import { table } from 'console'
import { useAppStore } from '../../stores/appStore'

const emit = defineEmits(['cerrar'])

const appStore = useAppStore()
function guardarConfiguracionPantalla() {
  emit('cerrar')
}

function cancelarConfiguracionPantalla() {
  emit('cerrar')
}
</script>

<template>
  <div class="editSize">
    <div class="tituloeditSize">Medios</div>
    <div>
      {{ appStore.MediaVistas.length }} medios sincronizados
      <table>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Rector</th>
          <th>Sincronizar</th>
          <th>Delay con tiempo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mediaVista in appStore.MediaVistas" :key="mediaVista.tipo">
          <td>{{ mediaVista.tipo }}</td>
          <td><input type="checkbox" v-model="mediaVista.rector" /></td>
          <td><input type="checkbox" v-model="mediaVista.sincronizar" /></td>
          <td>
            {{ mediaVista.delayconrector.toFixed(0) }}
          </td>
          <td>
            {{ mediaVista.delay.toFixed(0) }}
          </td>
        </tr>
      </tbody>
      </table>
    </div>
    <div class="botonera">
      <button @click="guardarConfiguracionPantalla()" class="btnGuardar">
        Guardar
      </button>
      <button @click="cancelarConfiguracionPantalla()" class="btnGuardar">
        Cancelar
      </button>
    </div>
  </div>
</template>
