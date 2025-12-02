<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import { UltimasCanciones } from '../modelo/cancion/ultimascanciones'
import busquedaCanciones from '../components/comp_home/busquedaCanciones.vue'
import tablacanciones from '../components/comp_home/tablacanciones.vue'
import { onMounted, ref, watch } from 'vue'
import type { ItemIndiceCancion } from '../modelo/cancion/ItemIndiceCancion'
import { CancionManager } from '../modelo/cancion/CancionManager'
import { ListasDBManager } from '../modelo/cancion/ListasDBManager'
import { vistaHome } from '../modelo/helperVistas/home/vistaHome'
import nuevaCancion from '../components/comp_home/nuevaCancion.vue'
import subirCancion from '../components/comp_home/subircancion.vue'
import { Logger } from '../modelo/logger'

const viendoNueva = ref(false)
const listasManager: ListasDBManager = new ListasDBManager()

const vistaControl: vistaHome = new vistaHome()
const viendo = ref(vistaControl.viendo)
const viendoOrigen = ref(vistaControl.viendoOrigen)
const viendoCanciones = ref<ItemIndiceCancion[]>(vistaControl.viendoCanciones)
const viendoListas = ref<string[]>(vistaControl.viendoListas)
const viendoLista = ref<string>('')
const cargandoCanciones = ref<boolean>(true)
const cargandoListas = ref<boolean>(true)
const viendoTexto = ref('')

function AbrirNuevo() {
  viendoNueva.value = true
}

function CerrarNuevo() {
  viendoNueva.value = false
}

function actualizarVista() {
  viendo.value = vistaControl.viendo
  viendoOrigen.value = vistaControl.viendoOrigen
  viendoCanciones.value = vistaControl.viendoCanciones
  viendoListas.value = vistaControl.viendoListas
  viendoLista.value = vistaControl.viendoLista
  viendoTexto.value = vistaControl.viendoTexto
}

async function Cargar() {
  await vistaControl.iniciar()
  actualizarVista()
  cargandoCanciones.value = false
  cargandoListas.value = false
}

onMounted(() => {
  cargandoCanciones.value = true
  cargandoListas.value = true
  Cargar()
  verificarVersion()
})

const nuevaLista = ref<string>('')
const addingLista = ref<boolean>(false)
const renamingLista = ref<boolean>(false)
const ListasEnStorage = ref<string[]>([])
const viendoOpcionesLista = ref<boolean>(false)
listasManager.GetListas().then((listas: string[]) => {
  ListasEnStorage.value = listas
})

let ultimasCanciones = new UltimasCanciones()
const refUltimasCanciones = ref([] as ItemIndiceCancion[])
refUltimasCanciones.value = ultimasCanciones.canciones
const refResultadoCanciones = ref<ItemIndiceCancion[]>([])

const appStore = useAppStore()

function clickTocar(cancion: ItemIndiceCancion, indice: number) {
  if (viendoOrigen.value === 'reproduccion' && viendo.value === 'listas') {
    appStore.aplicacion.ClickCancionNro(indice)
  } else {
    appStore.aplicacion.ClickTocar(cancion)
  }
}
function tocarLista() {
  if (viendoLista.value == null || viendoLista.value === '') {
    return
  }
  Logger.log('Tocando lista: ' + viendoLista.value)
  appStore.aplicacion.ClickTocarLista(viendoCanciones.value)
}

function clickBorrarLista(cancion: ItemIndiceCancion) {
  viendoCanciones.value = viendoCanciones.value.filter(
    (c) => c.fileName !== cancion.fileName,
  )
}

function handleResultados(canciones: ItemIndiceCancion[]) {
  refResultadoCanciones.value = canciones
  viendoTexto.value = 'Mostrando ' + canciones.length + '  de búsqueda'
  viendoCanciones.value = canciones
  appStore.busqueda = canciones
}
function borrarResultados() {
  appStore.busqueda = []
  Cargar()
}

