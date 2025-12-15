<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../../stores/appStore'
import iconofogon from './iconofogon.vue'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import compartirctrl from '../compartir.vue'
import emoticonOrigen from '../comp_home/emoticonOrigen.vue'
import type { Cancion } from '../../modelo/cancion/cancion'
const helperNotas = HelperDisplayAcordesLatino.getInstance()
const appStore = useAppStore()
helperNotas.latino = appStore.perfil.CifradoLatino

const conCancion = ref(false)
const compas = ref(appStore.aplicacion.reproductor.compas)
const golpeDelCompas = ref(appStore.aplicacion.reproductor.golpeDelCompas)
const cancion = ref<Cancion>(appStore.aplicacion.reproductor.cancion)
// requestAnimationFrame loop control
let rafId: number | null = null
const estadoReproduccion = ref(appStore.estadosApp.estadoReproduccion)
async function EmpezarLoop() {
  // reset counter when starting
  const loop = async () => {
    // stop if state changed
    if (
      appStore.estadosApp.estadoReproduccion !== 'reproduciendo' &&
      appStore.estadosApp.estadoReproduccion !== 'iniciando'
    ) {
      rafId = null
      return
    }
    estadoReproduccion.value = appStore.estadosApp.estadoReproduccion
    compas.value = appStore.aplicacion.reproductor.compas
    golpeDelCompas.value = appStore.aplicacion.reproductor.golpeDelCompas
    estadoReproduccion.value = appStore.estadosApp.estadoReproduccion

    rafId = requestAnimationFrame(loop)
  }
  // avoid multiple loops
  if (rafId == null) {
    rafId = requestAnimationFrame(loop)
  }
}

function PararLoop() {
  if (rafId != null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function VerEstado() {
  cancion.value = appStore.aplicacion.reproductor.cancion
  compas.value = appStore.aplicacion.reproductor.compas
  golpeDelCompas.value = appStore.aplicacion.reproductor.golpeDelCompas
  conCancion.value = appStore.estadosApp.estadoCarga == 'cargada'

  if (appStore.estadosApp.estadoReproduccion == 'pausa') {
    cancion.value = appStore.aplicacion.reproductor.cancion
  }
  if (
    appStore.estadosApp.estadoReproduccion === 'reproduciendo' ||
    appStore.estadosApp.estadoReproduccion === 'iniciando'
  ) {
    EmpezarLoop()
  } else {
    PararLoop()
  }
}
VerEstado()
// Watch for changes in playback state and start/stop RAF loop
watch(
  () => appStore.estadosApp.estadoReproduccion,
  () => {
    VerEstado()
  },
)

watch(
  () => appStore.estadosApp.estadoCarga,
  () => {
    VerEstado()
  },
)

// Define el evento
const emit = defineEmits([
  'abrirVistaEdicion',
  'editarCancion',
  'abrirVistaEdicionPermisos',
])

import { watch } from 'vue'

watch(
  () => appStore.estadosApp.estadoReproduccion,
  () => {
    golpeDelCompas.value = appStore.aplicacion.reproductor.golpeDelCompas
    cancion.value = appStore.aplicacion.reproductor.cancion
    estadoReproduccion.value = appStore.estadosApp.estadoReproduccion
  },
)

const urlcompartida = ref('')
const compartiendo = ref(false)

function compartir() {
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

const crearSesion = () => {
  appStore.aplicacion.CrearSesion()
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

function abrirVistaEdicionPermisos() {
  emit('abrirVistaEdicionPermisos')
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
      <iconofogon
        :golpeDelCompas="golpeDelCompas"
        :conCancion="conCancion"
        :estadoReproduccion="estadoReproduccion"
      />
      <span v-if="$route.path === '/'" class="titulocancioncontrol">
        FOGON.AR
      </span>

      <div v-if="$route.path === '/tocar'" class="divtitulocancioncontrol">
        <div class="encabezado">
          <emoticonOrigen :origen="appStore.origenCancion.origenUrl" />
          {{ arreglartexto(cancion?.banda) }} -
          <b>{{ helperNotas.GetAcorde(cancion?.escala) }}</b>
        </div>
        <div class="cancionNombre">
          {{ arreglartexto(cancion?.cancion) }}
        </div>
      </div>

      <span v-if="$route.path === '/configurar'" class="titulocancioncontrol">
        Configuracion
      </span>
      <span v-if="$route.path === '/editar'" class="titulocancioncontrol">
        Editando
      </span>

      <div class="dropdown dropdown-superior-derecha ms-auto">
        <button
          style="background-color: #353333; border: none; position: relative"
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
          <span
            v-if="
              appStore.rolSesion === 'director' &&
              appStore.estadosApp.estadoSesion === 'conectado'
            "
            class="director-badge"
          >
            🪄
          </span>
          <span
            v-if="
              appStore.rolSesion === 'visitante' &&
              appStore.estadosApp.estadoSesion === 'conectado'
            "
            class="visitante-badge"
          >
            👀
          </span>
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

              <li
                v-if="
                  appStore.estadosApp.estadoSesion === 'conectado' &&
                  appStore.rolSesion !== 'visitante'
                "
              >
                <a
                  class="dropdown-item"
                  href="#"
                  @click="abrirVistaEdicionPermisos"
                >
                  <i class="bi bi-shield-lock"></i>

                  Administrar Fogon
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
            <a class="dropdown-item" href="#" @click="abrirVistaEdicion">
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
  <compartirctrl
    v-if="compartiendo"
    :titulo="`Fogon: ${appStore.sesion.nombre}`"
    :link="urlcompartida"
    @cerrar="dejarDeCompartir"
  />
</template>

<style scoped>
.editando {
  background-color: #f5da09 !important;
}
.visitante-badge {
  position: absolute;
  bottom: -2px;
  left: -12px;
  border-radius: 50%;
  padding: 2px;
  font-size: x-large;
  line-height: 1;
  border: 3px solid #727477;
  border-radius: 50%;
  background-color: #000000;
}
.director-badge {
  position: absolute;
  bottom: -2px;
  left: -12px;
  border-radius: 50%;
  padding: 2px;
  font-size: x-large;
  line-height: 1;
  border: 3px solid #b40c0c;
  border-radius: 50%;
  background-color: #d6431e;
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

  z-index: 100;
  border: 1px solid;
  background-color: #353333 !important;
}

.navbar {
  padding: 10px;
  border: 6px solid #977997;
  border-left: 1px solid #a9a8f6;
  border-bottom: 0px solid #a9a8f6;
  margin-bottom: 0px;
}
.dropdown-item {
  z-index: 1000;
  font-size: xx-large;
}

.cancionNombre {
  font-size: 2.2rem;
  margin: 0;
  text-align: left;
}
@media (max-width: 768px) {
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
