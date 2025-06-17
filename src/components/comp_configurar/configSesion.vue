<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Sesion } from '../../modelo/sesion'
import { UserSesion } from '../../modelo/userSesion'
import { ref } from 'vue'

const sesiones = ref([] as Sesion[])
const ususario = ref([] as UserSesion[])

const newsesio = ref(new Sesion('', 0, '', 0, 0))
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

function cargarSesiones() {
  appStore.aplicacion
    .HTTPGet('sesiones')
    .then((response) => response.json())
    .then((data) => {
      console.log('Sesiones obtenidas:', data)
      sesiones.value = []
      data.forEach(
        (item: {
          Nombre: string
          Usuarios: number
          Estado: string
          Latitud: number
          Longitud: number
        }) => {
          sesiones.value.push(
            new Sesion(
              item.Nombre,
              item.Usuarios,
              item.Estado,
              item.Latitud,
              item.Longitud,
            ),
          )
        },
      )
    })
    .catch((error) => {
      console.error('Error al obtener el perfil del usuario:', error)
    })
}


function cargarUsuariosSesion() {

  appStore.aplicacion
    .HTTPGet('usersesion')
    .then((response) => response.json())
    
    .then((data) => {
      console.log('Perfiles obtenidos:', data)
      ususario.value = []
      data.forEach(
        (item: {
          Usuario: string
          NombrePerfil: string
          RolSesion: string
        }) => {
          ususario.value.push(
            new UserSesion(
              item.Usuario,
              item.NombrePerfil,
              item.RolSesion,
            ),
          )
        },
      )


    })
    .catch((error) => {
      console.error('Error al obtener el perfil del usuario:', error)
    })


}
cargarSesiones()
</script>
<template>
  <div>
    <div>
      <label for="nombre">Nombre de la sesión:</label>
      <input id="nombre" v-model="newsesio.nombre" required />
      <button type="button" @click="crearSesion">Iniciar Sesión</button>
      {{ appStore.estadoSesion }} - {{ appStore.rolSesion }}
      <button type="button" @click="cargarSesiones">Actualizar Sesiones</button>
    </div>
    <table v-if="sesiones.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Usuarios</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(sesion, idx) in sesiones" :key="idx">
          <td>{{ sesion.nombre }}</td>
          <td>{{ sesion.usuarios }}</td>
          <td>{{ sesion.estado }}</td>
          <td>
            <button @click="unirmeSesion(sesion.nombre)">Unirse</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div style="margin-top: 2em">
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
    <div>
      <div><h3>Usuarios en la sesión</h3>
        <button @click="cargarUsuariosSesion">Cargar Usuarios</button>
        </div>
      <table v-if="ususario.length">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Perfil</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, idx) in ususario" :key="idx">
            <td>{{ user.Usuario }}</td>
            <td>{{ user.NombrePerfil }}</td>
            <td>{{ user.RolSesion }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;
}
th,
td {
  border: 1px solid #ccc;
  padding: 0.5em;
  text-align: left;
}
form {
  margin-bottom: 1em;
}
</style>
