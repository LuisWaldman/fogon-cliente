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

const mostrarAgregarInstrumentos = ref(false)
</script>

<template>
  <div class="divPerfil">
    <div style="display: flex;">
      
          <div
          class="ctrlImagen ctrlCabecera"
            
          >
            <!-- Imagen de perfil con click para abrir el input file -->
            <img
              :src="
                imageBase64 !== '' ? imageBase64 : '/img/usuariofantasma.png'
              "
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
            <label for="username">Nombre:</label>
            <input class="txtUser"  type="text" id="username" v-model="perfil.nombre" placeholder="Ingresa tu nombre" />
          </div>
          <div class="ctrlCabecera">
            <div style="margin-bottom: 5px ;"><label for="instrument">Instrumento:</label></div>
            <select id="instrument" v-model="perfil.instrumento">
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
          <span v-if="perfil.CifradoLatino" @click="perfil.CifradoLatino = !perfil.CifradoLatino">✅</span>
          <span v-if="!perfil.CifradoLatino" @click="perfil.CifradoLatino = !perfil.CifradoLatino">❌</span>
          <span  @click="perfil.CifradoLatino = !perfil.CifradoLatino">Cifrado latino</span>
        </div>

          
          <div>
            <label>🎼 Instrumentos Favoritos En Edicion de partituras:</label>
            <div v-if="perfil.instrumentosFavoritos.length === 0">
              No hay instrumentos favoritos.
            </div>
            <div style="display: flex">
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
            </div>
            <!-- Botón para mostrar el div de agregar instrumentos -->
            <button v-if="!mostrarAgregarInstrumentos" @click="mostrarAgregarInstrumentos = true" style="margin-top: 10px">
              Agregar
            </button>
            <!-- Div de agregar instrumentos solo visible si mostrarAgregarInstrumentos es true -->
            <div v-if="mostrarAgregarInstrumentos" style="margin-top: 10px" class="agregarInstrumentos">
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
              <button @click="mostrarAgregarInstrumentos = false" style="margin-left: 10px">
                Listo
              </button>
            </div>

            
          <div>
            <label for="coso">Nombre de sesion:</label>
            <input type="text" id="coso" v-model="perfil.nombreSesion" />
          </div>
          </div>
        </div>
        
      </div>
      <div class="classBotonera">
        
        <button @click="updateProfile">Actualizar</button>
      </div>
      <div>
        
        <div style="margin-top: 30%;">
          <span v-if="perfil.CifradoLatino" @click="perfil.CifradoLatino = !perfil.CifradoLatino">✅</span>
          <span v-if="!perfil.CifradoLatino" @click="perfil.CifradoLatino = !perfil.CifradoLatino">❌</span>
          <span  @click="perfil.CifradoLatino = !perfil.CifradoLatino">Cifrado latino</span>
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
