<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Perfil } from '../../modelo/perfil'
import { ref, onMounted, computed } from 'vue'
import { Configuracion } from '../../modelo/configuracion'
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
  }
}

function eliminarInstrumentoFavorito(idx: number) {
  perfil.value.instrumentosFavoritos.splice(idx, 1)
}
</script>

<template>
  <div>
    <h1>Perfil</h1>
    <div>
      <div class="controlPerfil">
        <div>
          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <!-- Imagen de perfil con click para abrir el input file -->
            <img
              :src="
                imageBase64 !== '' ? imageBase64 : '/img/usuariofantasma.png'
              "
              alt="Profile Image"
              style="max-width: 200px; max-height: 200px; cursor: pointer"
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
        </div>
        <div>
          <div>
            <label for="username">Nombre:</label>
            <input type="text" id="username" v-model="perfil.nombre" />
          </div>
          <div>
            <label for="description">Descripcion:</label>
            <textarea id="description" v-model="perfil.descripcion"></textarea>
          </div>
          <div>
            <label for="instrument">Instrumento:</label>
            <select id="instrument" v-model="perfil.instrumento">
              <option value="Guitarra">Guitarra</option>
              <option value="Piano">Piano</option>
              <option value="Ukelele">Ukelele</option>
              <option value="Bajo">Bajo</option>
              <option value="Percusion">Percusion</option>
              <option value="Harmonica">Harmonica</option>
            </select>
          </div>

          <div>
            <label>Instrumentos Favoritos:</label>
            <div v-if="perfil.instrumentosFavoritos.length === 0">
              No hay instrumentos favoritos.
            </div>
            <div style="display: flex">
              <div
                v-for="(inst, idx) in perfil.instrumentosFavoritos"
                :key="inst"
                style="display: flex; align-items: center; margin-bottom: 5px"
              >
                <span style="flex: 1">{{ inst }}</span>
                <span
                  @click="eliminarInstrumentoFavorito(idx)"
                  style="margin-left: 10px"
                >
                  [X]
                </span>
              </div>
            </div>
            <div style="margin-top: 10px">
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
            </div>
          </div>
          <div>
            <label for="coso">Nombre de sesion:</label>
            <input type="text" id="coso" v-model="perfil.nombreSesion" />
          </div>
        </div>
        <div>
          <label for="cifrado">Cifrado latino:</label>
          <input type="checkbox" id="cifrado" v-model="perfil.CifradoLatino" />
        </div>
      </div>
      <div class="classBotonera">
        <button @click="updateProfile">Actualizar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.controlPerfil {
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
</style>
