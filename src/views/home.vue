<script setup lang="ts"></script>
<template>
  <div class="home">
    <h1 style="color: blueviolet">Bienvenido al Fogon</h1>
    <p class="read-the-docs">
      Esta es una version muy BETA, recien estamos empezando a construir el
      Fogon, juntando maderita.
    </p>

    <p>Por ahora, presentamos las siguientes canciones:</p>
  </div>

  <ul>
    <li>
      <router-link to="/tocar?cancion=1">Cancion 1</router-link>
    </li>
    <li>
      <router-link to="/tocar?cancion=2">Cancion 2</router-link>
    </li>
    <li>
      <router-link to="/tocar?cancion=3">Cancion 3</router-link>
    </li>
  </ul>
</template>
<style scoped>
.read-the-docs {
  font-size: x-large;
}
.home {
}
</style>
