<script setup lang="ts">
import { Cancion } from '../../modelo/cancion/cancion'
import editarescala from './editarescala.vue'
import editararchivo from './editararchivo.vue'
import editartiempo from './editartiempo.vue'
import { Tiempo } from '../../modelo/tiempo';
const tiempo = new Tiempo()
import { ref } from 'vue'

defineProps<{
  cancion: Cancion
}>()

const viendo = ref('' as string)
function clickCambiar(nviendo: string) {
  viendo.value = nviendo
}

function clickCerrar() {
  viendo.value = ''
}
</script>

<template>
  <div class="navbarFogon">
    <label>{{ cancion.cancion }} - {{ cancion.banda }}</label>
    <label @click="clickCambiar('archivo')" @cerrar="clickCerrar">🔄</label>
    Escala: - {{ cancion.escala }}
    <label @click="clickCambiar('escala')" @cerrar="clickCerrar">🔄</label>
    <label
      >Tiempo: {{ cancion.bpm }} BPM: {{ cancion.compasCantidad }} /
      {{ cancion.compasUnidad }}</label
    >&nbsp;
    <label
      >Duracion: {{ tiempo.formatSegundos(cancion.duracionCancion) }}</label
    >
    <label @click="clickCambiar('tiempo')" @cerrar="clickCerrar">🔄</label>
    
  <div>
    <editararchivo
      v-if="viendo == 'archivo'"
      :cancion="cancion"
    ></editararchivo>
    <editarescala
      v-if="viendo == 'escala'"
      :cancion="cancion"
      @cerrar="clickCerrar"
    ></editarescala>
    <editartiempo v-if="viendo == 'tiempo'" :cancion="cancion"
    @cerrar="clickCerrar"
    ></editartiempo>
    </div>
  </div>
</template>

<style scoped>
.compartir_sesion {
  position: absolute;
  top: 160px;
  border: 7px double #a9a8f6;
  color: #a9a8f6;
  padding: 5px 10px;
  border-radius: 5px;

  z-index: 1000;
  backdrop-filter: blur(2px);
}

/* Aumenta el tamaño de la fuente en pantallas grandes */
@media (min-width: 1024px) {
  .navbar-nav {
    font-size: 1.5rem;
  }
}

.titulocancioncontrol {
  color: #a9a8f6;
  font-size: 2.5rem;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px; /* Adjust margin for spacing */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1; /* Allow title to take available space */
}

/* Añadir estilos para asegurar que el dropdown se despliegue hacia la derecha y no salga de la pantalla */
.dropdown-menu-end {
  right: 0;
  left: auto;
  min-width: 180px;
}

/* Estilos para dropdown anidado */
.dropdown-submenu {
  position: relative;
}
.imgConectado {
  box-sizing: content-box;
  border: 6px double #a9a8f6;
}
.dropdown-submenu .dropdown-menu {
  top: 0;
  right: 100%;
  left: auto;
  margin-top: -1px;
  margin-right: -1px;
  border-radius: 6px 0 6px 6px;
}

.dropdown-submenu:hover .dropdown-menu {
  display: block;
}

.dropdown-submenu > .dropdown-toggle::after {
  display: block;
  content: ' ';
  float: right;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px 5px 5px 0;
  border-right-color: #ccc;
  margin-top: 5px;
  margin-right: -10px;
}

.dropdown-submenu:hover > .dropdown-toggle::after {
  border-right-color: #999;
}

.dropdown-superior-derecha {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 5;
}

@media (max-width: 768px) {
  .compartir_sesion {
    left: 10;
  }

  .titulocancioncontrol {
    font-size: 1.5rem; /* Reduce el tamaño del texto en móviles */
    margin-left: 0; /* Alinea a la izquierda */
    margin-right: 0; /* Elimina el margen derecho */
    text-align: center; /* Centra el texto */
  }

  .dropdown-superior-derecha {
    top: 0.5rem;
    right: 0.5rem;
  }

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
  border: 1px solid;
  background-color: #353333 !important;
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
  padding: 10px;
  border: 6px solid #8b4513;
  border-top: 1px solid #a9a8f6;
  margin-bottom: 3px;
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
