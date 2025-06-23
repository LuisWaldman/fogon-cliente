<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'
import { Perfil } from '../../modelo/perfil'
import { ref, onMounted } from 'vue'

const appStore = useAppStore()
const perfil = ref(new Perfil('', '', '', '', ''))
const imageBase64 = ref('')

function updateProfile() {
  perfil.value.imagen = imageBase64.value
  appStore.aplicacion
    .HTTPPost('perfil', perfil.value)
    .then((response: unknown) => {
      appStore.perfil = perfil.value
      console.log('Profile updated successfully:', response)
    })
    .catch((error: Error) => {
      console.error('Error updating profile:', error)
    })
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

onMounted(() => {
  perfil.value = appStore.perfil
  imageBase64.value = perfil.value.imagen
})
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
            <img
              :src="imageBase64"
              alt="Profile Image"
              style="max-width: 200px; max-height: 200px"
            />

            <input
              type="file"
              id="image"
              class="fileUp"
              @change="handleImageUpload"
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
            <input type="text" id="instrument" v-model="perfil.instrumento" />
          </div>
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
button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}

.controlPerfil {
  display: flex;
}

.fileUp {
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}

.classBotonera {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