async function clickOpcion(viendostr: string) {
  if (viendo.value === viendostr) return
  cargandoCanciones.value = true
  cargandoListas.value = true
  const conLista = appStore.listaReproduccion.length > 0
  const conLogin = appStore.estadosApp.estadoLogin === 'logueado' ? true : false
  await vistaControl.clickViendo(viendostr, conLogin, conLista)
  await Cargar()
  return
}

async function cambioLista() {
  cargandoCanciones.value = true
  await vistaControl.cambioLista(viendoLista.value)
  actualizarVista()
  cargandoCanciones.value = false
  return
}

async function clickOrigen(viendostr: string) {
  if (viendoOrigen.value === viendostr) return
  console.log('Cambiando origen a:', viendostr)
  if (appStore.estadosApp.estadoLogin === 'logueado') {
  }
  await vistaControl.clickViendoOrigen(viendostr)
  await vistaControl.iniciar()
  Cargar()
  return
}

watch(
  () => appStore.nroCancion,
  () => {
    if (viendoOrigen.value === 'reproduccion' && viendo.value === 'listas') {
      Cargar()
    }
  },
)

watch(
  () => appStore.listaReproduccion,
  () => {
    if (viendoOrigen.value === 'reproduccion' && viendo.value === 'listas') {
      actualizarVista()
    }
  },
)

function confirmarNuevaLista() {
  if (nuevaLista.value.trim() === '') {
    mostrarError('El nombre de la lista no puede estar vacío.')
    return
  }
  if (viendoListas.value == null) {
    viendoListas.value = []
  }

  if (viendoListas.value.includes(nuevaLista.value)) {
    mostrarError('Ya existe una lista con ese nombre.')
    return
  }
  if (viendoOrigen.value === 'server') {
    CancionManager.getInstance()
      .listasServerManager?.AgregarLista(nuevaLista.value)
      .then(() => {
        appStore.listasEnServer.push(nuevaLista.value)
        nuevaLista.value = ''
        viendoLista.value = nuevaLista.value
        addingLista.value = false
      })
  } else {
    listasManager.AgregarLista(nuevaLista.value).then(() => {
      ListasEnStorage.value.push(nuevaLista.value)
      viendoLista.value = nuevaLista.value
      nuevaLista.value = ''
      addingLista.value = false
    })
  }
}

function renombrarLista() {
  if (!viendoLista.value) {
    mostrarError('Por favor, selecciona una lista para renombrar.')
    return
  }
  nuevaLista.value = viendoLista.value
  renamingLista.value = true
}

function confirmarRenombrarLista() {
  if (nuevaLista.value.trim() === '') {
    mostrarError('El nombre de la lista no puede estar vacío.')
    return
  }
  if (nuevaLista.value === viendoLista.value) {
    renamingLista.value = false
    nuevaLista.value = ''
    return
  }
  if (ListasEnStorage.value.includes(nuevaLista.value)) {
    mostrarError('Ya existe una lista con ese nombre.')
    return
  }
  if (viendoOrigen.value === 'server') {
    CancionManager.getInstance()
      .listasServerManager?.RenombrarLista(viendoLista.value, nuevaLista.value)
      .then(() => {
        const index = appStore.listasEnServer.indexOf(viendoLista.value)
        if (index !== -1) {
          appStore.listasEnServer[index] = nuevaLista.value
        }
        viendoListas.value = appStore.listasEnServer
        viendoLista.value = nuevaLista.value
        nuevaLista.value = ''
        renamingLista.value = false
      })
      .catch(() => {
        mostrarError('Error al renombrar la lista.')
        Logger.logError(
          'renombrandoLista',
          'Error al renombrar la lista en el servidor.',
        )
      })
    return
  }
  const oldName = viendoLista.value
  listasManager
    .RenombrarLista(oldName, nuevaLista.value)
    .then(() => {
      const index = ListasEnStorage.value.indexOf(oldName)
      if (index !== -1) {
        ListasEnStorage.value[index] = nuevaLista.value
      }
      viendoListas.value = ListasEnStorage.value
      viendoLista.value = nuevaLista.value
      nuevaLista.value = ''
      renamingLista.value = false
    })
    .catch(() => {
      mostrarError('Error al renombrar la lista.')
      Logger.logError(
        'renombrandoLista',
        'Error al renombrar la lista en el almacenamiento local.',
      )
    })
}

