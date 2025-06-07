<script setup lang="ts">
import { ref } from 'vue'
import { Configuracion, VistaTocar } from '../modelo/configuracion'
import configsesion from '../components/comp_configurar/configSesion.vue'
import configlogin from '../components/comp_configurar/configLogin.vue'

// Definir la canción y el contexto
const config = Configuracion.getInstance()
const vistasTocar = ref(config.vistasTocar.map((v) => Object.assign({}, v)))
const viendo = ref('perfil')

function clickOpcion(viendostr: string) {
  viendo.value = viendostr
}
// Detectar cuál vista corresponde a la pantalla actual

function getVistaActualIndex() {
  const w = window.innerWidth
  const h = window.innerHeight
  if (w < 700) return 0
  if (w > 1700 && h > 1000) return 2
  return 1
}
const vistaSeleccionada = ref(getVistaActualIndex())

function guardarConfiguracion() {
  config.vistasTocar = vistasTocar.value.map((v) =>
    Object.assign(new VistaTocar(), v),
  )
  config.guardarEnLocalStorage()
}
</script>

<template>
  <div style="width: 100%">
    <div class="row">
      <div class="col-3">
        <div class="" style="width: 280px">
          <ul class="nav nav-pills flex-column mb-auto">
            <li @click="clickOpcion('perfil')">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'perfil' }"
              >
                Perfil
              </a>
            </li>

            <li @click="clickOpcion('sesion')">
              <a
                href="#"
                class="nav-link text-white"
                :class="{ activo: viendo === 'sesion' }"
              >
                Sesion
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
        <div v-if="viendo == 'perfil'" class="container">
          <configlogin></configlogin>
        </div>

        <div v-if="viendo == 'sesion'">
          <configsesion> </configsesion>
        </div>

        <div v-if="viendo == 'vistas'">
          <h3>Configuración de Vistas</h3>
          <label
            >Seleccionar vista:
            <select v-model.number="vistaSeleccionada">
              <option :value="0">Celular</option>
              <option :value="1">PC</option>
              <option :value="2">Pantalla grande</option>
            </select>
          </label>
          <div
            style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px"
          >
            <b>
              {{
                vistaSeleccionada === 0
                  ? 'Celular'
                  : vistaSeleccionada === 1
                    ? 'PC'
                    : 'Pantalla grande'
              }}
            </b>
            <div class="config-vista-opciones">
              <div class="config-row">
                <span>Letra</span>
                <input
                  type="range"
                  min="8"
                  max="140"
                  v-model.number="vistasTocar[vistaSeleccionada].tamanioLetra"
                />
                <span
                  >{{ vistasTocar[vistaSeleccionada].tamanioLetra }} px</span
                >
              </div>
              <div class="config-row">
                <span>Acorde</span>
                <input
                  type="range"
                  min="8"
                  max="140"
                  v-model.number="vistasTocar[vistaSeleccionada].tamanioAcorde"
                />
                <span
                  >{{ vistasTocar[vistaSeleccionada].tamanioAcorde }} px</span
                >
              </div>
              <div class="config-row">
                <span>Acorde Solo</span>
                <input
                  type="range"
                  min="8"
                  max="140"
                  v-model.number="
                    vistasTocar[vistaSeleccionada].tamanioAcordesolo
                  "
                />
                <span
                  >{{
                    vistasTocar[vistaSeleccionada].tamanioAcordesolo
                  }}
                  px</span
                >
              </div>
              <div class="config-row">
                <span>Parte</span>
                <input
                  type="range"
                  min="8"
                  max="140"
                  v-model.number="vistasTocar[vistaSeleccionada].tamanioParte"
                />
                <span
                  >{{ vistasTocar[vistaSeleccionada].tamanioParte }} px</span
                >
              </div>
              <div class="config-row">
                <span>Acorde Parte</span>
                <input
                  type="range"
                  min="8"
                  max="140"
                  v-model.number="
                    vistasTocar[vistaSeleccionada].tamanioAcordeParte
                  "
                />
                <span
                  >{{
                    vistasTocar[vistaSeleccionada].tamanioAcordeParte
                  }}
                  px</span
                >
              </div>

              <div class="config-row">
                <span>Ancho Pantalla Principal</span>
                <input
                  type="range"
                  min="3"
                  max="11"
                  v-model.number="vistasTocar[vistaSeleccionada].anchoPrincipal"
                />
                <span
                  >{{ vistasTocar[vistaSeleccionada].anchoPrincipal }}
                </span>
              </div>
              <div class="config-row">
                <span>Descuento Alto Pantalla</span>
                <input
                  type="range"
                  min="0"
                  max="900"
                  v-model.number="
                    vistasTocar[vistaSeleccionada].altoPantallaDescuento
                  "
                />
                <span
                  >{{
                    vistasTocar[vistaSeleccionada].altoPantallaDescuento
                  }}
                  px</span
                >
              </div>
              <div class="config-row">
                <span>Factor Scroll</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  v-model.number="vistasTocar[vistaSeleccionada].factorScroll"
                />
                <span>{{ vistasTocar[vistaSeleccionada].factorScroll }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="viendo == 'acercade'">
          <div>Desarrollado por Luis Waldman para y gracias a:</div>
          <A href="https://fi.uba.ar/"
            ><img src="https://fi.uba.ar/images/logo-fiuba.png"
          /></A>

          <p></p>
          +
          <p>
            github:
            <a href="https://github.com/luchowaldman/cancionero">cancionero</a>
          </p>
          <p>
            comercial:
            <a href="https://www.instagram.com/eme.redes/">Eme.redes</a>
          </p>
          <p>donaciones al alias: la.plata.de.luis</p>
        </div>
        <div>
          <button id="btnGuardar" @click="guardarConfiguracion()">
            Guardar
          </button>
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
