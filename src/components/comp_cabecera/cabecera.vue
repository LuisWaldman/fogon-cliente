<script setup lang="ts">
import ControladorTiempo from './ControladorTiempo.vue'
import Metronomo from './metronomo.vue'
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()

const emit = defineEmits(['acciono'])

function acciono(valor: string, compas: number = 0) {
  //console.log("Acciono--->", valor, compas);
  emit('acciono', valor, compas)
}
</script>

<template>
  <nav
    class="navbar navbar-expand-lg w-100"
    style="
      background-color: #000;
      width: 100vw;
      margin-left: calc(-50vw + 50%);
      margin-right: calc(-50vw + 50%);
    "
  >
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/" style="color: inherit">
        <img src="/img/iconogrande.png" alt="Logo" width="50" />
      </router-link>

      <span
        v-if="$route.path === '/'"
        class="navbar-brand"
        style="color: inherit; font-size: 1.5rem"
      >
        Fogon: Red musical distribuida
      </span>

      <ControladorTiempo
        v-if="$route.path === '/tocar'"
        :nro_cancion="1"
        :total_canciones="1"
        :compas="appStore.compas"
        :estado="appStore.estado"
        @acciono="acciono"
      >
      </ControladorTiempo>

      <Metronomo
        v-if="$route.path === '/tocar'"
        :compas="appStore.compas"
        :estado="appStore.estado"
        ref="metronomeRef"
        :bpm_encompas="appStore.golpeDelCompas"
        :cancion="appStore.cancion"
      ></Metronomo>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Aumenta el tamaño de la fuente en pantallas grandes */
@media (min-width: 1024px) {
  .navbar-nav {
    font-size: 1.5rem;
  }
}

/* Cambia la disposición de los elementos en dispositivos móviles */
@media (max-width: 768px) {
  .navbar-nav {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centra los elementos */
  }

  .nav-item {
    margin-bottom: 10px; /* Espaciado entre los ítems */
  }

  .navbar-toggler {
    font-size: 1.5rem; /* Hace el botón de despliegue más grande */
  }
}

.logo-img {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.navbarFogon {
  width: 100%;
  display: flex;
  border: 1px solid;
  background-color: #353333;
}

.titulo-App {
  color: #a9a8f6;
  font-size: 50px;
  margin-left: 10px;
  margin-right: auto;
}

.clsDivEditando {
  border: 1px solid;
  margin: 15px 10px 5px 10px;
  border-radius: 20px;
  padding: 10px;
}

.clsEditando {
  background-color: black;
  color: #a9a8f6;
  font-size: 30px;
  border: 1px solid;
  margin: 5px;
  padding: 5px;
}
.clsEditando:focus {
  outline: none;
  border-color: #f5da09; /* Cambia el color del borde al hacer foco */
}
.otras_paginas {
  font-size: 30px;
  display: flex;
  border: 1px solid;
  margin: 10px 10px 15px 10px;
  right: 0 auto;
  border-radius: 20px;
  height: 44%;
  margin-left: auto;
}

.otra_paginas {
  margin-left: auto;
  border: 1px solid;
  margin: 5px 10px 5px 10px;
  border-radius: 20px;
  color: #a9a8f6 !important;
  font-size: medium;
}
.conectado {
  color: red;
}
.ctrl_menu {
  margin: 4px;
  padding: 10px 0px 10px 10px;
  border-radius: 20px;
  border: 1px solid;
}

.pagina_seleccionable {
  display: flex;
  border: 1px solid transparent;
  margin: 10px 0px 10px 10px;
}

.pagina_seleccionable:hover {
  border-color: black;
}

.active {
  color: red;
}

.ilogo {
  margin: 1px;
  padding-right: 12px;
  font-size: 50px;
}

.aladerecha {
  margin-left: auto;
}

.navbar {
  background-color: #fff;
  padding: 10px;
}

.navbar-brand {
  color: #8b4513; /* Color marrón para un estilo de papel viejo */
  font-size: 42px; /* Aumentar tamaño de la marca */
  text-decoration: none;
}

.navbar-toggler {
  border: none;
  background-color: transparent;
}

.navbar-toggler-icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: #8b4513;
}

.navbar-collapse {
  display: flex;
  flex-direction: column;
}

.nav-item {
  list-style: none;
}

.navbar-nav {
  display: flex;
  flex-direction: column;
}

.dropdown-menu {
  display: none;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.nav-item.dropdown:hover .dropdown-menu {
  display: flex;
}

.clase_tocar {
  font-size: 30px;
  padding: 10px;
}
.conectado {
  border-color: #f5da09;
}
</style>
