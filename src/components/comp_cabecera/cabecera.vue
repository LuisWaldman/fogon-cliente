<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()
</script>

<template>
  <nav class="navbarFogon navbar">
    <div style="display: flex; width: 100%">
      <router-link class="navbar-brand" to="/" style="color: inherit">
        <img
          :src="
            appStore.estado === 'conectado'
              ? '/img/conectado.png'
              : appStore.estado === 'tocando'
                ? '/img/tocando.png'
                : appStore.estado === 'logueado'
                  ? '/img/logueado.png'
                  : appStore.estado === 'conectadoserver'
                    ? '/img/conectado.png'
                    : '/img/desconectado.png'
          "
          alt="Logo"
          width="50"
        />
      </router-link>
      <span v-if="$route.path === '/'" class="titulocancioncontrol">
        Fogon: Red musical distribuida
      </span>

      <div class="titulocancioncontrol" v-if="$route.path === '/tocar'">
        {{ appStore.cancion?.cancion }} -
        {{ appStore.cancion?.banda }}
      </div>
      <span v-if="$route.path === '/configurar'" class="titulocancioncontrol">
        Configuracion
      </span>
      
      <div class="dropdown dropdown-superior-derecha ms-auto">
        <button
          style="background-color: #353333; border: none"
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            :src="appStore.perfil?.imagen || '/img/UsuarioDesconecdado.png'"
            alt="User"
            style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
            "
          />
        </button>
        <ul
          class="dropdown-menu dropdown-menu-end"
          aria-labelledby="dropdownMenuButton"
        >
          <li>
            <router-link class="dropdown-item" to="/configurar">
              <i class="bi bi-check-circle"></i>
              Configurar
            </router-link>
          </li>
        </ul>
      </div>
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

.dropdown-superior-derecha {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
}

/* Cambia la disposición de los elementos en dispositivos móviles */
@media (max-width: 768px) {
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
  display: flex;
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
  border-left: 1px solid #a9a8f6;
  border-bottom: 1px solid #a9a8f6;
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
