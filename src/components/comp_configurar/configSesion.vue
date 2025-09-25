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
  width: 100%;
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
