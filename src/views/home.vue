<script setup lang="ts">
const cancionesPorBanda = {
  'Andrés Calamaro': [
    { nombre: 'Tuyo Siempre', archivo: 'andres-calamaro_tuyo-siempre' },
  ],
  'Damas Gratis': [
    {
      nombre: 'No te creas tan importante',
      archivo: 'damas-gratis_no-te-creas-tan-importante',
    },
  ],
  Intoxicados: [
    { nombre: 'Casi sin pensar', archivo: 'intoxicados_casi-sin-pensar' },
    { nombre: 'Fuego', archivo: 'intoxicados_fuego' },
    { nombre: 'Fuiste lo mejor', archivo: 'intoxicados_fuiste-lo-mejor' },
    { nombre: 'Homero', archivo: 'intoxicados_homero' },
    { nombre: 'Nunca quise', archivo: 'intoxicados_nunca-quise' },
  ],
  'Joaquín Sabina': [
    {
      nombre: 'A la orilla de la chimenea',
      archivo: 'joaquin-sabina_a-la-orilla-de-la-chimenea',
    },
  ],
  'Viejas Locas': [
    {
      nombre: 'Balada para otra mujer',
      archivo: 'viejas-locas_balada-para-otra-mujer',
    },
    { nombre: 'Buey', archivo: 'viejas-locas_buey' },
    { nombre: 'Leganlizenla', archivo: 'viejas-locas_leganlizenla' },
    { nombre: 'Volver a casa', archivo: 'viejas-locas_volver-a-casa' },
  ],
}
</script>
<template>
  <div class="home">
    <h1 style="color: blueviolet">Bienvenido al Fogon</h1>
    <p class="read-the-docs">
      Esta es una version muy BETA, recien estamos empezando a construir el
      Fogon, juntando maderita.
    </p>

    <p>Por ahora, presentamos las siguientes canciones:</p>
  </div>
  <div v-for="(canciones, banda) in cancionesPorBanda" :key="banda">
    <h2>{{ banda }}</h2>
    <ul>
      <li v-for="(cancion, index) in canciones" :key="index">
        <router-link :to="'/tocar?cancion=' + cancion.archivo">{{
          cancion.nombre
        }}</router-link>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.read-the-docs {
  font-size: x-large;
}
.home {
}
</style>
