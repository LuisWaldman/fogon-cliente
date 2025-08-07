<script setup lang="ts">
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()
function getPositionStyle(index: number, total: number) {
  // Calculate angle from -120 degrees to 240 degrees (10 o'clock to 4 o'clock)
  // Convert to radians: -120° = -2π/3, 240° = 4π/3
  const startAngle = (-2 * Math.PI) / 3
  const endAngle = (3 * Math.PI) / 3
  const angleRange = endAngle - startAngle

  const angle = startAngle + (index / (total - 1 || 1)) * angleRange
  const radius = 35 // Adjust the radius as needed
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius

  return {
    position: 'absolute' as const,
    left: `${x + 30}px`,
    top: `${y + 10}px`,
  }
}

function getImageStyle() {
  return {
    width: '70px',
    height: '50px',
  }
}
</script>
<template>
  <router-link class="navbar-brand" to="/" style="color: inherit">
    <div class="relative-container">
      <div
        v-for="(user, idx) in appStore.usuariosSesion"
        :key="idx"
        :style="getPositionStyle(idx, appStore.usuariosSesion.length)"
      >
        <img
          class="profile-image"
          v-if="user.PerfilUsr && user.PerfilUsr.imagen"
          :src="user.PerfilUsr.imagen"
          alt="Profile image"
        />
      </div>
      <div class="div-imagen">
        <img
          :style="getImageStyle()"
          :src="
            appStore.estado === 'conectado'
              ? '/img/conectado.png'
              : appStore.estado === 'tocando'
                ? '/img/tocando.png'
                : appStore.estado === 'logueado'
                  ? '/img/logueado.png'
                  : appStore.estado === 'conectadoserver'
                    ? '/img/conectado.png'
                    : '/img/desconectado.png'
          "
          alt="Logo"
          width="50"
        />
      </div>
      <div class="titulo-Fogon">Fogon 0.1</div>
    </div>
  </router-link>
</template>

<style scoped>
.relative-container {
  position: relative;
  width: 100px;
}
.profile-image {
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}
.div-imagen {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.titulo-Fogon {
  font-size: 1rem;
  color: #d6431e;
  width: 100%;
  text-align: center;
}
</style>
