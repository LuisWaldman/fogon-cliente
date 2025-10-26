<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../../stores/appStore'
import qr from './qr.vue'
import iconofogon from './iconofogon.vue'

const appStore = useAppStore()

// Define el evento
const emit = defineEmits(['abrirVistaEdicion', 'editarCancion'])

const copiado = ref(false)
const urlcompartida = ref('')
const compartiendo = ref(false)

function compartir() {
  copiado.value = false
  urlcompartida.value =
    window.location.origin +
    '/tocar?sesion=' +
    appStore.sesion.nombre.replace(/ /g, '_') +
    ''
  compartiendo.value = true
}

function dejarDeCompartir() {
  compartiendo.value = false
}

function copiarUrl() {
  if (urlcompartida.value) {
    navigator.clipboard.writeText(urlcompartida.value)
    copiado.value = true
  }
}

const crearSesion = () => {
  const nombreSesion = appStore.perfil?.nombre
    ? `${appStore.perfil.nombre} fogon`
    : 'default'

  appStore.aplicacion.CrearSesion(nombreSesion)
}

function SalirSesion() {
  appStore.aplicacion.SalirSesion()
}

const unirseSesion = (sesion: string) => {
  appStore.aplicacion.UnirmeSesion(sesion)
}

function arreglartexto(texto: string): string {
  let processed = texto.replace(/-/g, ' ')
  if (processed.length === 0) return processed

  // First letter lowercase, rest uppercase
  processed =
    processed.charAt(0).toUpperCase() + processed.slice(1).toLocaleLowerCase()

  // Truncate if longer than 50 characters
  if (processed.length > 50) {
    processed = processed.substring(0, 47) + '...'
  }

  return processed
}

function abrirVistaEdicion() {
  emit('abrirVistaEdicion')
}

function clickEditar() {
  emit('editarCancion')
}
</script>

<template>
  <nav
    class="navbarFogon navbar"
    :class="{ editando: $route.path === '/editar' }"
  >
    <div style="display: flex; width: 100%">
      <iconofogon />

      <span v-if="$route.path === '/'" class="titulocancioncontrol">
        FOGON.AR
      </span>

      <div class="titulocancioncontrol" v-if="$route.path === '/tocar'">
        {{ arreglartexto(appStore.cancion?.cancion) }} -
        {{ arreglartexto(appStore.cancion?.banda) }}
      </div>

      <span v-if="$route.path === '/configurar'" class="titulocancioncontrol">
        Configuracion
      </span>
      <span v-if="$route.path === '/editar'" class="titulocancioncontrol">
        Editando
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
            :src="appStore.perfil?.imagen || '/img/usuariofantasma.png'"
            alt="User"
            :class="{
              imgLogueado: appStore.estadosApp.estadoLogin == 'logueado',
              imgConectado: appStore.estadosApp.estadoSesion === 'conectado',
            }"
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
          <li
            class="dropdown-submenu"
            v-if="
              appStore.estado === 'conectado' || appStore.estado === 'logueado'
            "
          >
            <a
              class="dropdown-item dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-people"></i>
              🔥 Fogon
            </a>
            <ul class="">
              <li v-if="appStore.estadosApp.estadoSesion != 'conectado'">
                <a class="dropdown-item" href="#" @click="crearSesion">
                  <i class="bi bi-plus-circle"></i>
                  Crear Fogon
                </a>
              </li>
              <div v-if="appStore.estadosApp.estadoSesion != 'conectado'">
                <li v-for="(sesion, id) in appStore.sesiones" :key="id">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click="unirseSesion(sesion.nombre)"
                  >
                    <i class="bi bi-box-arrow-in-right"></i>
                    {{ sesion.nombre }}
                  </a>
                </li>
              </div>

              <li v-if="appStore.estadosApp.estadoSesion === 'conectado'">
                <a class="dropdown-item" href="#" @click="SalirSesion">
                  <i class="bi bi-box-arrow-in-right"></i>
                  Salir
                </a>
              </li>
              <li v-if="appStore.estadosApp.estadoSesion === 'conectado'">
                <a class="dropdown-item" href="#" @click="compartir">
                  <i class="bi bi-share"></i>
                  Compartir
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a
              class="dropdown-item"
              href="#"
              @click="abrirVistaEdicion"
              v-if="$route.path != '/configurar'"
            >
              👁️‍🗨️ Ver
            </a>
          </li>

          <li v-if="$route.path === '/tocar'">
            <a class="dropdown-item" href="#" @click="clickEditar">
              ✍️ Editar
            </a>
          </li>

          <li>
            <router-link
              class="dropdown-item"
              to="/configurar"
              v-if="$route.path != '/configurar'"
            >
              ⚙️ Configurar
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="compartir_sesion" v-if="compartiendo">
    <div>
      <qr :url="urlcompartida"></qr>
    </div>
    <div style="background-color: #353333; display: flex">
      <span style="margin: 3px">{{ urlcompartida }}</span>
      <button v-if="!copiado" class="btn btn-secondary" @click="copiarUrl">
        <i class="bi bi-clipboard"></i>
        Copiar URL
      </button>
      <div v-if="copiado" style="border: 1px solid; margin-left: 10px">
        Copiado
      </div>
    </div>
    <div style="display: flex; justify-content: center; margin-top: 20px">
      <button class="btn btn-secondary" @click="dejarDeCompartir">
        <i class="bi bi-x-circle"></i>
        Cerrar
      </button>
    </div>
  </div>
</template>

<style scoped>
.editando {
  background-color: #f5da09 !important;
}

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

.titulocancioncontrol {
  color: #a9a8f6;
  font-size: 2.5rem;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.dropdown-menu-end {
  right: 0;
  left: auto;
  min-width: 180px;
}

.dropdown-submenu {
  position: relative;
}

.imgConectado {
  box-sizing: content-box;
  border: 6px double #be1414 !important;
}

.imgLogueado {
  box-sizing: content-box;
  border: 2px solid #f6d7a8;
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
  z-index: 10;
}

.navbarFogon {
  width: 100%;
  display: flex;
  border: 1px solid;
  background-color: #353333 !important;
}

.navbar {
  padding: 10px;
  border: 6px solid #8b4513;
  border-left: 1px solid #a9a8f6;
  border-bottom: 0px solid #a9a8f6;
  margin-bottom: 0px;
}

@media (max-width: 768px) {
  .compartir_sesion {
    left: 10px;
  }

  .navbar {
    padding: 0;
    margin: 0;
    border: none;
  }

  .navbarFogon {
    margin: 0;
    border: none;
  }

  .titulocancioncontrol {
    font-size: 1.2rem;
    margin: 0;
    text-align: left;
    flex-grow: 1;
  }

  .dropdown-superior-derecha {
    position: relative;
    top: auto;
    margin-left: 30px;
    flex-shrink: 0;
  }
}
</style>
