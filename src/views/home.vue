<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import { OrigenCancion } from '../modelo/cancion/origencancion'
import { UltimasCanciones } from '../modelo/cancion/ultimascanciones'
import busquedaCanciones from '../components/comp_home/busquedaCanciones.vue'
import tablacanciones from '../components/comp_home/tablacanciones.vue'
import { onMounted, ref } from 'vue'
import type { ItemIndiceCancion } from '../modelo/cancion/ItemIndiceCancion'
import { CancionManager } from '../modelo/cancion/CancionManager'
import { ListasDBManager } from '../modelo/cancion/ListasDBManager'

const listasManager: ListasDBManager = new ListasDBManager()
const selectedLista = ref<string>('')
const nuevaLista = ref<string>('')
const addingLista = ref<boolean>(false)
const renamingLista = ref<boolean>(false)
const viendoListas = ref<string[]>([])
const ListasEnStorage = ref<string[]>([])

let ultimasCanciones = new UltimasCanciones()
const refUltimasCanciones = ref([] as ItemIndiceCancion[])
refUltimasCanciones.value = ultimasCanciones.canciones
const refViendoCanciones = ref<ItemIndiceCancion[]>([])
const refResultadoCanciones = ref<ItemIndiceCancion[]>([])

listasManager.initDB().then(() => {
  listasManager.GetListas().then((listas) => {
    console.log('Listas de reproducción:', listas)
    ListasEnStorage.value = listas
    viendoListas.value = ListasEnStorage.value
    selectedLista.value = listas.length > 0 ? listas[0] : ''
  })
})

const appStore = useAppStore()
const CancionesLocalstorage = ref<ItemIndiceCancion[]>([])

CancionManager.getInstance()
  .GetDBIndex()
  .then((indices: ItemIndiceCancion[]) => {
    CancionesLocalstorage.value = indices
  })

const textoMostrando = ref(
  refViendoCanciones.value.length === 0
    ? ''
    : 'Ultimas ' + refViendoCanciones.value.length + ' canciones',
)

function clickTocar(cancion: OrigenCancion) {
  appStore.aplicacion.ClickTocar(cancion)
}

onMounted(() => {
  refViendoCanciones.value = refUltimasCanciones.value
  textoMostrando.value =
    refViendoCanciones.value.length === 0
      ? ''
      : 'Ultimas ' + refViendoCanciones.value.length + ' canciones'
})

function clickBorrarLista(cancion: OrigenCancion) {
  refViendoCanciones.value = refViendoCanciones.value.filter(
    (c) => c.origen !== cancion,
  )
}

function handleResultados(canciones: ItemIndiceCancion[]) {
  refResultadoCanciones.value = canciones
  textoMostrando.value = 'Mostrando ' + canciones.length + '  de búsqueda'
  refViendoCanciones.value = canciones
}

const viendo = ref('inicio')
const viendoOrigen = ref('localstorage')
function clickOpcion(viendostr: string) {
  if (viendostr === 'inicio') {
    refViendoCanciones.value = refUltimasCanciones.value
    textoMostrando.value =
      refViendoCanciones.value.length === 0
        ? ''
        : 'Ultimas ' + refViendoCanciones.value.length + ' canciones'
  } else if (viendostr === 'canciones') {
    refViendoCanciones.value = CancionesLocalstorage.value
  } else if (viendostr === 'listas') {
    cambioLista()
  }
  viendo.value = viendostr
}
function cambioLista() {
  if (viendoOrigen.value === 'reproduccion') {
    refViendoCanciones.value = appStore.listaReproduccion
    if (appStore.listaReproduccion.length > 0) {
      viendoOrigen.value = 'reproduccion'
    }
  } else if (viendoOrigen.value === 'localstorage') {
    console.log('Cargando lista desde LocalStorage:', selectedLista.value)
    listasManager.GetCanciones(selectedLista.value).then((canciones) => {
      refViendoCanciones.value = canciones
    })
  } else if (viendoOrigen.value === 'server') {
    refViendoCanciones.value = []
  }
}
function clickOrigen(viendostr: string) {
  viendoOrigen.value = viendostr
  if (viendo.value === 'canciones') {
    if (viendoOrigen.value === 'localstorage') {
      refViendoCanciones.value = CancionesLocalstorage.value
    } else {
      //refViendoCanciones.value = appStore.serviciosEnReproduccion
    }
  }
  if (viendo.value === 'listas') {
    if (viendoOrigen.value === 'localstorage') {
      viendoListas.value = ListasEnStorage.value
      selectedLista.value = viendoListas.value.length
        ? viendoListas.value[0]
        : ''
    }
    cambioLista()
  }

  if (viendoOrigen.value === 'localstorage') {
    if (viendo.value === 'canciones') {
      refViendoCanciones.value = CancionesLocalstorage.value
    } else if (viendo.value === 'listas') {
      viendoListas.value = ListasEnStorage.value
    }
  } else if (viendoOrigen.value === 'server') {
    if (viendo.value === 'canciones') {
      //refViendoCanciones.value = appStore.IndicesServer
    } else if (viendo.value === 'listas') {
      // Aquí podrías implementar la lógica para obtener las listas del servidor
      viendoListas.value = appStore.listasEnServer
    }
  }
}

