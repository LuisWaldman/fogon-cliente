<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Sesion } from '../../modelo/sesion'
import { ref, onMounted } from 'vue'

const sesiones = ref([] as Sesion[])
const newsesio = ref(new Sesion('', 0, '', 0, 0))

function agregarSesion() {
    sesiones.value.push({ ...newsesio.value })
    newsesio.value = new Sesion('', 0, '', 0, 0)
}

</script>
<template>
    <div>
        <form @submit.prevent="agregarSesion">
            <label for="nombre">Nombre de la sesión:</label>
            <input id="nombre" v-model="newsesio.nombre" required />
            <button type="submit">Iniciar Sesión</button>
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
