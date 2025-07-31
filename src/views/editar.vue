<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import cabecera from '../components/comp_editar/editarcabecera.vue'
import editartexto from '../components/comp_editar/editartexto.vue'
import editAcordes from '../components/comp_editar/editAcordes.vue'
import TocarLetraAcorde from '../components/comp_tocar/Tocar_LetraYAcordes.vue'
import Secuencia from '../components/comp_tocar/Secuencia.vue'
import Partes from '../components/comp_tocar/Partes.vue'

import { ref, type Ref } from 'vue'
import { Pantalla } from '../modelo/pantalla'
import { useRouter } from 'vue-router'

const pantalla = new Pantalla()

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
    })
    .catch((error) => {
      console.error('Error al guardar la canción', error)
    })
}
class vistaTocar {
  viendo: string = 'acordes'
  editandoacordes: boolean = true
}
const vista: Ref<vistaTocar> = ref(new vistaTocar())
function GetStylePantallaEdit() {
  return {
    width: pantalla.getAnchoPantalla() + 'px',
    height: pantalla.getAltoPantalla() + 'px',
  }
}


function claseVistaPrincipal() {

  //return 'col-' + pantalla.getConfiguracionPantalla().anchoPrincipal
  return ''
}

function claseVistaSecundaria() {
  //return 'col-' + (11 - pantalla.getConfiguracionPantalla().anchoPrincipal)
  return ''
}

const ctrlEditarTexto = ref()

function cambiarVista(nvista: string) {
  vista.value.viendo = nvista
  localStorage.setItem('viendo_vista_editando', nvista)
}
ctrlEditarTexto.value?.updateContent()

const router = useRouter()
function clickTocar() {
  // Redirect to edit page for the current song
  appStore.cancion = appStore.editandocancion
  router.push('/tocar')
}

</script>
<template>
  <cabecera></cabecera>
  <div style="display: flex"
   class="relativo"
  :style="GetStylePantallaEdit()">
    <div style="width: 70%;" :style="claseVistaPrincipal()">
      <TocarLetraAcorde
          v-if="vista.viendo == 'acordes'"
          :cancion="appStore.cancion"
          :compas="appStore.compas"
        ></TocarLetraAcorde>

      <editartexto
        v-if="vista.viendo == 'editartexto'"
        :ref="ctrlEditarTexto"
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
      ></editartexto>
    </div>

    <div :style="claseVistaSecundaria()">

      <editAcordes
        :cancion="appStore.editandocancion"
        :compas="appStore.compas"
      ></editAcordes>
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
          <li v-on:click="cambiarVista('acordes')">
            <a class="dropdown-item" href="#">Acordes</a>
          </li>
          <li v-on:click="cambiarVista('editartexto')">
            <a class="dropdown-item" href="#">Editar Texto Acordes</a>
          </li>
          <li v-on:click="cambiarVista('editartexto')">
            <a class="dropdown-item" href="#">Editar Metrica</a>
          </li>
          <li><hr class="dropdown-divider" /></li>

          <li>
            <a class="dropdown-item" href="#">
              <i class="bi bi-check-circle" v-if="vista.editandoacordes"></i>
              Editar Acordes</a
            >
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li >
            <a class="dropdown-item" href="#"> Ajustar Tamaños</a>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li @click="guardarCambios">
            <a class="dropdown-item" href="#"> Guardar Cambios</a>
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
