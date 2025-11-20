<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'

const props = defineProps<{
  compas: number
  cancion: Cancion
}>()
const scrollTop = ref(0)
const pantalla = new Pantalla()
const letraDiv = ref<HTMLElement | null>(null) // Ref to the div

const mostrandoRenglon = ref(0)
const mostrandoPalabra = ref(0)
const letras = ref([] as string[][])

watch(
  () => props.compas,
  (newCompas) => {
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
    const configPantalla = pantalla.getConfiguracionPantalla()
    if (configPantalla.AutoScroll === false) return

    // Centrar el texto que está sonando usando el DOM
    scrollToCurrentChord()
  },
)

function styleDivTocar() {
  return {
    height: pantalla.getAltoPantalla() + 'px',
  }
}

function scrollToCurrentChord() {
  // Usar setTimeout para asegurar que el DOM se haya actualizado
  setTimeout(() => {
    if (!letraDiv.value) return

    // Buscar el elemento que está actualmente sonando
    const currentElement = letraDiv.value.querySelector('.en_compas')

    if (currentElement) {
      // Obtener la posición del elemento relativa al contenedor
      const containerRect = letraDiv.value.getBoundingClientRect()
      const elementRect = currentElement.getBoundingClientRect()

      // Calcular la posición actual del elemento relativa al scroll
      const elementTop =
        elementRect.top - containerRect.top + letraDiv.value.scrollTop

      // Calcular la posición para centrar el elemento
      const containerHeight = letraDiv.value.clientHeight
      const scrollTo = elementTop - containerHeight / 2 + elementRect.height / 2

      // Hacer scroll suave al elemento centrado
      letraDiv.value.scrollTo({
        top: Math.max(0, scrollTo),
        behavior: 'smooth',
      })
    }
  }, 50) // Pequeño delay para asegurar que el DOM se actualice
}

function Actualizar() {
  if (letras.value.length === 0) {
    console.log('actualizar letras')
  }
  return false
}

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
    <div
      ref="letraDiv"
      class="overflow-auto divDeLetra"
      :style="styleDivTocar()"
    >
      <div style="display: flex; flex-wrap: wrap">
        <template
          v-for="(renglon, index) in cancion.letras.renglones"
          :key="index"
        >
          <template v-for="(letra, index_aco) in renglon" :key="index_aco">
            <div
              v-if="!letra.includes('/n')"
              :class="{
                en_compas:
                  mostrandoRenglon === index && mostrandoPalabra === index_aco,
              }"
            >
              <div class="divletra" :class="{ espacio: letra.endsWith(' ') }">
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
                espacio: letra.endsWith(' '),
                en_compas:
                  mostrandoRenglon === index && mostrandoPalabra === index_aco,
              }"
            >
              <div class="divletra">{{ letra.split('/n')[1] }}</div>
            </div>
          </template>
        </template>
      </div>
      <div>&nbsp;</div>
    </div>
  </div>
</template>

<style scoped>
.componenteMusical {
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
  color: #ffffff;
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
  color: rgb(121, 102, 233);
}
.espacio {
  margin-right: 1ch;
}
</style>
