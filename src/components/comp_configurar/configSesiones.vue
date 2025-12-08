<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Sesion } from '../../modelo/sesion'
import { ref, watch } from 'vue'

const newsesio = ref(new Sesion('default', 0, '', 0, 0))
const sesionDefault = ref('')
sesionDefault.value = localStorage.getItem('sesionDefault') || ''
function setSesionDefault() {
  localStorage.setItem('sesionDefault', newsesio.value.nombre)
  sesionDefault.value = newsesio.value.nombre
}
function cargarSesiones() {
  appStore.aplicacion.cargarSesiones()
}
const msj = ref('')
const appStore = useAppStore()
function crearSesion() {
  appStore.aplicacion.CrearSesion(newsesio.value.nombre)
}

function MensajeASesion(msj: string) {
  appStore.aplicacion.MensajeASesion(msj)
}

function unirmeSesion(sesion: string) {
  appStore.aplicacion.UnirmeSesion(sesion)
}

function SalirSesion() {
  appStore.aplicacion.SalirSesion()
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
  () => {
    cargarUsuariosSesion()
  },
)

function cargarUsuariosSesion() {
  appStore.aplicacion.CargarUsuariosSesion()
}
if (appStore.estadosApp.estadoSesion === 'conectado') {
  cargarUsuariosSesion()
}
</script>
<template>
  <div class="configSesion">
    <div
      v-if="appStore.estadosApp.estadoSesion === 'conectado'"
      style="margin-top: 5px"
    >
      <div>
        <h1>Sesion</h1>

        <button
          @click="SalirSesion"
          v-if="appStore.estadosApp.estadoSesion == 'conectado'"
        >
          Salir de Sesión
        </button>
        <button
          @click="setSesionDefault"
          :disabled="newsesio.nombre === sesionDefault"
          v-if="appStore.estadosApp.estadoSesion == 'conectado'"
        >
          Set Default
        </button>
      </div>

      <div>
        <div>
          <form @submit.prevent="MensajeASesion(msj)">
            <input
              type="text"
              v-model="msj"
              placeholder="Escribe un mensaje"
              required
            />
            <button type="submit">Enviar</button>
          </form>
          <div
            v-if="appStore.mensajes && appStore.mensajes.length"
            style="margin-top: 1em"
          >
            <div
              v-for="(mensaje, idx) in appStore.mensajes"
              :key="idx"
              style="margin-bottom: 0.5em"
            >
              {{ mensaje }}
            </div>
          </div>
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

    <table v-if="appStore.sesiones.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Usuarios</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(sesion, idx) in appStore.sesiones" :key="idx">
          <td>{{ sesion.nombre }}</td>
          <td>{{ sesion.usuarios }}</td>
          <td>{{ sesion.estado }}</td>
          <td>
            <button
              v-if="appStore.estadosApp.estadoSesion != 'conectado'"
              @click="unirmeSesion(sesion.nombre)"
            >
              Unirse
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
}

.configSesion h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  font-weight: bold;
  color: #a0aec0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Session controls section */
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
}

.nuevaSesion label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #a9a8f6;
}

/* Input styles */
input[type='text'] {
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

input[type='text']:focus {
  border-color: #8b5cf6;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

input[type='text']::placeholder {
  color: rgba(255, 255, 255, 0.5);
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

/* Messages section */
.configSesion div div {
  margin-top: 20px;
}

.configSesion div div > div {
  background: rgba(169, 168, 246, 0.1);
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  color: #e0e0e0;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.configSesion div div > div:hover {
  background: rgba(169, 168, 246, 0.15);
  border-color: rgba(169, 168, 246, 0.3);
}

/* Status display */
.configSesion .nuevaSesion {
  text-align: center;
}

/* Profile image */
.profile-image {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 2px solid rgba(169, 168, 246, 0.3);
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

  input[type='text'] {
    font-size: 0.9rem;
    padding: 10px 12px;
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

input[type='text']:focus {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  input[type='text'],
  button {
    border-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  button,
  input[type='text'],
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
