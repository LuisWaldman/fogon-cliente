<script setup lang="ts">
const cancionesPorBanda = {
  'Andrés Calamaro': [
    { nombre: 'Tuyo Siempre', archivo: 'andres-calamaro_tuyo-siempre' },
    { nombre: 'Flaca', archivo: 'andres-calamaro_flaca' },
  ],
  'Damas Gratis': [
    {
      nombre: 'No te creas tan importante',
      archivo: 'damas-gratis_no-te-creas-tan-importante',
    },
  ],
  'Sui Generis': [
    {
      nombre: 'Rasguna las piedras',
      archivo: 'charly-garcia_rasguna-las-piedras',
    },
  ],
  Intoxicados: [
    { nombre: 'Casi sin pensar', archivo: 'intoxicados_casi-sin-pensar' },
    { nombre: 'Fuego', archivo: 'intoxicados_fuego' },
    { nombre: 'Fuiste lo mejor', archivo: 'intoxicados_fuiste-lo-mejor' },
    { nombre: 'Homero', archivo: 'intoxicados_homero' },
    { nombre: 'Nunca quise', archivo: 'intoxicados_nunca-quise' },
    {
      nombre: 'Esta Saliendo el Sol',
      archivo: 'intoxicados_esta-saliendo-el-sol',
    },
  ],
  'Joaquín Sabina': [
    {
      nombre: 'A la orilla de la chimenea',
      archivo: 'joaquin-sabina_a-la-orilla-de-la-chimenea',
    },
    {
      nombre: 'La flaca',
      archivo: 'joaquin-sabina_la-flaca',
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
  'Nuri Profe': [
    { nombre: 'Minuet', archivo: 'nuri-profe_menuet' },
    { nombre: 'Acordes en el modo (RE)', archivo: 'nuri-profe_acordesmodod' },
    {
      nombre: 'Dont Wanna Leave You Blues',
      archivo: 'nuri-profe_dont-wanna',
    },
    { nombre: 'Air', archivo: 'nuri-profe_air' },
    { nombre: 'Gavotte', archivo: 'nuri-profe_gavote' },
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
  <div class="row">
    <div
      class="col-4"
      v-for="(canciones, banda) in cancionesPorBanda"
      :key="banda"
    >
      <h2>{{ banda }}</h2>
      <ul>
        <li v-for="(cancion, index) in canciones" :key="index">
          <router-link :to="'/tocar?cancion=' + cancion.archivo">{{
            cancion.nombre
          }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.read-the-docs {
  font-size: x-large;
}
.home {
  width: 100%;
  padding: 20px;
}
</style>
