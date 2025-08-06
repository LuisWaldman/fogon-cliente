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
  () => appStore.estadoSesion,
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
if (appStore.estadoSesion === 'conectado') {
  cargarUsuariosSesion()
}
</script>
<template>
  <div class="configSesion">
    <div v-if="appStore.estadoSesion === 'conectado'" style="margin-top: 5px">
      <div>
        <h1>Sesion</h1>

        <button
          @click="SalirSesion"
          v-if="appStore.estadoSesion == 'conectado'"
        >
          Salir de Sesión
        </button>
        <button
          @click="setSesionDefault"
          :disabled="newsesio.nombre === sesionDefault"
          v-if="appStore.estadoSesion == 'conectado'"
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
        <div>
          <div style="display: flex">
            <h3>Usuarios en la sesión</h3>
            <button @click="cargarUsuariosSesion">Actualizar Usuarios</button>
          </div>
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
                <td>{{ user.ID }} , {{ user.Usuario }}</td>
                <td>
                  <img
                    v-if="user.PerfilUsr && user.PerfilUsr.imagen"
                    :src="user.PerfilUsr.imagen"
                    alt="Profile image"
                    class="profile-image"
                  />
                  {{ user.PerfilUsr.nombre }}
                </td>
                <td>{{ user.RolSesion }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="nuevaSesion" v-if="appStore.estadoSesion != 'conectado'">
      <h1>Sesiones</h1>

      <label for="nombre">Nombre de la sesión:</label>
      <input id="nombre" v-model="newsesio.nombre" required />
      <button @click="crearSesion" v-if="appStore.estadoSesion != 'conectado'">
        Iniciar Sesión
      </button>

      <button @click="cargarSesiones">Actualizar Sesiones</button>
      {{ appStore.estadoSesion }} - {{ appStore.rolSesion }}
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
              v-if="appStore.estadoSesion != 'conectado'"
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
.profile-image {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 0.5em;
  text-align: left;
}
form {
  margin-bottom: 1em;
}
.nuevaSesion {
  font-size: large;
}
.configSesion {
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 600px) {
  .nuevaSesion {
    display: flex;
    font-size: medium;
    flex-direction: column;
  }
}
</style>
