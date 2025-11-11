<script setup lang="ts">
import { ref, watch } from 'vue'
import { Configuracion, VistaTocar } from '../../modelo/configuracion'
import { Pantalla } from '../../modelo/pantalla'

const emit = defineEmits(['cerrar'])
const modeloLetra = ['Cancion 16 versos', 'Soneto', 'Decima', '2 Decimas', 'Vacia']
const modeloLetraId = ref(0)
const tema = ref('')
const banda = ref('')
const conIntro = ref(false)
const conOutro = ref(false)



function nuevaCancion() {
  // Lógica para crear una nueva canción
  console.log('Nueva canción creada')
  emit('cerrar')
}
</script>

<template>
  <div class="vistaedit">
    <div class="tituloeditSize">NUEVA CANCION</div>
    <div class="config-row">
      <span>📝 MODELO DE LETRA</span>
        <select v-model="modeloLetraId">
          <option v-for="(modelo, index) in modeloLetra" :key="index" :value="index">{{ modelo }}</option>
        </select>
    </div>
        
    <div class="config-row">
      <span>Tema</span>

        <input type="text" placeholder="Ingrese el título de la canción" v-model="tema" width="100%" />

    </div>
        
    <div class="config-row">
      <span>Banda</span>
        <input type="text" placeholder="Ingrese el nombre de la banda" width="100%" v-model="banda " />
    </div>
    <div class="config-row">
      🎸 Escala
        <select>
          <option>1 parte</option>
          <option>2 partes</option>
          <option>3 partes</option>
          <option>4 partes</option>
          
        </select>
    </div>
    
    <div class="config-row">
      <span>Funciones</span>
      <div class="divFunciones">
      <div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div><div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div>
      
      <div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div><div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div><div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div><div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div><div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div><div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div><div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div><div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div>
      <div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div><div
        class="clickeableVista"
        
      >
        I-II-IV-V
      </div>
      <div
        class="clickeableVista"
        
      >
        Instrucciones
      </div>
      <div
        class="clickeableVista"
        
        
      >
        Cuadrado
      </div></div>
    </div>

    <div class="config-row">
      <span>Con partes</span>
      <div class="divFunciones">
      <div class="clickeableVista" :class="{seleccionada: conIntro }">
        INTRO
      </div>
    </div>
    </div> 

    <div class="botonera">
      <button @click="nuevaCancion()" class="btnGuardar">
        ➕ Nueva Cancion
      </button>
      <button @click="emit('cerrar')" class="btnGuardar">
        Cancelar
      </button>
    </div>
  </div>
</template>
<style scoped>
.seleccionada {
  font-weight: bold;
  background-color: rgb(223, 177, 51);
}
.vistaedit {
  font-size: x-large;
  position: absolute;
  left: 20%;
  top: 20%;
  max-width: 70%;
  font: 2em;
  padding: 8px;
  border-radius: 10px;
  background-color: rgb(41, 37, 37);
  color: white;
  z-index: 1000;
  border: 3px solid #8b4513;
}
.config-row {
  display: flex;
  align-items: center;
  margin-top: 3px;
}
.config-row span {
  margin-right: 6px;
}

.config-box {
  align-items: center;
  margin-right: 20px;
}

.clickeableVista {
  cursor: pointer;
  min-width: 60px;
  padding: 3px;
  text-align: center;
  border: 1px solid #ccc;
  margin: 5px;
}
.tituloeditSize {
  font-size: x-large;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  background-color: rgb(209, 169, 38);
}
.botonera {
  margin-top: 15px;
  text-align: right;
}
.divFunciones {
  display: flex;
  flex-wrap: wrap;
}
@media (max-width: 768px) {
  .vistaedit {
    left: 3%;
    top: 10%;
    font-size: small;
  }
  .botonera {
    text-align: center;
  }
}
</style>
