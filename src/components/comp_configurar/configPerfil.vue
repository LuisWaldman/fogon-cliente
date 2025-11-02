<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Perfil } from '../../modelo/perfil'
import { ref, onMounted, computed } from 'vue'
import { Configuracion } from '../../modelo/configuracion'
import { datosLogin } from '../../modelo/datosLogin'
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi'

const refInstrumentos = ref<InstrumentoMidi[]>(
  InstrumentoMidi.GetInstrumentos(),
)
const refCategoria = ref(InstrumentoMidi.GetCategoria())
const appStore = useAppStore()
const config = Configuracion.getInstance()
const perfil = ref(config.perfil || new Perfil('', '', '', '', ''))
perfil.value.SetDefaults()
const imageBase64 = ref('')

// Nueva referencia para el input file
const fileInputRef = ref<HTMLInputElement | null>(null)

function updateProfileWeb() {
  perfil.value.imagen = imageBase64.value
  appStore.aplicacion.enviarPerfil(perfil.value)
}

function updateProfile() {
  config.perfil = perfil.value
  config.perfil.imagen = imageBase64.value
  config.guardarEnLocalStorage()
  appStore.perfil = perfil.value
  updateProfileWeb()
}

function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imageBase64.value = reader.result as string
      updateProfile() // Actualiza perfil al cambiar imagen
    }
    reader.readAsDataURL(file)
  }
}

// Nueva función para abrir el input file
function openFileDialog() {
  fileInputRef.value?.click()
}

onMounted(() => {
  if (config.perfil != null) {
    perfil.value = config.perfil
  }

  imageBase64.value = perfil.value.imagen

  // Login: cargar datos guardados
  if (config.loginDefault && config.loginDefault.mantenerseLogeado) {
    username.value = config.loginDefault.usuario
    mantenerseLogeado.value = config.loginDefault.mantenerseLogeado
  }
})

const categoriaSeleccionada = ref('')
const instrumentoSeleccionado = ref('')

const instrumentosFiltrados = computed(() =>
  refInstrumentos.value.filter(
    (inst: InstrumentoMidi) => inst.categoria === categoriaSeleccionada.value,
  ),
)

function agregarInstrumentoFavorito() {
  if (
    instrumentoSeleccionado.value &&
    !perfil.value.instrumentosFavoritos.includes(instrumentoSeleccionado.value)
  ) {
    perfil.value.instrumentosFavoritos.push(instrumentoSeleccionado.value)
    instrumentoSeleccionado.value = ''
    updateProfile() // Actualiza perfil al agregar instrumento
  }
}

function eliminarInstrumentoFavorito(idx: number) {
  perfil.value.instrumentosFavoritos.splice(idx, 1)
  updateProfile() // Actualiza perfil al eliminar instrumento
}

const mostrarAgregarInstrumentos = ref(false)

// Login logic
const username = ref('')
const password = ref('')
const mantenerseLogeado = ref(true)
const mostrarLogin = ref(false)

async function crearLoginSeguro() {
  //const hash = await bcrypt.hash(password.value, 12)
  const hash = password.value // Temporalmente sin hash
  return new datosLogin(
    'USERPASS',
    username.value,
    hash,
    mantenerseLogeado.value,
  )
}

function loginWithCredentials() {
  if (username.value.trim() === '' || password.value.trim() === '') {
    appStore.estadosApp.estadoLogin = 'error'
    return
  }
  crearLoginSeguro()
    .then((secureLoginData) => {
      appStore.aplicacion.login(secureLoginData)
      const config = Configuracion.getInstance()
      if (mantenerseLogeado.value) {
        config.loginDefault = secureLoginData
        config.loginDefault.mantenerseLogeado = true
      } else {
        config.loginDefault = null
      }
      config.guardarEnLocalStorage()
    })
    .catch((error) => {
      appStore.errores.push(
        new Error(`Error al crear el login seguro: ${error}`),
      )
      appStore.estadosApp.estadoLogin = 'error'
    })
}

function logout() {
  mantenerseLogeado.value = false
  const config = Configuracion.getInstance()
  if (config.loginDefault) {
    config.loginDefault.mantenerseLogeado = false
    config.guardarEnLocalStorage()
  }
  appStore.aplicacion.logout()
}

// New functions for click handlers
function toggleModoDesarrollador() {
  perfil.value.ModoDesarrollador = !perfil.value.ModoDesarrollador
  updateProfile()
}

function toggleCifradoLatino() {
  perfil.value.CifradoLatino = !perfil.value.CifradoLatino
  updateProfile()
}
</script>

