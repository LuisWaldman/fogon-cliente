<script setup lang="ts">
import { ref } from 'vue';
import { Logger } from '../../modelo/logger';

const errores = ref(Logger.errores)
</script>

<template>
  <div class="divErrores">
    <h1>Errores</h1>
    <table>
      <thead>
        <tr>
          <th>Acción</th>
          <th>Error</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(error, index) in errores" :key="index">
          <td>{{ error.accion }}</td>
          <td>{{ error.error }}</td>
          <td>{{ error.fecha.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
    
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: black;
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  overflow: hidden;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #a9a8f6;
  color: #a9a8f6;
}

th {
  background-color: #1a1a1a;
  font-weight: 600;
  color: #a9a8f6;
  text-transform: uppercase;
  font-size: 0.9em;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #a9a8f6;
}

tbody tr:hover {
  background-color: #2a2a2a;
}

tbody tr:last-child td {
  border-bottom: none;
}

h1 {
  color: #a9a8f6;
  margin-bottom: 10px;
}
.divErrores {
  margin:auto;
}
</style>
