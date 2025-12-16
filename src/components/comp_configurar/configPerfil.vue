<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Perfil } from '../../modelo/perfil'
import { ref, onMounted, computed } from 'vue'
import { Configuracion } from '../../modelo/configuracion'
import { datosLogin } from '../../modelo/datosLogin'
import { InstrumentoMidi } from '../../modelo/midi/InstrumentoMidi'
import { Logger } from '../../modelo/logger'
import SelectInstrumentoFogon from '../SelectInstrumentoFogon.vue'

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

// Instrumento Fogón ahora se maneja con el componente SelectInstrumentoFogon
const instrumentoFogon = ref(perfil.value.instrumento || 'teclado')

// Detectar el instrumento base al montar
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

  // Inicializar el instrumento Fogón
  instrumentoFogon.value = perfil.value.instrumento || 'teclado'
})

function onInstrumentoFogonChange(nuevoInstrumento: string) {
  perfil.value.instrumento = nuevoInstrumento
  instrumentoFogon.value = nuevoInstrumento
  updateProfile()
}

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
      Logger.logError(
        'Login',
        error instanceof Error ? error.message : String(error),
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
        <SelectInstrumentoFogon
          v-model="instrumentoFogon"
          @update:modelValue="onInstrumentoFogonChange"
        />
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
                flex-wrap: wrap;
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

              <div style="display: flex">
                <label for="coso">Rol Default</label>
                <select
                  v-model="perfil.defaultEnSesion"
                  @change="updateProfile"
                  style="margin-left: 10px"
                >
                  <option value="admin">Admin</option>
                  <option value="visitante">Visitante</option>
                </select>
              </div>
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
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(44, 44, 44, 0.4)
  );
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #a9a8f6;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid rgba(169, 168, 246, 0.3);
  background: rgba(0, 0, 0, 0.6);
  color: white !important;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

input:focus,
textarea:focus,
select:focus {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 0 20px rgba(169, 168, 246, 0.2);
  background: rgba(0, 0, 0, 0.8);
}

input:hover,
textarea:hover,
select:hover {
  border-color: rgba(169, 168, 246, 0.6);
  background: rgba(0, 0, 0, 0.7);
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

select {
  cursor: pointer;
}

select option {
  background: rgba(0, 0, 0, 0.9);
  color: #a9a8f6;
  padding: 8px;
}

select option:hover {
  background: rgba(169, 168, 246, 0.2);
}

button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-height: 44px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  position: relative;
  overflow: hidden;
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2),
    rgba(0, 0, 0, 0.6)
  );
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s;
}

button:hover:not(:disabled)::before {
  left: 100%;
}

button:hover:not(:disabled) {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

button:disabled::before {
  display: none;
}

.crlPerfil {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.crlPerfil > div > div {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(44, 44, 44, 0.4)
  );
  border-radius: 12px;
  border: 1px solid rgba(169, 168, 246, 0.2);
}

.fileUp {
  display: none;
}

.classBotonera {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.profileImage {
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 50%;
  border: 3px solid rgba(169, 168, 246, 0.6);
  transition: all 0.3s ease;
  object-fit: cover;
  box-shadow: 0 4px 16px rgba(169, 168, 246, 0.3);
}

.profileImage:hover {
  transform: scale(1.05);
  border-color: rgba(169, 168, 246, 0.9);
  box-shadow: 0 6px 20px rgba(169, 168, 246, 0.5);
}

.ctrlCabecera {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.ctrlImagen {
  display: flex;
  align-items: center;
  justify-content: center;
}

.instrMidi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.1),
    rgba(0, 0, 0, 0.4)
  );
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 200px;
  max-width: 300px;
}

.instrMidi:hover {
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2),
    rgba(0, 0, 0, 0.5)
  );
  border-color: rgba(169, 168, 246, 0.5);
  transform: translateX(4px);
}

.instrMidi button {
  padding: 0.4rem 0.8rem;
  background: linear-gradient(
    135deg,
    rgba(220, 20, 60, 0.3),
    rgba(0, 0, 0, 0.6)
  );
  border-color: rgba(220, 20, 60, 0.5);
  font-size: 1rem;
}

.instrMidi button:hover {
  background: linear-gradient(
    135deg,
    rgba(220, 20, 60, 0.5),
    rgba(0, 0, 0, 0.7)
  );
  border-color: rgba(220, 20, 60, 0.8);
  box-shadow: 0 4px 20px rgba(220, 20, 60, 0.3);
}

.agregarInstrumentos {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(44, 44, 44, 0.4)
  );
  border-radius: 8px;
  border: 1px solid rgba(169, 168, 246, 0.2);
}

.agregarInstrumentos select {
  flex: 1;
  min-width: 150px;
}

.agregarInstrumentos button {
  flex-shrink: 0;
}

.txtUser {
  font-size: 1.1rem;
  font-weight: 500;
}

/* Estilos para checkboxes personalizados */
input[type='checkbox'] {
  width: auto;
  cursor: pointer;
  accent-color: rgba(169, 168, 246, 0.8);
}

/* Estilos para las opciones clickeables */
.crlPerfil span[onclick],
.crlPerfil span {
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s ease;
}

.crlPerfil span[onclick]:hover,
.crlPerfil span:hover {
  opacity: 0.8;
}

/* Contenedor del modo desarrollador */
div[style*='margin-top: 30%'] {
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 0.5rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(44, 44, 44, 0.6)
  );
  border-radius: 8px;
  border: 1px solid rgba(169, 168, 246, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

div[style*='margin-top: 30%']:hover {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.9),
    rgba(44, 44, 44, 0.8)
  );
  border-color: rgba(169, 168, 246, 0.6);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.2);
}

@media (max-width: 768px) {
  .divPerfil {
    padding: 1rem;
    border-radius: 12px;
    margin: 0.5rem;
  }

  .profileImage {
    width: 80px;
    height: 80px;
  }

  .ctrlCabecera {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .ctrlImagen {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  label {
    font-size: 0.85rem;
  }

  input,
  textarea,
  select {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  button {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  .instrMidi {
    min-width: 100%;
    max-width: 100%;
  }

  .agregarInstrumentos {
    flex-direction: column;
  }

  .agregarInstrumentos select,
  .agregarInstrumentos button {
    width: 100%;
  }

  .txtUser {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .divPerfil {
    padding: 0.75rem;
  }

  .profileImage {
    width: 60px;
    height: 60px;
  }

  label {
    font-size: 0.8rem;
  }

  input,
  textarea,
  select {
    padding: 0.5rem;
    font-size: 0.85rem;
  }

  button {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
  }
}
</style>
