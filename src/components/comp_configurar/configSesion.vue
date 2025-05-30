<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue' // Import computed
import { ClienteSocket } from '../../modelo/conexion/ClienteSocket'
import { Configuracion } from '../../modelo/configuracion' // Import Configuracion
import { Servidor } from '../../modelo/servidor' // Import Servidor

const configuracion = Configuracion.getInstance() // Get Configuracion instance
const servidores = ref<Servidor[]>(configuracion.servidores) // servidores ref
const conectarServerDefault = ref(configuracion.conectarServerDefault) // ref for default server name

// Initialize serverName with the address of the default server, or first, or a hardcoded default.
const serverName = ref('')

const respuestas = ref([] as string[])
const conectado = ref(false)
const nuevoServidorNombre = ref('') // For new server name
const nuevoServidorDireccion = ref('') // For new server address

let cliente: ClienteSocket | undefined

// Load servers on component mount and set initial serverName
onMounted(() => {
  servidores.value = configuracion.servidores
  conectarServerDefault.value = configuracion.conectarServerDefault

  // Determine initial serverName based on conectarServerDefault
  const defaultServer = servidores.value.find(s => s.nombre === conectarServerDefault.value)
  if (defaultServer) {
    serverName.value = defaultServer.direccion
  } else if (servidores.value.length > 0) {
    serverName.value = servidores.value[0].direccion // Fallback to first server
  } else {
    serverName.value = 'http://localhost:8080/' // Fallback to hardcoded default
  }
})

// Watch for changes in the servidores list
watch(servidores, (newServidores) => {
  // Update serverName if the currently selected one is no longer valid or if the default changed
  const currentSelectedServer = newServidores.find(s => s.direccion === serverName.value)
  const defaultServer = newServidores.find(s => s.nombre === conectarServerDefault.value)

  if (defaultServer && serverName.value !== defaultServer.direccion) {
    // If there is a default server and it's not the current one, switch to it (this might be too aggressive)
    // serverName.value = defaultServer.direccion;
  } else if (!currentSelectedServer) {
    // If the current serverName is no longer in the list (e.g., deleted)
    if (defaultServer) {
      serverName.value = defaultServer.direccion // Try to switch to default
    } else if (newServidores.length > 0) {
      serverName.value = newServidores[0].direccion // Or first available
    } else {
      serverName.value = '' // Or empty if no servers
    }
  }
}, { deep: true });

// Watch for external changes to conectarServerDefault (e.g. if another component changes it)
watch(() => configuracion.conectarServerDefault, (newDefaultServerName) => {
  conectarServerDefault.value = newDefaultServerName;
  // Optionally, update serverName to the new default server if it exists
  const newDefaultServer = servidores.value.find(s => s.nombre === newDefaultServerName);
  if (newDefaultServer) {
    serverName.value = newDefaultServer.direccion;
  }
});


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
    // Check if server with the same name or address already exists
    if (servidores.value.some(s => s.nombre === nuevo.nombre || s.direccion === nuevo.direccion)) {
      respuestas.value.push('Ya existe un servidor con ese nombre o dirección.')
      return
    }
    configuracion.servidores.push(nuevo)
    servidores.value = [...configuracion.servidores] // Update reactive ref first
    // If this is the first server added, or no default is set, make it the default
    if (servidores.value.length === 1 || !conectarServerDefault.value) {
      setConectarPorDefault(nuevo.nombre)
    }
    configuracion.guardarEnLocalStorage() // Save to localStorage
    // If this is the first server added, also select it for connection
    if (servidores.value.length === 1) {
      serverName.value = nuevo.direccion
    }
    nuevoServidorNombre.value = '' // Clear input
    nuevoServidorDireccion.value = '' // Clear input
  }
}

// Function to remove a server
function eliminarServidor(index: number) {
  const servidorEliminado = servidores.value[index];
  configuracion.servidores.splice(index, 1)
  servidores.value = [...configuracion.servidores] // Update reactive ref

  // If the deleted server was the default, update default to the first available or empty
  if (conectarServerDefault.value === servidorEliminado.nombre) {
    if (servidores.value.length > 0) {
      setConectarPorDefault(servidores.value[0].nombre)
    } else {
      setConectarPorDefault('')
    }
  }
  configuracion.guardarEnLocalStorage() // Save to localStorage
}

// Function to set a server as default for connection
function setConectarPorDefault(nombreServidor: string) {
  configuracion.conectarServerDefault = nombreServidor
  conectarServerDefault.value = nombreServidor // Update local ref
  configuracion.guardarEnLocalStorage()
}

// Computed property to check if a server is the default one
const esServidorPorDefecto = computed(() => {
  return (nombreServidor: string) => conectarServerDefault.value === nombreServidor
})

</script>
<template>
  <div class="config-sesion">
    <label for="serverSelect">Servidor:</label>
    <select id="serverSelect" v-model="serverName">
      <option v-if="servidores.length === 0" value="" disabled>
        No hay servidores configurados
      </option>
      <option v-for="servidor in servidores" :key="servidor.direccion" :value="servidor.direccion">
        {{ servidor.nombre }} ({{ servidor.direccion }}) {{ esServidorPorDefecto(servidor.nombre) ? '[Default]' : '' }}
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
          <button @click="setConectarPorDefault(servidor.nombre)" :disabled="esServidorPorDefecto(servidor.nombre)">
            {{ esServidorPorDefecto(servidor.nombre) ? 'Predeterminado' : 'Conectar por default' }}
          </button>
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

.admin-servidores li button {
  margin-left: 5px; /* Adjust margin for multiple buttons */
}
</style>
