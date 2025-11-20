<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { Pantalla } from '../../modelo/pantalla'
import { useAppStore } from '../../stores/appStore'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'

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

    // Centrar el acorde que está sonando usando el DOM
    scrollToCurrentChord()
  },
)

function styleDivTocar() {
  return {
    height: pantalla.getAltoPantalla() + 'px',
  }
}

function scrollToCurrentChord() {
  // Usar nextTick para asegurar que el DOM se haya actualizado
  setTimeout(() => {
    if (!letraDiv.value) return

    // Buscar el elemento del acorde que está actualmente sonando
    const currentChordElement = letraDiv.value.querySelector(
      '.acordediv.en_compas',
    )

    if (currentChordElement) {
      // Obtener la posición del elemento relativa al contenedor
      const containerRect = letraDiv.value.getBoundingClientRect()
      const elementRect = currentChordElement.getBoundingClientRect()

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
class ParteLetraYAcorde {
  conEnter: boolean = false
  acorde: string = ''
  letra: string = ''
  nroCompas: number = -1
  constructor(
    acorde: string,
    letra: string,
    nroCompas: number,
    conEnter: boolean = false,
  ) {
    this.acorde = acorde
    this.letra = letra
    this.nroCompas = nroCompas
    this.conEnter = conEnter
  }
}
const refparteLetraYAcorde = ref<ParteLetraYAcorde[]>([])

function calcularCompaces() {
  const parteLetraYAcorde: ParteLetraYAcorde[] = []

  const helperNombreAcordes = HelperDisplayAcordesLatino.getInstance()
  const appStore = useAppStore()
  helperNombreAcordes.latino = appStore.perfil.CifradoLatino
  const acordes = props.cancion.acordes.GetTodosLosAcordes()
  const letra = props.cancion.letras.renglones.flat()
  for (let i = 0; i < letra.length; i++) {
    const texto = letra[i]
    let acorde = '?'
    if (i < acordes.length) {
      acorde = helperNombreAcordes.GetAcorde(acordes[i])
    }
    if (texto.includes('/n')) {
      const partes = texto.split('/n')
      for (let j = 0; j < partes.length; j++) {
        const toadd = new ParteLetraYAcorde(
          j === 0 ? acorde : '',
          partes[j],
          i,
          j == partes.length - 1 ? false : true,
        )
        parteLetraYAcorde.push(toadd)
      }
    } else {
      const toadd = new ParteLetraYAcorde(acorde, texto, i)

      parteLetraYAcorde.push(toadd)
    }
  }
  refparteLetraYAcorde.value = parteLetraYAcorde
}

onMounted(() => {
  calcularCompaces()
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
        <template v-for="(parte, _index) in refparteLetraYAcorde" :key="_index">
          <div>
            <div class="conteinerDiv">
              <div
                class="acordediv"
                v-if="parte.acorde != ''"
                :class="{ en_compas: parte.nroCompas === compas }"
              >
                {{ parte.acorde }}
              </div>
            </div>
            <div
              class="divletra"
              :class="{
                espacio: parte.letra.endsWith(' '),
                en_compas: parte.nroCompas === compas,
              }"
            >
              {{ parte.letra }}
            </div>
          </div>
          <div class="break" v-if="parte.conEnter"></div>
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

.conteinerDiv {
  margin: 1px;
  padding: 5px;
  height: calc(var(--tamanio-acorde) + 10px);
}

.acordediv {
  font-size: var(--tamanio-acorde);
  margin: 1px;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
  margin-right: 4px;
}

.acordediv.en_compas {
  color: rgb(194, 6, 6) !important;
  font-weight: bold;
  border: 1px solid rgb(194, 6, 6);
  background-color: white;
}
</style>
