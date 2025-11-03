<template>
  <div class="divBienvenida">
    <h1>Bienvenido al Fogon</h1>
    <div>
      Este lugar es para compartir Musica y estudiarla. Te cuento alguna de las cosas que vas
      a poder hacer.
    </div>
    <div>Empeza completando tu perfil y afinando tu instrumento.</div>

    <div>
      Podes cantar canciones como:

      <li>
        <a href="/tocar?cancion=andres-calamaro_flaca"
          >Alguna de </a
        >
      </li>
      <li>
        <a href="/tocar?cancion=andres-calamaro_flaca"
          >Flaca, Andres Calamaro</a
        >
      </li>
      <li>
        <a href="/tocar?cancion=andres-calamaro_flaca"
          >Flaca, Andres Calamaro</a
        >
      </li>
      <li>
        <a href="/tocar?cancion=andres-calamaro_flaca"
          >Flaca, Andres Calamaro</a
        >
      </li>
      <li>
        <a href="/tocar?cancion=sui-generis_botas-locas"
          >Botas Locas, Sui Generis</a
        >
      </li>
      <li>
        <a href="/tocar?cancion=ruben-rada_quien-va-a-cantar"
          >"Quien va a cantar", Ruben Rada</a
        >
      </li>
    </div>

    <div>
      Podes ver partituras (Danubio Azul, Por Una Cabeza) o con varios
      instrumentos (Adios Nonino, Vals de las flores)
    </div>
    <div>Ademas podes editarlas y crear una nueva.</div>

    <div>
      Y buscar canciones por escala, genero y velocidad, por ejemplos:

      <li>"Canciones de Calamaro en Re mayor a 120 bpm"</li>
      <li>"Tangos en Do Menor"</li>
      <li>"Rock en Mi menor a 100 bpm"</li>
    </div>

    <div>
      Conectado a un servidor, vas a poder hacer aun mas cosas:

      <li>"Tocar una cancion de otro usuario"</li>
      <li>"Ver Listas de Otro Usuario"</li>
      <li>"Rock en Mi menor a 100 bpm"</li>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
// No logic required for this static component
</script>

<style scoped>
.divBienvenida {
  margin-left: 4%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
