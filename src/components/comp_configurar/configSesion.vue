<script setup lang="ts">
import { ref } from 'vue'
import { ClienteSocket } from '../../modelo/conexion/ClienteSocket'

const serverName = ref('http://localhost:8080/')
const respuestas = ref([] as string[])
const conectado = ref(false)

let cliente: ClienteSocket | undefined;

function conectar() {
      if (serverName.value.trim() === '') {
        respuestas.value.push('Por favor ingrese un nombre de servidor.')
        return
      }
      cliente = new ClienteSocket(serverName.value)
      cliente.connectar()
      conectado.value = true
      respuestas.value.push(`Intenta conectar: ${serverName.value}`)
    }
    
    function mandarMensaje(tipo: string) {
      if (!conectado.value) {
        respuestas.value.push('Debe conectarse primero.')
        return
      }
      respuestas.value.push(
        `Mensaje ${tipo} enviando al servidor ${serverName.value}`,
      )
      cliente?.hola(tipo)
    }
    
</script>
<template>
  <div class="config-sesion">
    <label for="serverName">Nombre del Servidor:</label>
    <input
      id="serverName"
      v-model="serverName"
      type="text"
      placeholder="Ingrese el nombre del servidor"
    />

    <div class="buttons">
      <button @click="conectar">Conectar</button>
      <button @click="mandarMensaje('A')">Mandar mensaje A</button>
      <button @click="mandarMensaje('B')">Mandar mensaje B</button>
    </div>

    <div class="respuestas">
      <h3>Respuestas:</h3>
      <div v-for="(respuesta, index) in respuestas" :key="index">
        {{ respuesta }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-sesion {
  max-width: 400px;
  margin: 0 auto;
}
.buttons {
  margin: 10px 0; 
}
.buttons button {
  margin-right: 8px;
}
.respuestas {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
}
</style>