function cancelarOperacion() {
  addingLista.value = false
  renamingLista.value = false
  nuevaLista.value = ''
}

function borrarLista() {
  if (!viendoLista.value) {
    mostrarError('Por favor, selecciona una lista para borrar.')
    return
  }
  if (!ListasEnStorage.value.includes(viendoLista.value)) {
    mostrarError('La lista seleccionada no existe.')
    return
  }
  if (
    confirm(
      `¿Estás seguro de que deseas borrar la lista "${viendoLista.value}"?`,
    )
  ) {
    if (viendoOrigen.value === 'server') {
      CancionManager.getInstance()
        .listasServerManager?.BorrarLista(viendoLista.value)
        .then(() => {
          appStore.listasEnServer = appStore.listasEnServer.filter(
            (lista: string) => lista !== viendoLista.value,
          )
          viendoListas.value = appStore.listasEnServer
          viendoLista.value = ''
        })
      return
    }

    listasManager.BorrarLista(viendoLista.value).then(() => {
      ListasEnStorage.value = ListasEnStorage.value.filter(
        (lista) => lista !== viendoLista.value,
      )
      viendoListas.value = ListasEnStorage.value
      viendoLista.value = ''
    })
  }
}

async function AgregarALista(index: number, listaseleccionada: string) {
  if (listaseleccionada === 'actual') {
    appStore.aplicacion.reproductor.AgregarAListaReproduccion(
      viendoCanciones.value[index],
    )
    return
  }
  if (listaseleccionada.startsWith('local_')) {
    const nombreLista = listaseleccionada.replace('local_', '')
    listasManager
      .AddCancion(nombreLista, viendoCanciones.value[index])
      .then(() => {
        mostrarAdvertencia(
          `Canción agregada a la lista "${nombreLista}" en LocalStorage.`,
        )
      })
      .catch(() => {
        mostrarError('Error al agregar la canción a la lista.')
        Logger.logError(
          'agregarCancion',
          'Error al agregar la canción a la lista en LocalStorage.',
        )
      })
    return
  }
  if (listaseleccionada.startsWith('server_')) {
    const nombreLista = listaseleccionada.replace('server_', '')
    CancionManager.getInstance()
      .listasServerManager?.AddCancion(
        nombreLista,
        viendoCanciones.value[index],
      )
      .then(() => {
        mostrarAdvertencia(
          `Canción agregada a la lista "${nombreLista}" en el servidor.`,
        )
      })
      .catch(() => {
        mostrarError('Error al agregar la canción a la lista en el servidor.')
        Logger.logError(
          'agregarCancion',
          'Error al agregar la canción a la lista en el servidor.',
        )
      })
  }
}

const advertenciaText = ref<string>('')
const errorText = ref<string>('')
function mostrarError(texto: string) {
  errorText.value = texto
}
function mostrarAdvertencia(texto: string) {
  advertenciaText.value = texto
}

// Buscar ultima version
declare const __APP_VERSION__: string
const versionActual = __APP_VERSION__

