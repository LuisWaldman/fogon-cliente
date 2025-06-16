<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Sesion } from '../../modelo/sesion'
import { ref, onMounted } from 'vue'

const sesiones = ref([] as Sesion[])
const newsesio = ref(new Sesion('', 0, '', 0, 0))

const appStore = useAppStore()
function agregarSesion() {
    appStore.aplicacion.CrearSesion(newsesio.value.nombre)
}

function cargarSesiones() {
    appStore.aplicacion.HTTPGet('sesiones')
      .then((response) => response.json())
    .then((data) => {
        console.log('Sesiones obtenidas:', data)
      sesiones.value = []
      data.forEach((item: any) => {
        console.log(item)
        sesiones.value.push(new Sesion(
        item.Nombre,
        item.Usuarios,
        item.Estado,
        item.Latitud,
        item.Longitud
        ))
      })
      })
      .catch((error) => {
        console.error('Error al obtener el perfil del usuario:', error)
      })
  }
  cargarSesiones()


</script>
<template>
    <div>
        <form @submit.prevent="agregarSesion">
            <label for="nombre">Nombre de la sesión:</label>
            <input id="nombre" v-model="newsesio.nombre" required />
            <button type="submit">Iniciar Sesión</button>
            {{ appStore.estadoSesion }}
        </form>

        <table v-if="sesiones.length">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Usuarios</th>
                    <th>Estado</th>
                    <th>Latitud</th>
                    <th>Longitud</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(sesion, idx) in sesiones" :key="idx">
                    <td>{{ sesion.nombre }}</td>
                    <td>{{ sesion.usuarios }}</td>
                    <td>{{ sesion.estado }}</td>
                    <td>{{ sesion.latitud }}</td>
                    <td>{{ sesion.longitud }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
}
th, td {
    border: 1px solid #ccc;
    padding: 0.5em;
    text-align: left;
}
form {
    margin-bottom: 1em;
}
</style>
