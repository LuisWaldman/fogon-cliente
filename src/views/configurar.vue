<script setup lang="ts">
import { ref } from 'vue'
import configsesion from '../components/comp_configurar/configSesion.vue'
import configlogin from '../components/comp_configurar/configLogin.vue'
import configPerfil from '../components/comp_configurar/configPerfil.vue'
import configServidores from '../components/comp_configurar/configServidores.vue'
import configAcercaDe from '../components/comp_configurar/configAcercaDe.vue'
import ConfigVistas from '../components/comp_configurar/ConfigVistas.vue'

import { useAppStore } from '../stores/appStore'
const appStore = useAppStore()
// Definir la canción y el contexto
const viendo = ref('servidores')
if (appStore.estado === 'conectado') {
  viendo.value = 'login'
} else if (appStore.estadoLogin === 'logueado') {
  viendo.value = 'sesion'
} else {
  viendo.value = 'servidores'
}

function clickOpcion(viendostr: string) {
  viendo.value = viendostr
}
// Detectar cuál vista corresponde a la pantalla actual
</script>

<template>
  <div style="width: 100%">
    <div class="row">
      <div class="col-3">
        <div class="" style="width: 280px">
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
                appStore.estado === 'conectado' ||
                appStore.estadoLogin === 'logueado'
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
          </ul>

          <hr />
          <ul class="nav nav-pills flex-column mb-auto">
            <li @click="clickOpcion('vistas')">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'vistas' }"
              >
                Vistas
              </a>
            </li>
          </ul>
          <hr />

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

      <div class="col-9 innerConfig">
        <div v-if="viendo == 'login'" class="container">
          <configlogin></configlogin>
        </div>
        <div v-if="viendo == 'perfil'" class="container">
          <configPerfil></configPerfil>
        </div>

        <div v-if="viendo == 'sesion'">
          <configsesion> </configsesion>
        </div>

        <div v-if="viendo == 'servidores'">
          <configServidores> </configServidores>
        </div>

        <div v-if="viendo == 'vistas'">
          <ConfigVistas></ConfigVistas>
        </div>

        <div v-if="viendo == 'acercade'">
          <configAcercaDe></configAcercaDe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.innerConfig {
  padding: 20px;
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