async function verificarVersion() {
  try {
    const response = await fetch(
      window.location.origin + '/index.html?_=' + Date.now(),
      {
        cache: 'no-cache',
      },
    )
    const html = await response.text()

    // Buscar el script principal que contiene la versión
    const scriptMatch = html.match(/src="([^"]+\.js)"/)
    if (!scriptMatch) return

    // Obtener el hash del archivo que indica la versión
    const scriptUrl = scriptMatch[1]
    const hashActual = scriptUrl.match(/index-([^.]+)\.js/)

    // Guardar el hash en localStorage
    const hashGuardado = localStorage.getItem('app_version_hash')
    const hashNuevo = hashActual ? hashActual[1] : null

    if (!hashGuardado && hashNuevo) {
      // Primera vez, guardar
      localStorage.setItem('app_version_hash', hashNuevo)
      localStorage.setItem('app_version', versionActual)
    } else if (hashGuardado && hashNuevo && hashGuardado !== hashNuevo) {
      // Hay una nueva versión desplegada
      advertenciaText.value =
        'Nueva versión disponible. Haz clic para actualizar'
    }
  } catch (error) {
    console.error('Error al verificar versión:', error)
  }
}

// Al hacer clic en la advertencia de actualización, recargar
function clickAdvertencia() {
  if (
    advertenciaText.value.toLowerCase().includes('actualizar') ||
    advertenciaText.value.toLowerCase().includes('versión')
  ) {
      localStorage.removeItem('app_version_hash')
      window.location.reload()
  } else {
    advertenciaText.value = ''
  }
}
</script>

