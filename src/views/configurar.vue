<script setup lang="ts">
import { ref } from 'vue'
import configsesion from '../components/comp_configurar/configSesion.vue'
import configlogin from '../components/comp_configurar/configLogin.vue'
import configPerfil from '../components/comp_configurar/configPerfil.vue'
import configServidores from '../components/comp_configurar/configServidores.vue'
import configAcercaDe from '../components/comp_configurar/configAcercaDe.vue'
import configErrores from '../components/comp_configurar/configErrores.vue'

import verRelojes from '../components/comp_configurar/verRelojes.vue'
import { useAppStore } from '../stores/appStore'
import ConfigAfinador from '../components/comp_configurar/configAfinador.vue'
const appStore = useAppStore()
// Definir la canción y el contexto
const viendo = ref('perfil')
/*
if (appStore.estado === 'conectado') {
  viendo.value = 'login'
} else if (appStore.estadoLogin === 'logueado') {
  viendo.value = 'sesion'
} else {
  viendo.value = 'servidores'
}*/

function clickOpcion(viendostr: string) {
  viendo.value = viendostr
}

const viendoMas = ref(false)
viendoMas.value = false
function clickMas(masmenos: string) {
  if (masmenos == '+') {
    viendoMas.value = false
  } else {
    viendoMas.value = true
  }
}
</script>

<template>
  <div style="width: 100%">
    <div>
      <div>
        <div class="config-menu">
          <div class="config-menu-group">
            <div @click="clickOpcion('perfil')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'perfil' }"
              >
                Perfil
              </a>
            </div>

            <div
              @click="clickOpcion('sesion')"
              class="config-menu-item"
              v-if="appStore.estado == 'conectado'"
            >
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'sesion' }"
              >
                Sesion
              </a>
            </div>
            <div @click="clickOpcion('servidores')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'servidores' }"
              >
                Conexion
              </a>
            </div>
            <div @click="clickOpcion('Afinar')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'Afinar' }"
              >
                Afinar
              </a>
            </div>
            <div
              @click="clickMas('-')"
              v-if="!viendoMas"
              class="config-menu-item"
            >
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'relojes' }"
              >
                +
              </a>
            </div>
            <div
              @click="clickMas('+')"
              v-if="viendoMas"
              class="config-menu-item"
            >
              <a href="#" class="nav-link text-white activo"> - </a>
            </div>
          </div>
        </div>
      </div>

      <div v-if="viendoMas">
        <div class="config-menu">
          <div class="config-menu-group">
            <div @click="clickOpcion('relojes')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'relojes' }"
              >
                Relojes
              </a>
            </div>
            <div @click="clickOpcion('errores')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'errores' }"
              >
                Errores
              </a>
            </div>

            <div @click="clickOpcion('acercade')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'acercade' }"
              >
                Acerca de ...
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="innerConfig">
        <configPerfil v-if="viendo == 'perfil'"></configPerfil>
        <configlogin v-if="viendo == 'login'"></configlogin>
        <configsesion v-if="viendo == 'sesion'"> </configsesion>
        <configServidores v-if="viendo == 'servidores'"> </configServidores>

        <configAcercaDe v-if="viendo == 'acercade'"></configAcercaDe>
        <ConfigAfinador v-if="viendo == 'Afinar'"></ConfigAfinador>
        <verRelojes v-if="viendo == 'relojes'"></verRelojes>
        <configErrores v-if="viendo == 'errores'"></configErrores>
      </div>
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
.innerConfig {
  padding: 20px;
  display: flex;
}

#btnGuardar {
  font-size: 30px;
}

.botoneraConfig {
  padding: 20px;
}
.activo {
  color: white;
  background-color: blueviolet;
}

.config-vista-opciones {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 6px;
}

.config-row span {
  width: 100px;
}
</style>
