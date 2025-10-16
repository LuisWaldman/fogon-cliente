<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import { OrigenCancion } from '../modelo/cancion/origencancion'
import { UltimasCanciones } from '../modelo/cancion/ultimascanciones'
import cancionComp from '../components/comp_home/cancion.vue'
import busquedaCanciones from '../components/comp_home/busquedaCanciones.vue'
import tablacanciones from '../components/comp_home/tablacanciones.vue'
import { ref } from 'vue'
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
listasManager.initDB().then(() => {
  listasManager.GetListas().then((listas) => {
    console.log('Listas de reproducción:', listas)
    ListasEnStorage.value = listas
    viendoListas.value = ListasEnStorage.value
    selectedLista.value = listas.length > 0 ? listas[0] : ''
  })
})

const appStore = useAppStore()
const IndiceCanciones = ref<ItemIndiceCancion[]>([])
CancionManager.getInstance()
  .GetDBIndex()
  .then((indices: ItemIndiceCancion[]) => {
    IndiceCanciones.value = indices
  })

let ultimasCanciones = new UltimasCanciones()
const refUltimasCanciones = ref([] as ItemIndiceCancion[])
refUltimasCanciones.value = ultimasCanciones.canciones
const refResultadoCanciones = ref<ItemIndiceCancion[]>([])
const totalUltimas = ref(0)
totalUltimas.value = ultimasCanciones.canciones.length

function clickTocar(cancion: OrigenCancion) {
  appStore.aplicacion.ClickTocar(cancion)
}

function clickBorrarLista(cancion: OrigenCancion) {
  IndiceCanciones.value = IndiceCanciones.value.filter(
    (c) => c.origen !== cancion,
  )
}

function handleResultados(canciones: ItemIndiceCancion[]) {
  refResultadoCanciones.value = canciones
}

const viendo = ref('inicio')
function clickOpcion(viendostr: string) {
  viendo.value = viendostr
}
const viendoOrigen = ref('localstorage')
function clickOrigen(viendostr: string) {
  viendoOrigen.value = viendostr
}

function confirmarNuevaLista() {
  if (nuevaLista.value.trim() === '') {
    alert('El nombre de la lista no puede estar vacío.')
    return
  }
  if (ListasEnStorage.value.includes(nuevaLista.value)) {
    alert('Ya existe una lista con ese nombre.')
    return
  }
  listasManager.AgregarLista(nuevaLista.value).then(() => {
    ListasEnStorage.value.push(nuevaLista.value)
    viendoListas.value = ListasEnStorage.value
    selectedLista.value = nuevaLista.value
    nuevaLista.value = ''
    addingLista.value = false
  })
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
  
  const oldName = selectedLista.value
  listasManager.RenombrarLista(oldName, nuevaLista.value).then(() => {
    const index = ListasEnStorage.value.indexOf(oldName)
    if (index !== -1) {
      ListasEnStorage.value[index] = nuevaLista.value
    }
    viendoListas.value = ListasEnStorage.value
    selectedLista.value = nuevaLista.value
    nuevaLista.value = ''
    renamingLista.value = false
  }).catch(() => {
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
    listasManager.BorrarLista(selectedLista.value).then(() => {
      ListasEnStorage.value = ListasEnStorage.value.filter(
        (lista) => lista !== selectedLista.value,
      )
      viendoListas.value = ListasEnStorage.value
      selectedLista.value = ''
    })
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

        <div @click="clickOpcion('canciones')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendo === 'canciones' }"
          >
            Tus Canciones
          </a>
        </div>

        <div @click="clickOpcion('listas')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendo === 'listas' }"
          >
            Listas de Reproduccion
          </a>
        </div>
      </div>
    </div>
  </div>

  <div style="width: 100%" v-if="viendo === 'canciones' || viendo === 'listas'">
    <div class="config-menu">
      <div class="config-menu-group">
        <div @click="clickOrigen('localstorage')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendoOrigen === 'localstorage' }"
          >
            LocalStorage
          </a>
        </div>

        <div @click="clickOrigen('server')" class="config-menu-item">
          <a
            href="#"
            class="nav-link text-white"
            :class="{ activo: viendoOrigen === 'server' }"
          >
            Servidor
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

      <!-- Mostrar resultados de búsqueda -->
      <div
        style="width: 100%"
        v-if="refResultadoCanciones.length > 0 && viendo === 'inicio'"
      >
        <div style="display: flex; flex-wrap: wrap">
          <cancionComp
            v-for="(cancion, index) in refResultadoCanciones"
            :key="index"
            :cancion="cancion"
            @click="clickTocar(cancion.origen)"
          />
        </div>
      </div>
    </div>

    <!-- Últimas canciones -->
    <div
      class="ultimasCanciones"
      v-if="refUltimasCanciones.length > 0 && viendo === 'inicio'"
    >
      <p class="primer-parrafo">Ultimas {{ totalUltimas }} Canciones</p>
      <div style="display: flex; flex-wrap: wrap">
        <cancionComp
          v-for="(cancion, index) in refUltimasCanciones"
          :key="index"
          :cancion="cancion"
          @click="clickTocar(cancion.origen)"
        />
      </div>
    </div>
    <div style="width: 100%;" v-if="viendo === 'listas'">
      <div>
      <select v-model="selectedLista" style="width: 80%;">
        <option
          v-for="(lista, index) in viendoListas"
          :key="index"
          :value="lista"
        >
          {{ lista }}
        </option>
      </select>
      <button @click="addingLista = true">Nueva Lista</button>
      <button @click="borrarLista">Borrar Lista</button>
      <button @click="renombrarLista">Renombrar Lista</button>
      </div>
      <div v-if="addingLista || renamingLista">
        <input 
          v-model="nuevaLista" 
          :placeholder="renamingLista ? 'Nuevo nombre de la lista' : 'Nueva lista'" 
        />
        <button @click="renamingLista ? confirmarRenombrarLista() : confirmarNuevaLista()">
          {{ renamingLista ? 'Renombrar' : 'Agregar' }}
        </button>
        <button @click="cancelarOperacion">Cancelar</button>
      </div>
    </div>
    <tablacanciones
      v-if="viendo === 'canciones'"
      :canciones="IndiceCanciones"
      @borrar="clickBorrarLista"
      @tocar="clickTocar"
    />
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
</style>