<template>
  <div
    class="advertencia"
    v-if="advertenciaText != ''"
    @click="clickAdvertencia"
  >
    {{ advertenciaText }}
  </div>
  <div class="error" v-if="errorText != ''" @click="errorText = ''">
    {{ errorText }}
  </div>
  <nuevaCancion v-if="viendoNueva" @cerrar="CerrarNuevo"></nuevaCancion>
  <div style="width: 100%">
    <div class="config-menu">
      <div class="config-menu-group">
        <div @click="clickOpcion('inicio')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendo === 'inicio' }"
          >
            Inicio
          </a>
        </div>

        <div @click="clickOpcion('listas')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendo === 'listas' }"
          >
            🗒️ Listas
          </a>
        </div>

        <div @click="clickOpcion('canciones')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendo === 'canciones' }"
          >
            Canciones
          </a>
        </div>
      </div>
    </div>
  </div>

  <div style="width: 100%" v-if="viendo === 'canciones' || viendo === 'listas'">
    <div class="config-menu">
      <div class="config-menu-group">
        <div
          v-if="appStore.listaReproduccion.length && viendo === 'listas'"
          @click="clickOrigen('reproduccion')"
          class="config-menu-item"
        >
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendoOrigen === 'reproduccion' }"
          >
            Reproduciendo ( {{ appStore.listaReproduccion.length }} )
          </a>
        </div>
        <div @click="clickOrigen('localstorage')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendoOrigen === 'localstorage' }"
          >
            💾 LocalStorage
          </a>
        </div>

        <div
          @click="clickOrigen('server')"
          class="config-menu-item"
          v-if="appStore.estadosApp.estadoLogin === 'logueado'"
        >
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendoOrigen === 'server' }"
          >
            🗄️ Servidor
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="home">
    <div
      style="
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      "
    >
      <!-- Componente de búsqueda -->
      <busquedaCanciones
        @resultados="handleResultados"
        @borrar="borrarResultados"
        v-if="viendo === 'inicio'"
      />

      <div
        class="lista-controls-container"
        v-if="
          (viendo === 'listas' && viendoOrigen != 'reproduccion') ||
          viendo === 'canciones'
        "
      >
        <div class="lista-main-row">
          <div class="select-container">
            <select v-if="cargandoListas" class="lista-select loading">
              <option disabled selected>🔥 Cargando...</option>
            </select>
            <select
              v-model="viendoLista"
              @change="cambioLista"
              class="lista-select"
              v-if="viendo === 'listas' && cargandoListas == false"
            >
              <option value="">Selecciona una lista...</option>
              <option
                v-for="(lista, index) in viendoListas"
                :key="index"
                :value="lista"
              >
                {{ lista }}
              </option>
            </select>
          </div>

          <div class="actions-container">
            <button
              @click="AbrirNuevo"
              v-if="viendo === 'canciones'"
              class="action-btn primary"
            >
              <span class="btn-icon">➕</span>
              <span class="button-text">Nueva Canción</span>
            </button>
            <subirCancion v-if="viendo === 'canciones'"></subirCancion>

            <button
              @click="tocarLista"
              v-if="viendo === 'listas'"
              class="action-btn play"
              :disabled="!viendoLista"
            >
              <span class="btn-icon">▶</span>
              <span class="button-text">Tocar Lista</span>
            </button>
            <button
              @click="viendoOpcionesLista = !viendoOpcionesLista"
              v-if="viendo === 'listas' && !viendoOpcionesLista"
              class="action-btn primary"
            >
              +
            </button>
            <template v-if="viendo === 'listas' && viendoOpcionesLista">
              <button @click="addingLista = true" class="action-btn success">
                <span class="btn-icon">➕</span>
                <span class="button-text">Nueva Lista</span>
              </button>
              <button
                @click="renombrarLista"
                class="action-btn warning"
                :disabled="!viendoLista"
              >
                <span class="btn-icon">🔄</span>
                <span class="button-text">Renombrar</span>
              </button>
              <button
                @click="borrarLista"
                class="action-btn danger"
                :disabled="!viendoLista"
              >
                <span class="btn-icon">🗑</span>
                <span class="button-text">Borrar</span>
              </button>
              <button
                @click="viendoOpcionesLista = false"
                class="action-btn primary"
              >
                −
              </button>
            </template>
          </div>
        </div>

        <div v-if="addingLista || renamingLista" class="lista-form-container">
          <div class="form-row">
            <input
              v-model="nuevaLista"
              :placeholder="
                renamingLista ? 'Nuevo nombre de la lista' : 'Nueva lista'
              "
              class="lista-input"
              @keydown.enter="
                renamingLista
                  ? confirmarRenombrarLista()
                  : confirmarNuevaLista()
              "
            />
            <button
              @click="
                renamingLista
                  ? confirmarRenombrarLista()
                  : confirmarNuevaLista()
              "
              class="action-btn confirm"
              :disabled="!nuevaLista.trim()"
            >
              {{ renamingLista ? 'Renombrar' : 'Agregar' }}
            </button>
            <button @click="cancelarOperacion" class="action-btn cancel">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <p class="primer-parrafo" v-if="viendo === 'inicio'">
        {{ viendoTexto }}
      </p>

      <tablacanciones
        v-if="viendoTexto != ''"
        :canciones="viendoCanciones"
        :listasserverstore="appStore.listasEnServer"
        :listasstore="ListasEnStorage"
        :cargando="cargandoCanciones"
        :agregarLista="AgregarALista"
        :nro-cancion="appStore.nroCancion"
        :ver-cancion-actual="
          viendoOrigen === 'reproduccion' && viendo === 'listas'
        "
        @borrar="clickBorrarLista"
        @tocar="clickTocar"
        :ver-borrar="viendo != 'inicio'"
      />
    </div>
  </div>
</template>

<style scoped>
.config-menu-group {
  display: flex;
  width: 100%;
}
.config-menu-item {
  flex: 1;
  text-align: center;
  margin: 0px;
  border-radius: 5px;
  padding-bottom: 5px;
  transition: all 0.3s ease;
}
.config-menu-item:hover {
  background-color: rgba(138, 43, 226, 0.5);
}
.primer-parrafo {
  font-size: x-large;
}
.home {
  width: 100%;
  padding: 20px;
}
.activo {
  color: white;
  background-color: blueviolet;
}

/* Lista Controls Styles */
.lista-controls-container {
  width: 90%;
  margin-bottom: 20px;
}