function confirmarNuevaLista() {
  if (nuevaLista.value.trim() === '') {
    alert('El nombre de la lista no puede estar vacío.')
    return
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
        selectedLista.value = nuevaLista.value
        addingLista.value = false
      })
  } else {
    listasManager.AgregarLista(nuevaLista.value).then(() => {
      ListasEnStorage.value.push(nuevaLista.value)
      selectedLista.value = nuevaLista.value
      nuevaLista.value = ''
      addingLista.value = false
    })
  }
}

function renombrarLista() {
  if (!selectedLista.value) {
    alert('Por favor, selecciona una lista para renombrar.')
    return
  }
  nuevaLista.value = selectedLista.value
  renamingLista.value = true
}

function confirmarRenombrarLista() {
  if (nuevaLista.value.trim() === '') {
    alert('El nombre de la lista no puede estar vacío.')
    return
  }
  if (nuevaLista.value === selectedLista.value) {
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
      .listasServerManager?.RenombrarLista(
        selectedLista.value,
        nuevaLista.value,
      )
      .then(() => {
        const index = appStore.listasEnServer.indexOf(selectedLista.value)
        if (index !== -1) {
          appStore.listasEnServer[index] = nuevaLista.value
        }
        viendoListas.value = appStore.listasEnServer
        selectedLista.value = nuevaLista.value
        nuevaLista.value = ''
        renamingLista.value = false
      })
      .catch(() => {
        alert('Error al renombrar la lista.')
      })
    return
  }
  const oldName = selectedLista.value
  listasManager
    .RenombrarLista(oldName, nuevaLista.value)
    .then(() => {
      const index = ListasEnStorage.value.indexOf(oldName)
      if (index !== -1) {
        ListasEnStorage.value[index] = nuevaLista.value
      }
      viendoListas.value = ListasEnStorage.value
      selectedLista.value = nuevaLista.value
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
  if (!selectedLista.value) {
    alert('Por favor, selecciona una lista para borrar.')
    return
  }
  if (!ListasEnStorage.value.includes(selectedLista.value)) {
    alert('La lista seleccionada no existe.')
    return
  }
  if (
    confirm(
      `¿Estás seguro de que deseas borrar la lista "${selectedLista.value}"?`,
    )
  ) {
    if (viendoOrigen.value === 'server') {
      CancionManager.getInstance()
        .listasServerManager?.BorrarLista(selectedLista.value)
        .then(() => {
          appStore.listasEnServer = appStore.listasEnServer.filter(
            (lista) => lista !== selectedLista.value,
          )
          viendoListas.value = appStore.listasEnServer
          selectedLista.value = ''
        })
      return
    }

    listasManager.BorrarLista(selectedLista.value).then(() => {
      ListasEnStorage.value = ListasEnStorage.value.filter(
        (lista) => lista !== selectedLista.value,
      )
      viendoListas.value = ListasEnStorage.value
      selectedLista.value = ''
    })
  }
}

function AgregarLista(index: number, listaseleccionada: string) {
  console.log('Agregar a lista:', index, listaseleccionada)
  if (listaseleccionada === 'actual') {
    appStore.aplicacion.ClickAgregarAListaReproduccion(
      refViendoCanciones.value[index],
    )
    return
  }
  if (listaseleccionada.startsWith('local_')) {
    const nombreLista = listaseleccionada.replace('local_', '')
    listasManager
      .AddCancion(nombreLista, refViendoCanciones.value[index])
      .then(() => {
        alert(`Canción agregada a la lista "${nombreLista}" en LocalStorage.`)
      })
      .catch(() => {
        alert('Error al agregar la canción a la lista.')
      })
    return
  }
}
</script>

<template>
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
            🧠 LocalStorage
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
          <select
            v-model="selectedLista"
            @change="cambioLista"
            style="width: 70%"
            v-if="viendo === 'listas'"
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
            <button @click="addingLista = true" v-if="viendo === 'canciones'">
              ➕<span class="button-text"> Cancion</span>
            </button>
            <button @click="addingLista = true" v-if="viendo === 'canciones'">
              ⬆️<span class="button-text"> SUBIR</span>
            </button>
            <button @click="addingLista = true" v-if="viendo === 'listas'">
              ➕<span class="button-text"> LISTA</span>
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
        {{ textoMostrando }}
      </p>

      <tablacanciones
        v-if="textoMostrando != ''"
        :canciones="refViendoCanciones"
        :listasserverstore="appStore.listasEnServer"
        :listasstore="ListasEnStorage"
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
  padding: 10px;
  margin: 0 2px;
  border-radius: 5px;
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
