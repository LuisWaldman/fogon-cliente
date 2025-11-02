<script setup lang="ts">
import { useRouter } from 'vue-router'
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

const router = useRouter()
function clickFogon() {
  console.log('click_Fogon', router.currentRoute.value.path)
  if (router.currentRoute.value.path === '/tocar') {
    router.push('/')
  } else if (appStore.cancion.acordes.ordenPartes.length > 0) {
    router.push('/tocar')
  } else {
    router.push('/')
  }
}
</script>
<template>
  <div class="navbar-brand" @click="clickFogon" style="color: inherit">
    <div class="iconofogon">
      <div class="relative-container">
        <div v-if="appStore.estadosApp.estadoSesion === 'conectado'">
          <div
            v-for="(user, idx) in appStore.usuariosSesion"
            :key="idx"
            :style="getPositionStyle(idx, appStore.usuariosSesion.length)"
          >
            <img
              class="profile-image"
              :src="
                user.PerfilUsr && user.PerfilUsr.imagen
                  ? user.PerfilUsr.imagen
                  : '/img/usuariofantasma.png'
              "
              alt="Profile image"
            />
          </div>
        </div>

        <div class="div-imagen">
          <img
            class="imagenicono"
            :style="getImageStyle()"
            src="/img/troncossesion.png"
            v-if="appStore.estadosApp.estadoSesion === 'conectado'"
            style="z-index: 1"
          />

          <img
            class="imagenicono"
            :style="getImageStyle()"
            src="/img/troncosconectado.png"
            v-if="appStore.estadosApp.estadoconeccion === 'conectado'"
            style="z-index: 1"
          />

          <img
            class="imagenicono"
            :style="getImageStyle()"
            src="/img/troncoslogueado.png"
            v-if="appStore.estadosApp.estadoLogin === 'logueado'"
            style="z-index: 1"
          />

          <img
            class="imagenicono"
            :styles="getImageStyle()"
            v-if="
              appStore.estado !== 'conectado' && appStore.estado !== 'logueado'
            "
            src="/img/troncooffline.png"
            style="z-index: 1"
          />

          <img
            class="imagenicono"
            :style="getImageStyle()"
            src="/img/llamaritomopausa.png"
            v-if="appStore.estadoReproduccion === 'pausado'"
            style="z-index: 3"
          />
          <img
            class="imagenicono"
            :style="getImageStyle()"
            src="/img/llamaritomo1.png"
            v-if="
              appStore.estadoReproduccion !== 'pausado' &&
              appStore.golpeDelCompas == 0
            "
            style="z-index: 3"
          />
          <img
            class="imagenicono"
            :style="getImageStyle()"
            src="/img/llamaritomo2.png"
            v-if="appStore.golpeDelCompas == 1"
            style="z-index: 3"
          />
          <img
            class="imagenicono"
            :style="getImageStyle()"
            src="/img/llamaritomo3.png"
            v-if="appStore.golpeDelCompas == 2"
            style="z-index: 3"
          />
          <img
            class="imagenicono"
            :style="getImageStyle()"
            src="/img/llamaritomo4.png"
            v-if="appStore.golpeDelCompas == 3"
            style="z-index: 3"
          />
        </div>
      </div>

      <div style="margin-top: 50px">
        <div
          class="titulo-Fogon"
          v-if="appStore.estadosApp.estadoSesion != 'conectado'"
        >
          |FOGON|__--.🔥
        </div>
        <div
          class="titulo-Fogon"
          v-if="appStore.estadosApp.estadoSesion === 'conectado'"
        >
          {{ appStore.sesion.nombre }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iconofogon {
  width: 100px;
  height: 80px;
}

.relative-container {
  position: relative;
  width: 100px;
}
.imagenicono {
  position: absolute;
  width: 70px;
  height: 50px;
  top: 0;
  left: 0;
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
  position: relative;
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
