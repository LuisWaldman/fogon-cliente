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
          <th>
            Acciones
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
        <tr
          v-for="(servidor, index) in servidores"
          :key="servidor.direccion"
          :class="{
            conectado: servidor.nombre === appStore.estadosApp.nombreServidor,
          }"
        >
          <td>{{ servidor.nombre }}</td>
          <td>{{ servidor.direccion }}</td>
          <td>
            <button @click="conectarServidor(index)">Conectar</button>
            <button @click="setConectarPorDefault(servidor.nombre)">
              {{
                esServidorPorDefecto(servidor.nombre)
                  ? 'Predeterminado'
                  : 'Conectar por default'
              }}
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #1a1a1a;
  color: #e0e0e0;
  min-height: 100vh;
}

.config-sesion h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  font-weight: bold;
  color: #a0aec0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.tabla th {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  color: #ffffff;
  padding: 16px 20px;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-bottom: 1px solid rgba(169, 168, 246, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.tabla th:last-child {
  text-align: center;
}

.tabla td {
  padding: 16px 20px;
  text-align: left;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid rgba(169, 168, 246, 0.1);
  color: #e0e0e0;
  transition: all 0.3s ease;
}

.tabla td:last-child {
  text-align: center;
}

.tabla tbody tr {
  transition: all 0.3s ease;
}

.tabla tbody tr:hover {
  background: rgba(169, 168, 246, 0.1);
  transform: translateX(2px);
}

.tabla tbody tr:last-child td {
  border-bottom: none;
}

/* Input styles */
.tabla input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.tabla input:focus {
  border-color: #8b5cf6;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.tabla input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Button styles - Discrete and dark tone similar to home.vue */
button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  margin: 0 4px;
  border: 2px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-height: 40px;
  background: rgba(0, 0, 0, 0.6);
  color: #a9a8f6;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(169, 168, 246, 0.1),
    transparent
  );
  transition: left 0.5s;
}

button:hover::before {
  left: 100%;
}

/* Primary button (Agregar Servidor) - More discrete */
.tabla th button {
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.2), rgba(0, 0, 0, 0.6));
  border: 2px solid rgba(169, 168, 246, 0.5);
  color: #a9a8f6;
  font-weight: 600;
  padding: 10px 20px;
  font-size: 1rem;
}

.tabla th button:hover {
  border-color: rgba(169, 168, 246, 0.8);
  background: linear-gradient(135deg, rgba(169, 168, 246, 0.3), rgba(0, 0, 0, 0.7));
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.2);
  transform: translateY(-1px);
}

/* Action buttons - Subtle hover effects */
button:hover {
  border-color: rgba(169, 168, 246, 0.6);
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.15);
  transform: translateY(-1px);
}

/* Specific button styling with discrete colors */
/* Success button (Conectar) */
.tabla tbody tr td button:nth-child(1) {
  border-color: rgba(169, 168, 246, 0.4);
  background: rgba(0, 0, 0, 0.6);
  color: #a9a8f6;
}

.tabla tbody tr td button:nth-child(1):hover {
  border-color: rgba(169, 168, 246, 0.7);
  background: rgba(169, 168, 246, 0.1);
  color: #ffffff;
}

/* Default button */
.tabla tbody tr td button:nth-child(2) {
  border-color: rgba(169, 168, 246, 0.4);
  background: rgba(0, 0, 0, 0.6);
  color: #a9a8f6;
}

.tabla tbody tr td button:nth-child(2):hover {
  border-color: rgba(169, 168, 246, 0.7);
  background: rgba(169, 168, 246, 0.1);
  color: #ffffff;
}

/* Danger button (Eliminar) */
.tabla tbody tr td button:nth-child(3) {
  border-color: rgba(169, 168, 246, 0.4);
  background: rgba(0, 0, 0, 0.6);
  color: #a9a8f6;
}

.tabla tbody tr td button:nth-child(3):hover {
  border-color: rgba(169, 168, 246, 0.7);
  background: rgba(169, 168, 246, 0.15);
  color: #ffffff;
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

button:disabled::before {
  display: none;
}

/* Connected server row */
.conectado {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%) !important;
  border-left: 4px solid #10b981 !important;
  color: #ffffff !important;
  font-weight: 600;
}

.conectado td {
  color: #ffffff;
}

.conectado:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%) !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .config-sesion {
    padding: 15px 10px;
  }
  
  .config-sesion h1 {
    font-size: 2em;
  }

  .tabla th,
  .tabla td {
    padding: 12px 10px;
    font-size: 0.9rem;
  }
  
  .tabla th button {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  button {
    padding: 6px 10px;
    font-size: 0.8rem;
    margin: 2px;
  }
  
  .tabla input {
    font-size: 0.9rem;
    padding: 8px 10px;
  }
}

@media (max-width: 480px) {
  .tabla th,
  .tabla td {
    padding: 8px;
  }
  
  button {
    display: block;
    width: 100%;
    margin: 2px 0;
  }
  
  .tabla td:last-child {
    text-align: left;
  }
}

/* Animation for new rows */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tabla tbody tr {
  animation: fadeInUp 0.3s ease-out;
}

/* Focus states for accessibility */
button:focus {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

.tabla input:focus {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}
</style>
