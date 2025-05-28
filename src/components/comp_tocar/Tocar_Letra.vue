<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion'
import { VistaControl } from '../../modelo/VistaControl'

const props = defineProps<{
  compas: number
  cancion: Cancion
  vista: VistaControl
}>()
const scrollTop = ref(0) // Ref to store the horizontal scroll position

const letraDiv = ref<HTMLElement | null>(null) // Ref to the div

const mostrandoRenglon = ref(-1)
const mostrandoPalabra = ref(-1)
const letras = ref([] as string[][])

watch(
  () => props.compas,
  (newCompas) => {
    const renglon = props.cancion.letras.RenglonDelCompas(newCompas)
    let ve = renglon * props.vista.tamanioReferencia * 1.6
    console.log('ve', ve, newCompas, renglon)
    ve -= props.vista.alto * 0.4
    const nuevaPos = Math.max(ve, 0)
    moverScroll(nuevaPos)

    let totalCompases = 0
    for (let i = 0; i < props.cancion.letras.renglones.length; i++) {
      let compasesxparte = 0
      if (props.cancion.letras.renglones[i])
        compasesxparte = props.cancion.letras.renglones[i].length

      if (newCompas < totalCompases + compasesxparte) {
        mostrandoRenglon.value = i
        mostrandoPalabra.value = newCompas - totalCompases

        break
      }
      totalCompases += compasesxparte
    }
  },
)

function moverScroll(posX: number) {
  letraDiv.value?.scrollTo({ top: posX, behavior: 'smooth' })
}

function Actualizar() {
  if (letras.value.length === 0) {
    console.log('actualizar letras')
    //   actualizarLetras(props.cancion);
  }
  return false
}
// Función para manejar el evento de scroll
const handleScroll = () => {
  if (letraDiv.value) {
    scrollTop.value = letraDiv.value.scrollTop // Actualiza la posición del scroll
  }
}
// Añadir el evento de scroll cuando se monta el componente
onMounted(() => {
  if (letraDiv.value) {
    letraDiv.value.addEventListener('scroll', handleScroll)
  }
})

// Eliminar el evento de scroll cuando se desmonta el componente
onUnmounted(() => {
  if (letraDiv.value) {
    letraDiv.value.removeEventListener('scroll', handleScroll)
  }
})

defineExpose({ Actualizar })
</script>
<template>
  <div class="componenteMusical">
    <div ref="letraDiv" class="overflow-auto divDeLetra">
      <div style="display: flex; flex-wrap: wrap">
        <template
          v-for="(renglon, index) in cancion.letras.renglones"
          :key="index"
          class="parte"
        >
          <template v-for="(letra, index_aco) in renglon" :key="index_aco">
            <div
              v-if="!letra.includes('/n')"
              :class="{
                en_compas:
                  mostrandoRenglon === index && mostrandoPalabra === index_aco,
              }"
            >
              <div class="divletra">
                {{ letra }}
                <i v-if="letra.trim() === ''" class="bi bi-music-note"></i>
              </div>
            </div>
            <div
              v-if="letra.includes('/n')"
              :class="{
                en_compas:
                  mostrandoRenglon === index && mostrandoPalabra === index_aco,
              }"
            >
              <div class="divletra">
                {{ letra.split('/n')[0] }}
                <i
                  v-if="letra.split('/n')[0].trim() === ''"
                  class="bi bi-music-note"
                ></i>
              </div>
            </div>

            <div class="break" v-if="letra.includes('/n')"></div>

            <div
              v-if="letra.includes('/n')"
              :class="{
                en_compas:
                  mostrandoRenglon === index && mostrandoPalabra === index_aco,
              }"
            >
              <div class="divletra">{{ letra.split('/n')[1] }}</div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.componenteMusical {
  border: 1px solid;
  border-radius: 5px;
  color: #a9a8f6;
  padding: 6px;
}
.read-the-docs {
  color: #888;
}

.break {
  flex-basis: 100%;
}
.parte {
  display: flex;
}
.acordediv {
  margin: 1px;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
  margin-right: 10px;
}

.divDeLetra {
  font-size: var(--tamanio-letra);
  scrollbar-color: black transparent;
  scrollbar-width: thin;
}

.noacorde {
  margin: 1px;
  padding: 6px;
}

.ordenparte {
  border: 1px solid #888;
  width: 25%;
}

.en_compas {
  color: white;
  background-color: red;
  margin: 1px;
  padding: 5px;
  border: 1px solid;
  border-radius: 5px;
  display: inline-block;
  margin-right: 10px;
}
</style>
