<script setup lang="ts">
const emit = defineEmits(['cerrar'])

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
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Rector</th>
            <th>Delay</th>
          </tr>
        </thead>
        <tbody></tbody>
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