.lista-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.select-container {
  flex: 1;
  max-width: 400px;
}

.lista-select {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #a9a8f6;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
}

.lista-select:focus {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 0 20px rgba(169, 168, 246, 0.2);
  background: rgba(0, 0, 0, 0.9);
}

.lista-select:hover {
  border-color: rgba(169, 168, 246, 0.6);
  background: rgba(0, 0, 0, 0.8);
}

.lista-select.loading {
  background: linear-gradient(
    45deg,
    rgba(169, 168, 246, 0.1),
    rgba(0, 0, 0, 0.7)
  );
  animation: loading-pulse 1.5s ease-in-out infinite;
}

.lista-select option {
  background: rgba(0, 0, 0, 0.9);
  color: #a9a8f6;
  padding: 8px;
}

.lista-select option:hover {
  background: rgba(169, 168, 246, 0.2);
}

/* Actions Container */
.actions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-height: 44px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.btn-icon {
  font-size: 1.1em;
  display: flex;
  align-items: center;
}

/* Button variants */
.action-btn.primary {
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2),
    rgba(0, 0, 0, 0.6)
  );
}

.action-btn.primary:hover {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

.action-btn.play {
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2),
    rgba(0, 0, 0, 0.6)
  );
}

.action-btn.play:hover:not(:disabled) {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

.action-btn.success {
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2),
    rgba(0, 0, 0, 0.6)
  );
}

.action-btn.success:hover {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

.action-btn.warning {
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2),
    rgba(0, 0, 0, 0.6)
  );
}

.action-btn.warning:hover:not(:disabled) {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

.action-btn.danger {
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2),
    rgba(0, 0, 0, 0.6)
  );
}

.action-btn.danger:hover:not(:disabled) {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

.action-btn.confirm {
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.3),
    rgba(0, 0, 0, 0.6)
  );
}

.action-btn.confirm:hover:not(:disabled) {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.4);
  transform: translateY(-2px);
}

.action-btn.cancel {
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2),
    rgba(0, 0, 0, 0.6)
  );
}

.action-btn.cancel:hover {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.action-btn:disabled::before {
  display: none;
}

.action-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Form Container */
.lista-form-container {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(44, 44, 44, 0.4)
  );
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  backdrop-filter: blur(10px);
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.lista-input {
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #a9a8f6;
  transition: all 0.3s ease;
  outline: none;
}

.lista-input:focus {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 0 20px rgba(169, 168, 246, 0.2);
  background: rgba(0, 0, 0, 0.8);
}

.lista-input::placeholder {
  color: rgba(169, 168, 246, 0.5);
}

/* Loading animation */
@keyframes loading-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .lista-main-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .select-container {
    max-width: none;
  }

  .actions-container {
    justify-content: center;
  }

  .button-text {
    display: none;
  }

  .action-btn {
    min-width: 44px;
    padding: 10px 12px;
  }

  .form-row {
    flex-direction: column;
    align-items: stretch;
  }

  .lista-input {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .lista-controls-container {
    width: 95%;
  }

  .actions-container {
    gap: 6px;
  }

  .action-btn {
    font-size: 0.8rem;
    padding: 8px 10px;
    min-height: 40px;
  }

  .lista-select,
  .lista-input {
    font-size: 0.9rem;
    padding: 10px 12px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .lista-select,
  .lista-input {
    border-width: 3px;
  }

  .action-btn {
    border-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .action-btn,
  .lista-select,
  .lista-input {
    transition: none;
  }

  .action-btn::before {
    display: none;
  }

  .loading-pulse {
    animation: none;
  }

  .action-btn:hover {
    transform: none;
  }
}

.error {
  width: 100%;
  background-color: brown;
  font-size: 1.2em;
}

.advertencia {
  width: 100%;
  background-color: rgb(238, 195, 115);
  color: red;
  font-size: 1.2em;
}
</style>
