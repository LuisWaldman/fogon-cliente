<script setup lang="ts">
import { ref } from 'vue'
import configsesion from '../components/comp_configurar/configSesion.vue'
import configsesiones from '../components/comp_configurar/configSesiones.vue'
import configlogin from '../components/comp_configurar/configLogin.vue'
import configPerfil from '../components/comp_configurar/configPerfil.vue'
import configServidores from '../components/comp_configurar/configServidores.vue'
import configAcercaDe from '../components/comp_configurar/configAcercaDe.vue'
import configBienvenida from '../components/comp_configurar/configBienvenida.vue'
import configErrores from '../components/comp_configurar/configErrores.vue'

import verRelojes from '../components/comp_configurar/verRelojes.vue'
import { useAppStore } from '../stores/appStore'
import ConfigAfinador from '../components/comp_configurar/configAfinador.vue'
import { Configuracion } from '../modelo/configuracion'
const appStore = useAppStore()

const config = Configuracion.getInstance()
const viendo = ref('perfil')

const urlParams = new URLSearchParams(window.location.search)
const viendoUrl = urlParams.get('viendo')
if (
  viendoUrl == 'perfil' ||
  viendoUrl == 'conexion' ||
  viendoUrl == 'afinar' ||
  viendoUrl == 'relojes' ||
  viendoUrl == 'errores' ||
  viendoUrl == 'acercade' ||
  viendoUrl == 'bienvenida'
) {
  viendo.value = viendoUrl
}

const viendoConexion = ref('servidores')

function clickOpcion(viendostr: string) {
  viendo.value = viendostr
  if (['perfil', 'conexion', 'afinar'].includes(viendostr)) {
    viendoMas.value = false
  }
}
function clickOpcionConectado(viendostr: string) {
  viendoConexion.value = viendostr
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
            <div @click="clickOpcion('bienvenida')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'bienvenida' }"
              >
                Hola
              </a>
            </div>
            <div @click="clickOpcion('perfil')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'perfil' }"
              >
                Perfil
              </a>
            </div>

            <div @click="clickOpcion('afinar')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'afinar' }"
              >
                Afinar
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
            <div
              @click="clickMas('-')"
              v-if="!viendoMas && config.perfil?.ModoDesarrollador"
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
              v-if="viendoMas && config.perfil?.ModoDesarrollador"
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
            <div @click="clickOpcion('conexion')" class="config-menu-item">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'conexion' }"
              >
                Conexion
              </a>
            </div>
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
          </div>
        </div>
      </div>

      <div v-if="viendo == 'conexion'">
        <div class="config-menu">
          <div class="config-menu-group">
            <div
              @click="clickOpcionConectado('servidores')"
              class="config-menu-item"
            >
              <a
                href="#"
                class="nav-link text-white"
                :class="{
                  conectado:
                    appStore.estadosApp.estadoconeccion === 'conectado',
                  activo: viendoConexion === 'servidores',
                }"
              >
                {{
                  appStore.estadosApp.estadoconeccion === 'conectado'
                    ? 'Conectado: ' + appStore.estadosApp.nombreServidor
                    : 'Servidores'
                }}
              </a>
            </div>
            <div
              @click="clickOpcionConectado('login')"
              class="config-menu-item"
              v-if="appStore.estadosApp.estadoconeccion === 'conectado'"
            >
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendoConexion === 'login' }"
              >
                {{
                  appStore.estadosApp.estadoLogin === 'Logueado'
                    ? 'Logueado:' + 'BUSCAR USUARIO'
                    : 'Login'
                }}
              </a>
            </div>
            <div
              @click="clickOpcionConectado('sesiones')"
              class="config-menu-item"
              v-if="appStore.estadosApp.estadoconeccion === 'conectado'"
            >
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendoConexion === 'sesiones' }"
              >
                Sesiones (CA)
              </a>
            </div>
            <div
              @click="clickOpcionConectado('sesion')"
              class="config-menu-item"
            >
              <a
                href="#"
                class="nav-link text-white"
                v-if="appStore.estadosApp.estadoSesion === 'conectado'"
                :class="{ activo: viendoConexion === 'sesion' }"
              >
                Sesion actual: Sesion Actual
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="innerConfig">
        <configPerfil v-if="viendo == 'perfil'"></configPerfil>
        <configlogin
          v-if="viendo == 'conexion' && viendoConexion === 'login'"
        ></configlogin>
        <configsesion
          v-if="viendo == 'conexion' && viendoConexion === 'sesion'"
        >
        </configsesion>
        <configsesiones
          v-if="viendo == 'conexion' && viendoConexion === 'sesiones'"
        >
        </configsesiones>
        <configServidores
          v-if="viendo == 'conexion' && viendoConexion === 'servidores'"
        >
        </configServidores>

        <configAcercaDe v-if="viendo == 'acercade'"></configAcercaDe>
        <configBienvenida v-if="viendo == 'bienvenida'"></configBienvenida>
        <ConfigAfinador v-if="viendo == 'afinar'"></ConfigAfinador>
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
  padding-top: 0px;
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
.conectado {
  font-weight: bold;
  background-color: darkkhaki;
}
</style>
