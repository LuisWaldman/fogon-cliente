<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import cabecera from '../components/comp_editar/editarcabecera.vue'
import editAcordes from '../components/comp_editar/editAcordes.vue'
import consolaAcordes from '../components/comp_editar/consolaAcordes.vue'
import TocarLetraAcorde from '../components/comp_editar/Editar_LetraYAcordes.vue'
import Secuencia from '../components/comp_editar/Secuencia.vue'
import sugerencias from '../components/comp_editar/sugerencias.vue'
import editartexto from '../components/comp_editar/editarTexto.vue'
import { ref, watch, type Ref } from 'vue'
import { Pantalla } from '../modelo/pantalla'
import { useRouter } from 'vue-router'
import { OrigenCancion } from '../modelo/cancion/origencancion'

const pantalla = new Pantalla()
const editandoCompas = ref(-1)
function cambiarCompas(compas: number) {
  editandoCompas.value = compas
}
const appStore = useAppStore()
function guardarCambios() {
  // Create the Cancion object structure as expected by the backend
  const cancionData = {
    nombreArchivo: appStore.editandocancion?.archivo || 'archivo_default',
    datosJSON: appStore.editandocancion || {},
  }

  // Send the POST request with the cancion data
  appStore.aplicacion
    .HTTPPost('cancion', cancionData)
    .then((response) => {
      console.log('Canción guardada exitosamente', response)
      if (appStore.estadoSesion === 'conectado') {
        appStore.aplicacion.SetCancion(
          new OrigenCancion('server', appStore.editandocancion?.archivo, ''),
        )
      }
    })
    .catch((error) => {
      console.error('Error al guardar la canción', error)
    })
}
class vistaTocar {
  viendo: string = 'inicio'
  viendoacordes: boolean = true
  verEditandoMetricaEs: boolean = true
  verEditandoAcordes: boolean = true
}
const vista: Ref<vistaTocar> = ref(new vistaTocar())
function GetStylePantallaEdit() {
  return {
    width: pantalla.getAnchoPantalla() + 'px',
    height: pantalla.getAltoPantalla() + 'px',
  }
}

function estiloVistaPrincipal() {
  return `width: ${pantalla.getConfiguracionPantalla().anchoPrincipal}%; height: 100%`
}

function estiloVistaSecundaria() {
  return `width: ${100 - pantalla.getConfiguracionPantalla().anchoPrincipal}%;`
}
const ctrlEditarTexto = ref()
const ctrlSecuencia = ref()

function cambiarVista(nvista: string) {
  vista.value.viendo = nvista
  localStorage.setItem('viendo_vista_editando', nvista)
}

const router = useRouter()
function clickTocar() {
  // Redirect to edit page for the current song
  appStore.cancion = appStore.editandocancion
  router.push('/tocar')
}
function clickCerrarEditarTexto() {
  // Set the current view to 'inicio'
  cambiarVista('inicio')
}

