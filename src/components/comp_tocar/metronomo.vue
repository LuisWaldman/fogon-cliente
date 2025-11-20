<script setup lang="ts">

import { useAppStore } from '../../stores/appStore'
const appStore = useAppStore()
</script>

<template>
  <div class="divPrevia" v-if="appStore.estadoReproduccion == 'Iniciando'">
    Empieza en {{ appStore.cancion.compasCantidad - appStore.golpeDelCompas }}
  </div>
  <div v-if="appStore.cancion">
    <div class="metronono">
      <div style="display: flex">
        <div
          v-for="n in appStore.cancion.compasCantidad * 1"
          :key="n"
          class="beat"
          :class="{
            beat_activo:
              n - 1 === appStore.golpeDelCompas &&
              appStore.estadoReproduccion === 'Reproduciendo',
          }"
        >
          <span> {{ n }}</span>

          
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  margin: 0px !important;
  padding: 0px !important;
}
.btn {
  margin: 0px !important;
  padding: 0px !important;
}
.controls {
  display: flex;
}

.metronono {
  border: 1px solid #a9a8f6;
  border-radius: 10px;
  font-size: 27px;
  margin: 4px;
}

.beat {
  display: flex;
  border: 1px solid #a9a8f6;
  border-radius: 10px;
  margin: 4px;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.beat_activo {
  background-color: rgb(235, 67, 16);
}
.divPrevia {
  position: absolute;
  top: -300px;
  left: 90px;
  color: red;
  font-size: 80px;
  padding: 20px;
  border: 1px solid red;
}

@media (max-width: 600px) {
  .metronono {
    font-size: 14px;
    padding: 2px;
  }
  .beat {
    font-size: 14px;
    padding-left: 2px;
    padding-right: 2px;
    margin: 2px;
  }
  .divPrevia {
    position: absolute;
    font-size: 32px;
    top: -280px;
    left: 20px;
    padding: 6px;
  }
  .btn {
    font-size: 12px;
    padding: 2px 6px;
  }
}
</style>
