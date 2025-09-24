<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue' // Import computed
import { Configuracion } from '../../modelo/configuracion' // Import Configuracion
import { Servidor } from '../../modelo/servidor' // Import Servidor
import { useAppStore } from '../../stores/appStore'

const configuracion = Configuracion.getInstance() // Get Configuracion instance
const servidores = ref<Servidor[]>(configuracion.servidores) // servidores ref
const conectarServerDefault = ref(configuracion.conectarServerDefault) // ref for default server name
const agregando = ref(false)
// Initialize serverName with the address of the default server, or first, or a hardcoded default.
const serverName = ref('')
const appStore = useAppStore()
const respuestas = ref([] as string[])
const conectado = ref(false)
const nuevoServidorNombre = ref('') // For new server name
const nuevoServidorDireccion = ref('') // For new server address

// Load servers on component mount and set initial serverName
onMounted(() => {
  servidores.value = configuracion.servidores
  conectarServerDefault.value = configuracion.conectarServerDefault

  // Determine initial serverName based on conectarServerDefault
  const defaultServer = servidores.value.find(
    (s) => s.nombre === conectarServerDefault.value,
  )
  if (defaultServer) {
    serverName.value = defaultServer.direccion
  } else if (servidores.value.length > 0) {
    serverName.value = servidores.value[0].direccion // Fallback to first server
  } else {
    serverName.value = 'http://localhost:8080/' // Fallback to hardcoded default
  }
})

// Watch for changes in the servidores list
watch(
  servidores,
  (newServidores) => {
    // Update serverName if the currently selected one is no longer valid or if the default changed
    const currentSelectedServer = newServidores.find(
      (s) => s.direccion === serverName.value,
    )
    const defaultServer = newServidores.find(
      (s) => s.nombre === conectarServerDefault.value,
    )

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
  },
  { deep: true },
)


function conectarServidor(index: number) {
  const appStore = useAppStore()
  appStore.aplicacion.conectar(servidores.value[index])
  conectado.value = true
  respuestas.value.push(`Intenta conectar: ${servidores.value[index].nombre}`)
}

// Function to add a new server
function agregarServidor() {
  if (
    nuevoServidorNombre.value.trim() !== '' &&
    nuevoServidorDireccion.value.trim() !== ''
  ) {
    agregando.value = false
    const nuevo = new Servidor(
      nuevoServidorNombre.value,
      nuevoServidorDireccion.value,
    )
    // Check if server with the same name or address already exists
    if (
      servidores.value.some(
        (s) => s.nombre === nuevo.nombre || s.direccion === nuevo.direccion,
      )
    ) {
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
  const servidorEliminado = servidores.value[index]
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

function cancelarAgregar() {
  agregando.value = false
  nuevoServidorNombre.value = ''
  nuevoServidorDireccion.value = ''
}
function ClickAgregarServidor() {
  agregando.value = true
}

// Computed property to check if a 
// server is the default one
const esServidorPorDefecto = computed(() => {
  return (nombreServidor: string) =>
    conectarServerDefault.value === nombreServidor
})
</script>
<template>
  <div class="config-sesion">
    <h1>Servidores</h1>
    <table class="tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Acciones
            <button @click="ClickAgregarServidor">Agregar Servidor</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="agregando">
          <td>
            <input
              v-model="nuevoServidorNombre"
              placeholder="Nombre del servidor"
            />
          </td>
          <td>
            <input
              v-model="nuevoServidorDireccion"
              placeholder="Dirección del servidor"
            />
          </td>
          <td>
            <button @click="agregarServidor">Agregar</button>
            <button @click="cancelarAgregar">Cancelar</button>
          </td>
        </tr>
        <tr v-for="(servidor, index) in servidores" :key="servidor.direccion" 
        :class="{ conectado: servidor.nombre === appStore.estadosApp.nombreServidor }">
          <td>{{ servidor.nombre }}</td>
          <td>{{ servidor.direccion }}</td>
          <td>
            
            <button @click="conectarServidor(index)">Conectar</button>
            <button @click="setConectarPorDefault(servidor.nombre)">
              {{ esServidorPorDefecto(servidor.nombre) ? 'Predeterminado' : 'Conectar por default' }}
            </button>
            <button @click="eliminarServidor(index)">Eliminar</button>
            
          </td>
        </tr>
        
      </tbody>
    </table>
    

  </div>
</template>

<style scoped>
.config-sesion {
  margin: 0 auto;
  width: 100%;
}
.tabla {
  width: 80%;
  margin-left: 5%;
  border: 1px solid;
}

.tabla th,
.tabla td {
  border: 1px solid;
  padding: 8px;
  text-align: left;
  font-size: x-large;
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
.conectado {
  color: white;
  background-color: darkkhaki;
}
</style>
