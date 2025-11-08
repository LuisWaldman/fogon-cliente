<script setup lang="ts">
import { Cancion } from '../../modelo/cancion/cancion'
import editarescala from './editarescala.vue'
import editararchivo from './editararchivo.vue'
import editarmedias from './editarmedias.vue'
import editartiempo from './editartiempo.vue'
import emoticonOrigen from '../comp_home/emoticonOrigen.vue'
import { Tiempo } from '../../modelo/tiempo'
const tiempo = new Tiempo()
import { ref } from 'vue'
import { OrigenCancion } from '../../modelo/cancion/origencancion'
import { useAppStore } from '../../stores/appStore'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import { CancionManager } from '../../modelo/cancion/CancionManager'
import { HelperJSON } from '../../modelo/cancion/HelperJSON'
import { HelperDisplayEditTexto } from '../../modelo/displayEditTexto/helperDisplayEditTexto'
import type { textoResumen } from '../../modelo/displayEditTexto/textoResumen'
const helper = HelperDisplayAcordesLatino.getInstance()
function arreglartexto(texto: string): string {
  if (texto == null || texto === undefined) return ''
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
const props = defineProps<{
  cancion: Cancion
  origen: OrigenCancion
}>()

const viendo = ref('' as string)
const emit = defineEmits(['viendo'])
function clickCambiar(nviendo: string) {
  emit('viendo', nviendo)
  viendo.value = nviendo
}

const appStore = useAppStore()
function clickCerrar(modificado: boolean) {
  viendo.value = ''
  if (modificado) {
    appStore.cancionModificada = true
  }
}
helper.latino = appStore.perfil.CifradoLatino

const helperTexto = new HelperDisplayEditTexto()
const refTexto = ref<textoResumen>(helperTexto.getResumen(props.cancion.letras))
function guardarCambios(origenDestino: string) {
  CancionManager.getInstance()
    .Save(
      new OrigenCancion(
        origenDestino,
        props.origen.fileName,
        props.origen.usuario,
      ),
      props.cancion,
    )
    .catch((error) => {
      console.error('Error al guardar los cambios:', error)
    })
}

function DescargarJSON() {
  const cancionJSON = HelperJSON.CancionToJSON(props.cancion)
  const blob = new Blob([cancionJSON], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const nombreArchivo =
    `${appStore.editandocancion.archivo}.json`.toLocaleLowerCase()
  a.download = nombreArchivo
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="navbarFogon">
    <div style="display: flex; flex-wrap: wrap">
      <div
        class="divctrlEdit"
        :class="viendo === 'archivo' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('archivo')"
      >
        <div style="display: flex">
          <emoticonOrigen :origen="origen.origenUrl" />
          <label>{{ arreglartexto(cancion.banda) }}</label>
          <label v-if="cancion.calidad == -1">♻️</label>
          <label v-else-if="cancion.calidad == 0">⭐⚫⚫⚫⚫</label>
          <label v-else-if="cancion.calidad == 1">⭐⭐⚫⚫⚫</label>
          <label v-else-if="cancion.calidad == 2">⭐⭐⭐⚫⚫</label>
        </div>
        <div class="tituloEdit titulocancion">
          {{ arreglartexto(cancion.cancion) }}
        </div>
      </div>
      <div
        class="divctrlEdit"
        :class="viendo === 'escala' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('escala')"
      >
        <label>Escala</label>
        <div>
          <label class="tituloEdit" v-if="cancion.escala">{{
            helper.GetAcorde(cancion.escala)
          }}</label>
        </div>
      </div>

      <div
        class="divctrlEdit"
        :class="viendo === 'tiempo' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('tiempo')"
      >
        <label>BPM: {{ cancion.bpm }} </label>
        <div>
          <label class="tituloEdit">{{
            tiempo.formatSegundos(cancion.duracionCancion)
          }}</label>
        </div>
      </div>

      <div
        class="divctrlEdit"
        :class="viendo === 'editartexto' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('editartexto')"
      >
        <label>🔤 Letra</label>
        <div>
          <div>Versos: {{ refTexto.versos }}</div>
          <div>Silabas: {{ refTexto.silabas }}</div>
          <div>Rimas: {{ refTexto.rimas }}</div>
        </div>
      </div>
      <div
        class="divctrlEdit"
        :class="viendo === 'acordes' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('acordes')"
      >
        <label>🎸 Acordes</label>
        <div>
          <div>Acordes: 4</div>
          <div>Partes: 2</div>
          <div>Funciones: I VI V</div>
        </div>
      </div>

      <div
        class="divctrlEdit"
        :class="viendo === 'partituras' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('partituras')"
      >
        <label>Partituras</label>
        <div>
          <label class="tituloEdit">
            🎼 {{ cancion.pentagramas.length }}
          </label>
        </div>
      </div>

      <div
        class="divctrlEdit"
        :class="viendo === 'medias' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('medias')"
      >
        <label>📺 Video</label>
        <div>
          <label class="tituloEdit" v-if="cancion.medias.length > 0">📺</label>
          <label class="tituloEdit" v-else>No</label>
        </div>
      </div>

      <div class="divctrlEdit">
        <label>Guardar</label>
        <div>
          <button @click="guardarCambios('local')">💾</button>
          <button
            v-if="appStore.estadosApp.estadoLogin === 'logueado'"
            @click="guardarCambios('server')"
          >
            🗄️
          </button>
          <button @click="DescargarJSON" class="btnDescarga">⬇️</button>
        </div>
      </div>
    </div>

    <div
      class="divctrlEdit"
      v-if="
        viendo == 'medias' ||
        viendo == 'archivo' ||
        viendo == 'escala' ||
        viendo == 'tiempo'
      "
    >
      <editarmedias
        v-if="viendo == 'medias'"
        :cancion="cancion"
        :origen="origen"
        @cerrar="clickCerrar"
      ></editarmedias>
      <editararchivo
        v-if="viendo == 'archivo'"
        @cerrar="clickCerrar"
        :cancion="cancion"
        :origen="origen"
      ></editararchivo>
      <editarescala
        v-if="viendo == 'escala'"
        :cancion="cancion"
        @cerrar="clickCerrar"
      ></editarescala>
      <editartiempo
        v-if="viendo == 'tiempo'"
        :cancion="cancion"
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
.tituloEdit {
  font-size: xx-large;
  font-weight: bold;
}
.divctrlEdit {
  padding: 12px;
  margin-left: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 1px solid;
}

.divctrlEdit button {
  height: 80%;
  font-size: large;
}

.edintandoCtrl {
  border: 2px solid #9b1616;
  background: linear-gradient(135deg, #000000 0%, #974343 100%);
}
.titulocancion {
  width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 768px) {
  .divctrlEdit {
    left: 0px;
    top: 0px;
    padding: 0px;
    margin-left: 5px;
    font-size: small;
    font-size: small;
  }
  .tituloEdit {
    font-size: medium;
  }
}
</style>
