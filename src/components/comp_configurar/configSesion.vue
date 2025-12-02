<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Sesion } from '../../modelo/sesion'
import { ref, watch } from 'vue'
import { HelperSincro } from '../../modelo/sincro/HelperSincro'

const newsesio = ref(new Sesion('default', 0, '', 0, 0))
const sesionDefault = ref('')
sesionDefault.value = localStorage.getItem('sesionDefault') || ''
function cargarSesiones() {
  appStore.aplicacion.cargarSesiones()
}
const appStore = useAppStore()
function crearSesion() {
  appStore.aplicacion.CrearSesion(newsesio.value.nombre)
}

watch(
  () => appStore.estadosApp.estadoSesion,
  (nuevoEstado) => {
    if (nuevoEstado === 'conectado') {
      cargarUsuariosSesion()
    }
  },
)

watch(
  () => appStore.rolSesion,
  (nuevoEstado) => {
    if (nuevoEstado === 'conectado') {
      cargarUsuariosSesion()
    }
  },
)

function cargarUsuariosSesion() {
  appStore.aplicacion.CargarUsuariosSesion()
}
if (appStore.estadosApp.estadoSesion === 'conectado') {
  cargarUsuariosSesion()
}
function SincronizarCon(usuario: string) {
  const helper = HelperSincro.getInstance()
  helper.SincronizarConClienteRTC(parseInt(usuario))
}
</script>
<template>
  <div class="configSesion">
    <h1>Sesion</h1>
    <div>
      <div style="width: 100%">
        <div>
          <table v-if="appStore.usuariosSesion.length" style="width: 100%">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Perfil</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, idx) in appStore.usuariosSesion" :key="idx">
                <td>
                  <img
                    v-if="user.PerfilUsr && user.PerfilUsr.imagen"
                    :src="user.PerfilUsr.imagen"
                    alt="Profile image"
                    class="profile-image"
                  />
                  {{ user.Usuario }}
                </td>

                <td>{{ user.RolSesion }}</td>
                <td>
                  <button @click="SincronizarCon(user.ID)">
                    Sincronizar RTC
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div
      class="nuevaSesion"
      v-if="appStore.estadosApp.estadoSesion != 'conectado'"
    >
      <h1>Sesiones</h1>

      <label for="nombre">Nombre de la sesión:</label>
      <input id="nombre" v-model="newsesio.nombre" required />
      <button
        @click="crearSesion"
        v-if="appStore.estadosApp.estadoSesion != 'conectado'"
      >
        Iniciar Sesión
      </button>

      <button @click="cargarSesiones">Actualizar Sesiones</button>
      {{ appStore.estadosApp.estadoSesion }} - {{ appStore.rolSesion }}
    </div>
  </div>
</template>

<style scoped>
.configSesion {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #1a1a1a;
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.configSesion h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  font-weight: bold;
  color: #a0aec0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Main sections */
.configSesion > div {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Nueva sesión section */
.nuevaSesion {
  font-size: 1.1rem;
  text-align: center;
}

.nuevaSesion h1 {
  margin-top: 0;
  margin-bottom: 20px;
}

.nuevaSesion label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #a9a8f6;
  text-align: left;
}

/* Input styles */
input[type="text"],
input#nombre {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

input[type="text"]:focus,
input#nombre:focus {
  border-color: #8b5cf6;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

input[type="text"]::placeholder,
input#nombre::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Button styles - Discrete and dark tone */
button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  margin: 4px;
  border: 2px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-height: 44px;
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

button:hover {
  border-color: rgba(169, 168, 246, 0.6);
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 8px rgba(169, 168, 246, 0.15);
  transform: translateY(-1px);
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

/* Table styles */
table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  margin-top: 20px;
}

th {
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

td {
  padding: 16px 20px;
  text-align: left;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid rgba(169, 168, 246, 0.1);
  color: #e0e0e0;
  transition: all 0.3s ease;
  vertical-align: middle;
}

tbody tr {
  transition: all 0.3s ease;
}

tbody tr:hover {
  background: rgba(169, 168, 246, 0.1);
  transform: translateX(2px);
}

tbody tr:last-child td {
  border-bottom: none;
}

/* Profile image enhanced */
.profile-image {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 2px solid rgba(169, 168, 246, 0.3);
  margin-right: 12px;
  vertical-align: middle;
  object-fit: cover;
}

/* User cell with profile image */
td:first-child {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Form styles */
form {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
}

form input {
  flex: 1;
  min-width: 200px;
  margin-bottom: 0;
}

/* Status display styling */
.nuevaSesion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.nuevaSesion > div:last-child {
  background: rgba(169, 168, 246, 0.1);
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #a9a8f6;
  text-align: center;
  margin-top: 10px;
}

/* Responsive design */
@media (max-width: 768px) {
  .configSesion {
    padding: 15px 10px;
  }
  
  .configSesion h1 {
    font-size: 2em;
  }

  .nuevaSesion {
    font-size: 1rem;
  }

  th,
  td {
    padding: 12px 10px;
    font-size: 0.9rem;
  }

  button {
    padding: 8px 12px;
    font-size: 0.8rem;
    margin: 2px;
  }

  form {
    flex-direction: column;
    align-items: stretch;
  }

  form input {
    min-width: auto;
    margin-bottom: 12px;
  }

  input[type="text"],
  input#nombre {
    font-size: 0.9rem;
    padding: 10px 12px;
    max-width: none;
  }

  .profile-image {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }

  td:first-child {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .configSesion {
    padding: 10px;
  }

  th,
  td {
    padding: 8px;
    font-size: 0.8rem;
  }

  button {
    width: 100%;
    margin: 4px 0;
    justify-content: center;
  }

  .profile-image {
    width: 35px;
    height: 35px;
  }

  td:first-child {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
}

/* Animation for new elements */
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

table tbody tr,
.configSesion > div {
  animation: fadeInUp 0.3s ease-out;
}

/* Focus states for accessibility */
button:focus {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

input[type="text"]:focus,
input#nombre:focus {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  input[type="text"],
  input#nombre,
  button {
    border-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  button,
  input[type="text"],
  input#nombre,
  tbody tr {
    transition: none;
  }

  button::before {
    display: none;
  }

  tbody tr:hover {
    transform: none;
  }

  .fadeInUp {
    animation: none;
  }
}
</style>