<template>
  <div style="margin-top: 30%; position: absolute; bottom: -300px">
    <span v-if="perfil.ModoDesarrollador" @click="toggleModoDesarrollador"
      >✅</span
    >
    <span v-if="!perfil.ModoDesarrollador" @click="toggleModoDesarrollador"
      >❌</span
    >
    <span @click="toggleModoDesarrollador">Modo desarrollador</span>
  </div>
  <div class="divPerfil">
    <div style="display: flex">
      <div class="ctrlImagen ctrlCabecera">
        <!-- Imagen de perfil con click para abrir el input file -->
        <img
          :src="imageBase64 !== '' ? imageBase64 : '/img/usuariofantasma.png'"
          alt="Profile Image"
          class="profileImage"
          @click="openFileDialog"
        />

        <!-- Input file oculto -->
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.bmp"
          id="image"
          class="fileUp"
          ref="fileInputRef"
          @change="handleImageUpload"
          style="display: none"
        />
      </div>
      <div class="ctrlNombre ctrlCabecera">
        <label for="username">Nombre</label>
        <input
          class="txtUser"
          type="text"
          id="username"
          v-model.lazy="perfil.nombre"
          placeholder="Ingresa tu nombre"
          @change="updateProfile"
        />
      </div>
      <div class="ctrlCabecera">
        <div style="margin-bottom: 5px">
          <label for="instrument">Instrumento</label>
        </div>
        <select
          id="instrument"
          v-model="perfil.instrumento"
          @change="updateProfile"
        >
          <option value="Guitarra">Guitarra</option>
          <option value="Piano">Piano</option>
          <option value="Ukelele">Ukelele</option>
          <option value="Bajo">Bajo</option>
          <option value="Percusion">Percusion</option>
          <option value="PGuitarra">Punteo</option>
          <option value="Harmonica">Harmonica</option>
        </select>
      </div>
    </div>

    <div>
      <div class="crlPerfil">
        <div>
          <div>
            <span v-if="perfil.CifradoLatino" @click="toggleCifradoLatino"
              >✅</span
            >
            <span v-if="!perfil.CifradoLatino" @click="toggleCifradoLatino"
              >❌</span
            >
            <span @click="toggleCifradoLatino">Cifrado latino</span>
          </div>

          <div>
            <label>🎼 Instrumentos Favoritos En Edicion de partituras:</label>

            <div v-if="perfil.instrumentosFavoritos.length === 0">
              No hay instrumentos favoritos.
            </div>
            <div
              style="
                display: flex;
                max-height: 200px;
                overflow-y: auto;
                border: 1px solid;
                padding: 10px;
                margin-bottom: 10px;
              "
            >
              <div
                v-for="(inst, idx) in perfil.instrumentosFavoritos"
                :key="inst"
                class="instrMidi"
              >
                <span style="flex: 1">{{ inst }}</span>
                <button
                  @click="eliminarInstrumentoFavorito(idx)"
                  style="margin-left: 10px"
                >
                  🗑
                </button>
              </div>
              <div
                v-if="!mostrarAgregarInstrumentos"
                style="margin-left: 10px; padding: 0px 5px 0px 5px"
              >
                <button
                  @click="mostrarAgregarInstrumentos = true"
                  style="margin-top: 10px"
                >
                  Agregar
                </button>
              </div>
            </div>
            <!-- Botón para mostrar el div de agregar instrumentos -->

            <!-- Div de agregar instrumentos solo visible si mostrarAgregarInstrumentos es true -->
            <div
              v-if="mostrarAgregarInstrumentos"
              style="margin-top: 10px"
              class="agregarInstrumentos"
            >
              <select v-model="categoriaSeleccionada">
                <option disabled value="">Selecciona categoría</option>
                <option v-for="cat in refCategoria" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
              <select
                v-model="instrumentoSeleccionado"
                :disabled="!categoriaSeleccionada"
              >
                <option disabled value="">Selecciona instrumento</option>
                <option
                  v-for="inst in instrumentosFiltrados"
                  :key="inst.nombre"
                  :value="inst.nombre"
                >
                  {{ inst.nombre }}
                </option>
              </select>
              <button
                @click="agregarInstrumentoFavorito"
                :disabled="!instrumentoSeleccionado"
              >
                Agregar
              </button>
              <!-- Botón "Listo" para ocultar el div -->
              <button
                @click="mostrarAgregarInstrumentos = false"
                style="margin-left: 10px"
              >
                Listo
              </button>
            </div>

            <div>
              <label for="coso">Nombre de tu fogon</label>
              <input
                type="text"
                id="coso"
                v-model.lazy="perfil.nombreSesion"
                @change="updateProfile"
              />
            </div>
            <div>
              <label for="coso">Usuario</label>
              <div style="display: flex">
                <input
                  type="text"
                  id="coso"
                  v-model.lazy="username"
                  :disabled="appStore.estadosApp.estadoLogin == 'logueado'"
                />
                <button
                  @click="mostrarLogin = !mostrarLogin"
                  v-if="
                    !mostrarLogin &&
                    appStore.estadosApp.estadoLogin != 'logueado'
                  "
                >
                  Iniciar
                </button>
                <button
                  @click="mostrarLogin = !mostrarLogin"
                  v-if="
                    mostrarLogin &&
                    appStore.estadosApp.estadoLogin != 'logueado'
                  "
                >
                  Cancelar
                </button>
                <button
                  @click="logout"
                  v-if="appStore.estadosApp.estadoLogin == 'logueado'"
                >
                  Salir
                </button>
              </div>
            </div>

            <div v-if="mostrarLogin">
              <label for="password">Clave</label>
              <div style="display: flex">
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="Clave"
                />
                <label
                  style="margin-left: 10px; display: flex; align-items: center"
                  v-if="perfil.ModoDesarrollador"
                >
                  <input
                    v-model="mantenerseLogeado"
                    type="checkbox"
                    style="margin-right: 3px"
                  />
                  Mantener
                </label>
                <button @click="loginWithCredentials" style="margin-left: 10px">
                  Ingresar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.divPerfil {
  margin-left: 4%;
  display: flex;
  flex-direction: column;
  font-size: x-large;
  gap: 1rem;
  border: 1px solid;
  padding: 30px;
  border-radius: 3%;
}
label {
  font-weight: bold;
}
input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  color: white !important;
}

.crlPerfil {
  display: flex;
  flex-wrap: wrap;
}

/* Oculta el input file */
.fileUp {
  display: none;
}

.classBotonera {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.profileImage {
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #ccc;
}
.ctrlCabecera {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 2rem;
}
.ctrlImagen {
  margin-right: 2rem;
}
.instrMidi {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  border: 1px solid;
  padding: 5px;
}

@media (max-width: 768px) {
  .divPerfil {
    font-size: small;
  }
}
</style>
