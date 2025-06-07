<script setup lang="ts">
import { ref } from 'vue'
import { Cancion } from '../../modelo/cancion'
import { watch } from 'vue'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()

const mostrandoParte = ref(-1)
const mostrandoCompasparte = ref(-1)
const currentCompas = ref(0)

const secuResu = ref([] as number[])
const reperesu = ref([] as number[])


watch(
  () => props.cancion,
  (newCancion) => {
    let newresu: number[] = []
    let newpartesresu: number[] = []
    let metiendo = -1
    newCancion.acordes.ordenPartes.forEach((element) => {
      if (metiendo != element) {
        newresu.push(element)
        newpartesresu.push(1)
        metiendo = element
      } else {
        newpartesresu[newpartesresu.length - 1] += 1
      }
    })
    secuResu.value = newresu
    reperesu.value = newpartesresu
  },
)

watch(
  () => props.compas,
  (newCompas) => {
    let totalCompases = 0
    for (let i = 0; i < props.cancion.acordes.ordenPartes.length; i++) {
      let compasesxparte =
        props.cancion.acordes.partes[props.cancion.acordes.ordenPartes[i]]
          .acordes.length
      if (newCompas < totalCompases + compasesxparte) {
        mostrandoParte.value = i
        mostrandoCompasparte.value = newCompas - totalCompases
        break
      }
      totalCompases += compasesxparte
    }
    currentCompas.value = newCompas
  },
)

</script>

<template>

      <div>
        <span style="font-size: large;">Partes</span>
        <div
          v-for="(parte, index_parte) in cancion.acordes.partes"
          :key="parte.nombre"
          class="row"
        >
          <div>
            {{ parte.nombre }}
          </div>
          <div class="partediv">
            <div
              v-for="(acorde, index) in parte.acordes"
              class="acordediv"
              :key="acorde"
            >
              <span
                :class="{
                  compas_actual:
                    mostrandoCompasparte === index &&
                    index_parte === cancion.acordes.ordenPartes[mostrandoParte],
                }"
                >{{ acorde }}</span
              >
            </div>
          </div>
        </div>
      </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.ordendiv {
  font-size: var(--tamanio-parte);
  margin: 1px;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
  margin-right: 10px;
}

.acordediv {
  font-size: var(--tamanio-acorde-parte);
  margin: 1px;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;

  margin-right: 10px;
}

@media (max-width: 768px) {
  .ordendiv {
    margin: 2px;
    width: 30px;
    overflow: hidden;
    white-space: nowrap;
  }
  .acordediv {
    margin: 2px;
    padding: 2px;
    width: 40px;
    overflow: hidden;
    white-space: nowrap;
  }
}
.partediv {
  display: flex;
  flex-wrap: wrap;
}

.compas_actual {
  background-color: red;
  color: white;
}

.domi {
  color: #497aff;
}

/*
  Tonica
  color: #a9a8f6;
  Semi Dominante:
  color: blue;
  Dominante
  background-color: red;
*/
.repeticion {
  display: inline-block;
  margin: 4px;
}
.acordesPantalla {
  border: 1px solid;
  padding: 10px;
  border-radius: 2%;
}

.tituloSecuencia {
  font-size: 1em;
  color: #a9a8f6;
  margin-top: 10px;
}
</style>
