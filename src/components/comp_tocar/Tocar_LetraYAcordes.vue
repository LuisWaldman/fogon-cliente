<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Cancion } from '../../../modelo/cancion'
import { VistaControl } from '../../../modelo/VistaControl'

const props = defineProps<{
  compas: number
  cancion: Cancion
  vista: VistaControl
}>()
const scrollTop = ref(0) // Ref to store the horizontal scroll position

const letraDiv = ref<HTMLElement | null>(null) // Ref to the div

const mostrandoParte = ref(-1)
const mostrandoCompasParte = ref(-1)
const currentCompas = ref(0)
const letras = ref([] as string[][])

watch(
  () => props.cancion,
  (cancion: Cancion) => {
    actualizarLetras(cancion)
  },
)

function actualizarLetras(cancion: Cancion) {
  let contadorRenglontexto = 0
  let contadorRenglonParteTexto = 0
  let nuevaLetra = [] as string[][]
  for (var i = 0; i < cancion.acordes.ordenPartes.length; i++) {
    let nuevoRenglon = [] as string[]

    for (
      var j = 0;
      j < cancion.acordes.partes[cancion.acordes.ordenPartes[i]].acordes.length;
      j++
    ) {
      nuevoRenglon.push(
        cancion.letras.renglones[contadorRenglontexto][
          contadorRenglonParteTexto
        ],
      )
      contadorRenglonParteTexto++
      if (
        contadorRenglonParteTexto >=
        cancion.letras.renglones[contadorRenglontexto].length
      ) {
        contadorRenglontexto++
        contadorRenglonParteTexto = 0
      }
    }
    nuevaLetra.push(nuevoRenglon)
  }
  letras.value = nuevaLetra
}

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
        mostrandoCompasParte.value = newCompas - totalCompases
        break
      }
      totalCompases += compasesxparte
    }
    currentCompas.value = newCompas

    const renglon = props.cancion.letras.RenglonDelCompas(newCompas)
    let ve = renglon * props.vista.tamanioReferencia * 3.7
    ve -= props.vista.alto * 0.4
    const nuevaPos = Math.max(ve, 0)

    moverScroll(nuevaPos)
  },
)

function moverScroll(posX: number) {
  letraDiv.value?.scrollTo({ top: posX, behavior: 'smooth' })
}

function Actualizar() {
  if (letras.value.length === 0) {
    actualizarLetras(props.cancion)
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
  <div>
    <div
      v-if="letras.length == 0 && cancion.letras.renglones.length > 0"
      @click="Actualizar"
    >
      .. No cargada ..
    </div>
    <div
      class="componenteMusical"
      v-if="letras.length > 0 && cancion.letras.renglones.length > 0"
    >
      <div v-if="letras.length == 0"></div>
      <div
        ref="letraDiv"
        class="overflow-auto divDeLetra"
        :style="{ 'max-height': vista.alto + 'px' }"
      >
        <div
          style="display: flex; flex-wrap: wrap"
          :style="{ 'font-size': vista.tamanioReferencia + 'px' }"
        >
          <template
            v-for="(parte, index) in cancion.acordes.ordenPartes"
            :key="index"
            class="parte"
          >
            <template
              v-for="(aco, index_aco) in cancion.acordes.partes[parte].acordes"
              :key="index_aco"
            >
              <div
                v-if="
                  letras[index][index_aco] &&
                  !letras[index][index_aco].includes('/n')
                "
                :class="{
                  en_compas:
                    mostrandoParte === index &&
                    mostrandoCompasParte === index_aco,
                }"
              >
                <div>
                  <div class="acordediv">{{ aco }}</div>
                </div>
                <div class="divletra">{{ letras[index][index_aco] }}&nbsp;</div>
              </div>
              <div
                v-if="
                  letras[index][index_aco] &&
                  letras[index][index_aco].includes('/n')
                "
                :class="{
                  en_compas:
                    mostrandoParte === index &&
                    mostrandoCompasParte === index_aco,
                }"
              >
                <div>
                  <div class="acordediv">{{ aco }}</div>
                </div>
                <div class="divletra">
                  {{ letras[index][index_aco].split('/n')[0] }}
                </div>
              </div>
              <div
                class="break"
                v-if="
                  letras[index][index_aco] &&
                  letras[index][index_aco].includes('/n')
                "
              ></div>
              <div
                v-if="
                  letras[index][index_aco] &&
                  letras[index][index_aco].includes('/n')
                "
                :class="{
                  en_compas:
                    mostrandoParte === index &&
                    mostrandoCompasParte === index_aco,
                }"
              >
                <div><div class="noacorde">&nbsp;</div></div>
                <div class="divletra">
                  {{ letras[index][index_aco].split('/n')[1] }}
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.divDeLetra {
  scrollbar-color: black transparent;
  scrollbar-width: thin;
}

.componenteMusical {
  border: 1px solid;
  border-radius: 5px;
  color: white;
  padding: 6px;
  height: 100%;
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

.noacorde {
  margin: 1px;
  padding: 6px;
  font-size: large;
}

.ordenparte {
  border: 1px solid #888;
  width: 25%;
}

.en_compas .acordediv {
  background-color: red;
  color: white;
}
.en_compas .divletra {
  color: red;
}
</style>
