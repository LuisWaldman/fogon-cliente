<script setup lang="ts">

import { useAppStore } from '../../stores/appStore'
const appStore = useAppStore()
</script>

<template>
  <div>
    <div class="divPrevia" v-if="appStore.estado == 'tocando' && appStore.compas < 0">
      Empieza en {{ 4 - appStore.golpeDelCompas }}
    </div>
    <div class="metronono">
      <div style="display: flex" v-if="appStore.estado == 'tocando'">
        <div
          v-for="n in appStore.cancion?.compasCantidad"
          :key="n"
          class="beat"
          :class="{ beat_activo: n - 1 === appStore.golpeDelCompas }"
        >
          {{ n }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  border: 1px solid #a9a8f6;
  border-radius: 10px;
  margin: 4px;
  padding-left: 14px;
  padding-right: 14px;
}
.beat_activo {
  background-color: rgb(235, 67, 16);
}
.divPrevia {
  position: absolute;
  top: 200px;
  left: 90px;
  color: red;
  font-size: 80px;
  padding: 20px;
  border: 1px solid red;
}
</style>
