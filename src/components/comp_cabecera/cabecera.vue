<script setup lang="ts">
import { Cancion } from '../../modelo/cancion'
import ControladorTiempo from './ControladorTiempo.vue'
import Metronomo from './metronomo.vue'
import { ref } from 'vue'
import { itemLista } from '../../modelo/item_lista'

const emit = defineEmits(['acciono'])
const ctrlSesion = ref()
const ViendoDetalle = ref(true)

function acciono(valor: string, compas: number = 0) {
  //console.log("Acciono--->", valor, compas);
  emit('acciono', valor, compas)
}

defineProps<{
  viendo_vista: string
  compas: number
  cancion: Cancion
  nro_cancion: number
  listaCanciones: itemLista[]
  estado: string
  bpm_encompas: number
}>()

function actualizarVista() {
  ctrlSesion?.value.actualizar_vista()
}

const metronomeRef = ref()
function startMetronome() {
  metronomeRef.value.startMetronome()
}

function stopMetronome() {
  metronomeRef.value.stopMetronome()
}

defineExpose({ actualizarVista, startMetronome, stopMetronome })
</script>

<template>
  <nav class="navbarFogon">
    <router-link to="/" class="logo-link">
      <img src="/img/iconogrande.png" class="logo-img" alt="Logo" />
    </router-link>

    <h1 class="titulo-App d-none d-sm-block" ><span color="red">Fogon:</span> Red musical distribuida</h1>
  <div class="d-block d-sm-none">
  .
</div>
    <ControladorTiempo
    v-if="$route.path ===  '/tocar'"
      :nro_cancion="nro_cancion"
      :total_canciones="listaCanciones.length"
      :compas="compas"
      :cancion="cancion"
      :viendo_vista="viendo_vista"
      :estado="estado"
      @acciono="acciono"
    >
    </ControladorTiempo>

    <div class="clsDivEditando" v-if="viendo_vista == 'editar'">
      <div>
        <input class="clsEditando" type="text" v-model="cancion.cancion" /> -
        <input class="clsEditando" type="text" v-model="cancion.banda" />
      </div>
    </div>

    <Metronomo
      v-if="$route.path ===  '/tocar'"
      :compas="compas"
      :estado="estado"
      ref="metronomeRef"
      :bpm_encompas="bpm_encompas"
      :cancion="cancion"
    ></Metronomo>


    

    <div class="otras_paginas" v-if="1==2">
      
      <div
        class="otra_paginas"
        :class="{ active:  $route.path === '/listar' }"
        v-if="ViendoDetalle"
      >
      <router-link to="/listar"><i class="bi bi-list"></i>Listas</router-link>
        
      </div>

      <div
        class="otra_paginas"
        
        :class="{ active:  $route.path ===  '/buscar' }"
        v-if="ViendoDetalle"
      >
      <router-link to="/buscar"><i class="bi bi-globe"></i> Buscar</router-link>
        
      </div>

      <div
        class="otra_paginas"
        :class="{ active: $route.path === '/configurar' }"
        v-if="ViendoDetalle"
      >
      <router-link to="/configurar"><i class="bi bi-gear-fill"></i>Configurar</router-link>
        
      </div>
   

      <div
        class="otra_paginas"
        @click="ViendoDetalle = !ViendoDetalle"
        v-if="!ViendoDetalle"
      >
        <i class="bi bi-plus"></i>
      </div>
    </div>
  </nav>
</template>

<style scoped>

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
  background-color: #353333;
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
  background-color: #fff;
  padding: 10px;
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
