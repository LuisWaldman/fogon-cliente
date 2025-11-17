<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import { UltimasCanciones } from '../modelo/cancion/ultimascanciones'
import busquedaCanciones from '../components/comp_home/busquedaCanciones.vue'
import tablacanciones from '../components/comp_home/tablacanciones.vue'
import { onMounted, ref } from 'vue'
import type { ItemIndiceCancion } from '../modelo/cancion/ItemIndiceCancion'
import { CancionManager } from '../modelo/cancion/CancionManager'
import { ListasDBManager } from '../modelo/cancion/ListasDBManager'
import { vistaHome } from '../modelo/helperVistas/home/vistaHome'
import nuevaCancion from '../components/comp_home/nuevaCancion.vue'
import subirCancion from '../components/comp_home/subircancion.vue'

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
})

const nuevaLista = ref<string>('')
const addingLista = ref<boolean>(false)
const renamingLista = ref<boolean>(false)
const ListasEnStorage = ref<string[]>([])
listasManager.GetListas().then((listas: string[]) => {
  ListasEnStorage.value = listas
})

let ultimasCanciones = new UltimasCanciones()
const refUltimasCanciones = ref([] as ItemIndiceCancion[])
refUltimasCanciones.value = ultimasCanciones.canciones
const refResultadoCanciones = ref<ItemIndiceCancion[]>([])

const appStore = useAppStore()

function clickTocar(cancion: ItemIndiceCancion) {
  appStore.aplicacion.ClickTocar(cancion)
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
}

async function clickOpcion(viendostr: string) {
  if (viendo.value === viendostr) return
  cargandoCanciones.value = true
  cargandoListas.value = true
  await vistaControl.clickViendo(viendostr)
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
  await vistaControl.clickViendoOrigen(viendostr)
  await vistaControl.iniciar()
  actualizarVista()
  return
}

function confirmarNuevaLista() {
  if (nuevaLista.value.trim() === '') {
    alert('El nombre de la lista no puede estar vacío.')
    return
  }
  if (viendoListas.value == null) {
    viendoListas.value = []
  }

  if (viendoListas.value.includes(nuevaLista.value)) {
    alert('Ya existe una lista con ese nombre.')
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
    alert('Por favor, selecciona una lista para renombrar.')
    return
  }
  nuevaLista.value = viendoLista.value
  renamingLista.value = true
}

function confirmarRenombrarLista() {
  if (nuevaLista.value.trim() === '') {
    alert('El nombre de la lista no puede estar vacío.')
    return
  }
  if (nuevaLista.value === viendoLista.value) {
    renamingLista.value = false
    nuevaLista.value = ''
    return
  }
  if (ListasEnStorage.value.includes(nuevaLista.value)) {
    alert('Ya existe una lista con ese nombre.')
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
        alert('Error al renombrar la lista.')
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
      alert('Error al renombrar la lista.')
    })
}

function cancelarOperacion() {
  addingLista.value = false
  renamingLista.value = false
  nuevaLista.value = ''
}

function borrarLista() {
  if (!viendoLista.value) {
    alert('Por favor, selecciona una lista para borrar.')
    return
  }
  if (!ListasEnStorage.value.includes(viendoLista.value)) {
    alert('La lista seleccionada no existe.')
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
            (lista) => lista !== viendoLista.value,
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

function AgregarLista(index: number, listaseleccionada: string) {
  console.log('Agregar a lista:', index, listaseleccionada)
  if (listaseleccionada === 'actual') {
    appStore.aplicacion.ClickAgregarAListaReproduccion(
      viendoCanciones.value[index],
    )
    return
  }
  if (listaseleccionada.startsWith('local_')) {
    const nombreLista = listaseleccionada.replace('local_', '')
    listasManager
      .AddCancion(nombreLista, viendoCanciones.value[index])
      .then(() => {
        alert(`Canción agregada a la lista "${nombreLista}" en LocalStorage.`)
      })
      .catch(() => {
        alert('Error al agregar la canción a la lista.')
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
        alert(`Canción agregada a la lista "${nombreLista}" en el servidor.`)
      })
      .catch(() => {
        alert('Error al agregar la canción a la lista en el servidor.')
      })
  }
}
</script>

<template>
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
          v-if="appStore.listaReproduccion.length"
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
        v-if="viendo === 'inicio'"
      />

      <div
        style="width: 90%"
        v-if="viendo === 'listas' || viendo === 'canciones'"
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <select v-if="cargandoListas" style="width: 70%">
            <option disabled selected>🔥Cargando...</option>
          </select>
          <select
            v-model="viendoLista"
            @change="cambioLista"
            style="width: 70%"
            v-if="viendo === 'listas' && cargandoListas == false"
          >
            <option
              v-for="(lista, index) in viendoListas"
              :key="index"
              :value="lista"
            >
              {{ lista }}
            </option>
          </select>
          <div style="margin-left: auto">
            <button @click="AbrirNuevo" v-if="viendo === 'canciones'">
              ➕<span class="button-text">Nueva Cancion</span>
            </button>
            <subirCancion v-if="viendo === 'canciones'"></subirCancion>
            <button @click="addingLista = true" v-if="viendo === 'listas'">
              ➕<span class="button-text">Nueva Lista</span>
            </button>
            <button @click="renombrarLista" v-if="viendo === 'listas'">
              🔄<span class="button-text"> Renombrar</span>
            </button>
            <button @click="borrarLista" v-if="viendo === 'listas'">
              🗑<span class="button-text"> Borrar</span>
            </button>
          </div>
        </div>
        <div v-if="addingLista || renamingLista">
          <input
            v-model="nuevaLista"
            :placeholder="
              renamingLista ? 'Nuevo nombre de la lista' : 'Nueva lista'
            "
          />
          <button
            @click="
              renamingLista ? confirmarRenombrarLista() : confirmarNuevaLista()
            "
          >
            {{ renamingLista ? 'Renombrar' : 'Agregar' }}
          </button>
          <button @click="cancelarOperacion">Cancelar</button>
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
        @borrar="clickBorrarLista"
        @tocar="clickTocar"
        @agregar="AgregarLista"
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

/* Hide button text on mobile devices */
@media (max-width: 768px) {
  .button-text {
    display: none;
  }
}
</style>
