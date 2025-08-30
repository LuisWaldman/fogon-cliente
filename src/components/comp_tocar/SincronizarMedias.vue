<script setup lang="ts">
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

      <div
        v-for="mediaVista in appStore.MediaVistas"
        :key="mediaVista.tipo"
        style="display: flex"
      >
        <div>{{ mediaVista.tipo }}</div>
        <div><input type="checkbox" v-model="mediaVista.rector" />Rector</div>
        <div>
          <input type="checkbox" v-model="mediaVista.sincronizar" />Sincronizar
        </div>
      </div>
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
