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

function ir_pantalla(valor: string) {
  //console.log("Acciono--->", valor, compas);
  window.location.href = `/${valor}`
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

function actualizar_vista() {
  ctrlSesion?.value.actualizar_vista()
}

const metronomeRef = ref()
function startMetronome() {
  metronomeRef.value.startMetronome()
}

function stopMetronome() {
  metronomeRef.value.stopMetronome()
}

defineExpose({ actualizar_vista, startMetronome, stopMetronome })
</script>

<template>
  <div class="navbarFogon">
    <div
      class="pagina_seleccionable"
      :class="{ active: viendo_vista == 'tocar' }"
    >
      <p
        class="clase_tocar"
        @click="ir_pantalla('index')"
        :class="{ active: viendo_vista == 'tocar' }"
        aria-current="page"
      >
        <i style="font-size: 45px"> 🎸 </i>

        <i
          class="bi bi-fire"
          style="
            position: absolute;
            top: 30px;
            left: 22px;
            background: transparent;
          "
        >
        </i>
      </p>
    </div>

    <ControladorTiempo
      :nro_cancion="nro_cancion"
      :total_canciones="listaCanciones.length"
      :compas="compas"
      :cancion="cancion"
      :viendo_vista="viendo_vista"
      :estado="estado"
      @acciono="acciono"
      @update-compas="(valor) => acciono('update-compas', parseInt(valor))"
    >
    </ControladorTiempo>

    <div class="clsDivEditando" v-if="viendo_vista == 'editar'">
      <div>
        <input class="clsEditando" type="text" v-model="cancion.cancion" /> -
        <input class="clsEditando" type="text" v-model="cancion.banda" />
      </div>
    </div>

    <Metronomo
      v-if="viendo_vista == 'tocar'"
      :compas="compas"
      :estado="estado"
      ref="metronomeRef"
      :bpm_encompas="bpm_encompas"
      :cancion="cancion"
    ></Metronomo>

    <div class="otras_paginas">
      <div
        class="otra_paginas"
        @click="ir_pantalla('listas')"
        :class="{ active: viendo_vista == 'listas' }"
        v-if="ViendoDetalle"
      >
        <i class="bi bi-list"></i>
      </div>

      <div
        class="otra_paginas"
        @click="acciono('buscar')"
        :class="{ active: viendo_vista == 'buscar' }"
        v-if="ViendoDetalle"
      >
        <i class="bi bi-globe"></i>
      </div>

      <div
        class="otra_paginas"
        @click="ir_pantalla('config')"
        :class="{ active: viendo_vista == 'config' }"
        v-if="ViendoDetalle"
      >
        <i class="bi bi-gear-fill"></i>
      </div>
      <div
        class="otra_paginas"
        @click="ViendoDetalle = !ViendoDetalle"
        v-if="ViendoDetalle"
      >
        <i class="bi bi-dash"></i>
      </div>

      <div
        class="otra_paginas"
        @click="ViendoDetalle = !ViendoDetalle"
        v-if="!ViendoDetalle"
      >
        <i class="bi bi-plus"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbarFogon {
  width: 100%;
  display: flex;
  border: 1px solid;
  margin: 5px 10px 5px 10px;
  background-color: #353333;
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
  color: #a9a8f6;
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
