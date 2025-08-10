<script setup lang="ts">
import { ref } from 'vue'
import configsesion from '../components/comp_configurar/configSesion.vue'
import configlogin from '../components/comp_configurar/configLogin.vue'
import configPerfil from '../components/comp_configurar/configPerfil.vue'
import configServidores from '../components/comp_configurar/configServidores.vue'
import configAcercaDe from '../components/comp_configurar/configAcercaDe.vue'

import verRelojes from '../components/comp_configurar/verRelojes.vue'
import { useAppStore } from '../stores/appStore'
import ConfigAfinador from '../components/comp_configurar/configAfinador.vue'
const appStore = useAppStore()
// Definir la canción y el contexto
const viendo = ref('login')
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
// Detectar cuál vista corresponde a la pantalla actual
</script>

<template>
  <div style="width: 100%">
    <div style="display: flex">
      <div>
        <div class="">
          <ul class="nav nav-pills flex-column mb-auto">
            <li @click="clickOpcion('login')">
              <a
                href="#"
                v-if="
                  appStore.estado === 'conectado' ||
                  appStore.estado === 'logueado'
                "
                class="nav-link text-white"
                :class="{ activo: viendo === 'login' }"
              >
                Login
              </a>
            </li>

            <li
              @click="clickOpcion('perfil')"
              v-if="appStore.estadoLogin == 'logueado'"
            >
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'perfil' }"
              >
                Perfil
              </a>
            </li>

            <li
              @click="clickOpcion('sesion')"
              v-if="
                appStore.estado == 'conectado' ||
                appStore.estadoLogin == 'logueado'
              "
            >
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'sesion' }"
              >
                Sesion
              </a>
            </li>

            <li @click="clickOpcion('servidores')">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'servidores' }"
              >
                Servidores
              </a>
            </li>

            <li @click="clickOpcion('relojes')">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'relojes' }"
              >
                Relojes
              </a>
            </li>
          </ul>

          <hr />

          <ul class="nav nav-pills flex-column mb-auto">
            <li @click="clickOpcion('Afinar')">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'Afinar' }"
              >
                Afinar
              </a>
            </li>
          </ul>
          <ul class="nav nav-pills flex-column mb-auto">
            <li @click="clickOpcion('acercade')">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'acercade' }"
              >
                Acerca de ...
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="innerConfig">
        <configlogin v-if="viendo == 'login'"></configlogin>
        <configPerfil v-if="viendo == 'perfil'"></configPerfil>
        <configsesion v-if="viendo == 'sesion'"> </configsesion>
        <configServidores v-if="viendo == 'servidores'"> </configServidores>
        <configAcercaDe v-if="viendo == 'acercade'"></configAcercaDe>
        <ConfigAfinador v-if="viendo == 'Afinar'"></ConfigAfinador>

        <verRelojes v-if="viendo == 'relojes'"></verRelojes>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
