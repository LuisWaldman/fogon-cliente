<script setup lang="ts">
import { ref, onMounted, watch } from 'vue' // Import watch
import { ClienteSocket } from '../../modelo/conexion/ClienteSocket'
import { Configuracion } from '../../modelo/configuracion' // Import Configuracion
import { Servidor } from '../../modelo/servidor' // Import Servidor

const configuracion = Configuracion.getInstance() // Get Configuracion instance
const servidores = ref<Servidor[]>(configuracion.servidores) // servidores ref

// Initialize serverName with the address of the first server, or default if empty
const serverName = ref(servidores.value.length > 0 ? servidores.value[0].direccion : 'http://localhost:8080/')

const respuestas = ref([] as string[])
const conectado = ref(false)
const nuevoServidorNombre = ref('') // For new server name
const nuevoServidorDireccion = ref('') // For new server address

let cliente: ClienteSocket | undefined

// Load servers on component mount and set initial serverName
onMounted(() => {
  servidores.value = configuracion.servidores
  if (servidores.value.length > 0 && !servidores.value.find(s => s.direccion === serverName.value)) {
    // If current serverName is not in the list (e.g. after a server is deleted), select the first one.
    serverName.value = servidores.value[0].direccion
  } else if (servidores.value.length === 0) {
    // If no servers, set to default (though config should add one)
    serverName.value = 'http://localhost:8080/'
  }
})

// Watch for changes in the servidores list to update serverName if the selected one is removed
watch(servidores, (newServidores) => {
  if (!newServidores.find(s => s.direccion === serverName.value)) {
    if (newServidores.length > 0) {
      serverName.value = newServidores[0].direccion;
    } else {
      // Handle case where all servers are deleted - perhaps set to a default or disable connection
      serverName.value = ''; // Or some default placeholder
    }
  }
}, { deep: true });

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

// Function to add a new server
function agregarServidor() {
  if (nuevoServidorNombre.value.trim() !== '' && nuevoServidorDireccion.value.trim() !== '') {
    const nuevo = new Servidor(nuevoServidorNombre.value, nuevoServidorDireccion.value)
    configuracion.servidores.push(nuevo)
    configuracion.guardarEnLocalStorage() // Save to localStorage
    servidores.value = [...configuracion.servidores] // Update reactive ref
    // If this is the first server added, select it
    if (servidores.value.length === 1) {
      serverName.value = nuevo.direccion
    }
    nuevoServidorNombre.value = '' // Clear input
    nuevoServidorDireccion.value = '' // Clear input
  }
}

// Function to remove a server
function eliminarServidor(index: number) {
  configuracion.servidores.splice(index, 1)
  configuracion.guardarEnLocalStorage() // Save to localStorage
  servidores.value = [...configuracion.servidores] // Update reactive ref
  // serverName will be updated by the watcher if the selected server was deleted
}
</script>
<template>
  <div class="config-sesion">
    <label for="serverSelect">Servidor:</label>
    <select id="serverSelect" v-model="serverName">
      <option v-if="servidores.length === 0" value="" disabled>
        No hay servidores configurados
      </option>
      <option v-for="servidor in servidores" :key="servidor.direccion" :value="servidor.direccion">
        {{ servidor.nombre }} ({{ servidor.direccion }})
      </option>
    </select>

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

    <!-- Sección para administrar servidores -->
    <div class="admin-servidores">
      <h3>Administrar Servidores</h3>
      <div>
        <input v-model="nuevoServidorNombre" placeholder="Nombre del servidor" />
        <input v-model="nuevoServidorDireccion" placeholder="Dirección del servidor" />
        <button @click="agregarServidor">Agregar Servidor</button>
      </div>
      <ul>
        <li v-for="(servidor, index) in servidores" :key="index">
          {{ servidor.nombre }} ({{ servidor.direccion }})
          <button @click="eliminarServidor(index)">Eliminar</button>
        </li>
      </ul>
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

/* Estilos para la sección de administrar servidores */
.admin-servidores {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.admin-servidores h3 {
  margin-top: 0;
}

.admin-servidores input {
  margin-right: 5px;
  margin-bottom: 5px;
}

.admin-servidores ul {
  list-style-type: none;
  padding: 0;
}

.admin-servidores li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.admin-servidores li:last-child {
  border-bottom: none;
}

.admin-servidores button {
  margin-left: 10px;
}
</style>
