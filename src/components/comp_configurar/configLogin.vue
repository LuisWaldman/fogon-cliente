<script setup lang="ts">
import { ref, onMounted } from 'vue' // Import onMounted
import { useAppStore } from '../../stores/appStore'
import { Configuracion } from '../../modelo/configuracion' // Import Configuracion
import bcrypt from 'bcryptjs';

async function crearLoginSeguro() {
  const hash = await bcrypt.hash(password.value, 12);

  const loginData = new datosLogin(
    'USERPASS',
    username.value,
    hash,
    mantenerseLogeado.value
  );

  // Ahora podés enviar loginData donde lo necesites
  return loginData;
}

const username = ref('')
const password = ref('')
const mantenerseLogeado = ref(false) // Added ref for "mantenerseLogeado"
const loginMessages = ref([] as string[])
import { GoogleLogin } from 'vue3-google-login'
import { datosLogin } from '../../modelo/datosLogin'

// Load saved login data on component mount
onMounted(() => {
  const config = Configuracion.getInstance()
  if (config.loginDefault && config.loginDefault.mantenerseLogeado) {
    username.value = config.loginDefault.usuario
  //  password.value = config.loginDefault.password
    mantenerseLogeado.value = config.loginDefault.mantenerseLogeado
  }
})

const appStore = useAppStore()
function loginWithCredentials() {
  if (username.value.trim() === '' || password.value.trim() === '') {
    appStore.estadoLogin = 'error'
    return
  }

      


    crearLoginSeguro().then((secureLoginData) => {
      appStore.aplicacion.login(secureLoginData)

        // Save login data if "mantenerseLogeado" is checked
  const config = Configuracion.getInstance()
  if (mantenerseLogeado.value) {
    config.loginDefault = secureLoginData
    config.loginDefault.mantenerseLogeado = true
  } else {
    config.loginDefault = null
  }
  config.guardarEnLocalStorage()


    }).catch((error) => {
      console.error("Error al crear el login seguro:", error);
      appStore.estadoLogin = 'error'
    })
  
  

  // Aquí iría la lógica de autenticación con tu backend
}

function handleSuccess(response: any) {
  const token = response.credential; // puede variar según la librería
  console.log("Token recibido:", token);
}

function handleError(error: any) {
  console.error("Error en el inicio de sesión con Google:", error);
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
</script>

<template>
  <div class="config-login">
    <h2>Login</h2>
    <span
      v-if="appStore.estadoLogin == 'error'"
      style="font-size: 20px; color: red"
      >Hay errores</span
    >
    <div class="login-form">
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Ingrese su usuario"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Ingrese su contraseña"
        />
      </div>

      <div class="form-group">
        <input
          id="mantenerseLogeado"
          v-model="mantenerseLogeado"
          type="checkbox"
        />
        <label for="mantenerseLogeado">Mantenerse logeado</label>
      </div>

      <div class="buttons">
        <button
          @click="loginWithCredentials"
          v-if="appStore.estadoLogin == '' || appStore.estadoLogin == 'error'"
        >
          Login
        </button>
        <button @click="logout" v-if="appStore.estadoLogin == 'logueado'">
          Salir
        </button>
        <span v-if="appStore.estadoLogin == 'init-login'">Iniciando...</span>
      </div>
    </div>
    
    <div class="google-login">
      <p>O inicia sesión con:</p>
      <GoogleLogin @success="handleSuccess" />
    </div>

  </div>
</template>

<style scoped>
.config-login {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.login-form .form-group {
  margin-bottom: 15px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.login-form input[type='text'],
.login-form input[type='password'] {
  width: calc(100% - 22px); /* Ajustar por padding y borde */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.buttons {
  margin-top: 20px;
  text-align: center;
}

.buttons button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.buttons button:hover {
  background-color: #0056b3;
}

.google-login {
  margin-top: 30px;
  text-align: center;
}

.google-login p {
  margin-bottom: 10px;
}

.google-login button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.google-login img {
  display: block;
  margin: 0 auto;
}

.login-messages {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.login-messages h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1em;
}

.login-messages div {
  padding: 5px 0;
  font-size: 0.9em;
  border-bottom: 1px dashed #eee;
}

.login-messages div:last-child {
  border-bottom: none;
}
</style>