function toArchivo(file: string) {
  return file.replace(/\s+/g, '_')
}
function DescargarJSON() {
  console.log('Descargando JSON de la canción actual...')
  const cancionJSON = JSON.stringify({
    cancion: appStore.editandocancion.cancion,
    banda: appStore.editandocancion.banda,
    acordes: {
      partes: appStore.editandocancion.acordes.partes.map((parte) => ({
        nombre: parte.nombre,
        acordes: parte.acordes,
      })),
      ordenPartes: appStore.editandocancion.acordes.ordenPartes,
    },
    escala: appStore.editandocancion.escala,
    letras: appStore.editandocancion.letras.renglones,
    bpm: appStore.editandocancion.bpm,
    calidad: appStore.editandocancion.calidad,
    compasCantidad: appStore.editandocancion.compasCantidad,
    compasUnidad: appStore.editandocancion.compasUnidad,
  })
  console.log('Descargando JSON:', cancionJSON)

  const blob = new Blob([cancionJSON], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  if (appStore.editandocancion.archivo == undefined) {
    appStore.editandocancion.archivo = toArchivo(
      appStore.editandocancion.cancion + '_' + appStore.editandocancion.banda,
    )
  }

  const nombreArchivo =
    `${appStore.editandocancion.archivo}.json`.toLocaleLowerCase()
  a.download = nombreArchivo
  a.click()
  URL.revokeObjectURL(url)
}

function Actualizar() {
  console.log('Actualizando vista de edición... CONTROL', ctrlEditarTexto.value)
  if (ctrlEditarTexto.value) {
    ctrlEditarTexto.value.Actualizar()
    ctrlSecuencia.value.Actualizar()
  }
}

watch(
  () => appStore.editandocancion.escala,
  () => {
    if (ctrlEditarTexto.value) {
      ctrlEditarTexto.value.Actualizar()
    }
  },
)

watch(
  () => appStore.editandocancion,
  () => {
    if (ctrlEditarTexto.value) {
      ctrlEditarTexto.value.Actualizar()
    }
  },
)
</script>
<template>
  <cabecera
    :cancion="appStore.editandocancion"
    :origen="appStore.origenEditando"
  ></cabecera>
  <div style="display: flex" class="relativo" :style="GetStylePantallaEdit()">
    <div style="width: 70%" :style="estiloVistaPrincipal()">
      <div
        style="position: relative; left: 96%"
        v-on:click="cambiarVista('editartexto')"
      >
        🔄
      </div>

      <TocarLetraAcorde
        v-if="vista.viendo != 'editartexto'"
        :cancion="appStore.editandocancion"
        :compas="editandoCompas"
        ref="ctrlEditarTexto"
      ></TocarLetraAcorde>

      <editartexto
        v-if="vista.viendo == 'editartexto'"
        @cerrar="clickCerrarEditarTexto"
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
        :ver-acordes="vista.verEditandoAcordes"
        :ver-metrica-es="vista.verEditandoMetricaEs"
      ></editartexto>
    </div>

    <div :style="estiloVistaSecundaria()">
      <editAcordes
        v-if="vista.viendo == 'editaracordes'"
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
      ></editAcordes>

      <consola-acordes
        v-if="vista.viendo == 'editconsolaacordes'"
        @cerrar="clickCerrarEditarTexto"
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
      ></consola-acordes>
      <Secuencia
        ref="ctrlSecuencia"
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
        @cambioCompas="cambiarCompas"
        v-if="
          vista.viendo !== 'editconsolaacordes' &&
          vista.viendo !== 'editaracordes'
        "
      ></Secuencia>
      <sugerencias
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
        @cambioCompas="cambiarCompas"
        @actualizarCancion="Actualizar"
        v-if="
          vista.viendo !== 'editconsolaacordes' &&
          vista.viendo !== 'editaracordes'
        "
      ></sugerencias>
    </div>

    <div class="dropdown dropdown-superior-derecha">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="bi bi-eye"></i>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li v-on:click="cambiarVista('editaracordes')">
          <a class="dropdown-item" href="#">Editar Acordes</a>
        </li>
        <li v-on:click="cambiarVista('editconsolaacordes')">
          <a class="dropdown-item" href="#">Consola Acordes</a>
        </li>

        <li>
          <hr class="dropdown-divider" v-if="vista.viendo == 'editartexto'" />
        </li>
        <li
          v-on:click="vista.verEditandoAcordes = !vista.verEditandoAcordes"
          v-if="vista.viendo == 'editartexto'"
        >
          <a class="dropdown-item" href="#">
            <i class="bi bi-check-circle" v-if="vista.verEditandoAcordes"></i>
            Ver Acordes</a
          >
        </li>

        <li
          v-on:click="vista.verEditandoMetricaEs = !vista.verEditandoMetricaEs"
          v-if="vista.viendo == 'editartexto'"
        >
          <a class="dropdown-item" href="#">
            <i class="bi bi-check-circle" v-if="vista.verEditandoMetricaEs"></i>
            Ver Metrica</a
          >
        </li>

        <li><hr class="dropdown-divider" /></li>

        <li @click="guardarCambios">
          <a class="dropdown-item" href="#"> Guardar Cambios</a>
        </li>

        <li @click="DescargarJSON">
          <a class="dropdown-item" href="#">Descargar JSON</a>
        </li>

        <li><hr class="dropdown-divider" /></li>

        <li @click="clickTocar()">
          <a class="dropdown-item" href="#">Tocar</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.read-the-docs {
  color: #888;
}

.relativo {
  position: relative;
}
.dropdown-superior-derecha {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
