<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Configuracion, VistaTocar } from '../../modelo/configuracion'
import { Pantalla } from '../../modelo/pantalla'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import { useAppStore } from '../../stores/appStore'
import { Cancion } from '../../modelo/cancion/cancion'
import { useRouter, type Router } from 'vue-router'
import { Acordes, Parte } from '../../modelo/cancion/acordes'
import { Letra } from '../../modelo/cancion/letra'
import { MusicaHelper } from '../../modelo/cancion/MusicaHelper'

const emit = defineEmits(['cerrar'])
const modeloLetra = [
  'Cancion 16 versos',
  'Soneto',
  'Decima',
  '2 Decimas',
  'Vacia',
]

const sonetoPrimeraParte: string[] = [
  'Lorem ipsum dolor ',
  'sit amet claro,/n',
  'consectetur et  ',
  'magna luce pura,/n',
  'adipiscing elit, ',
  ' forma segura,/n',
  'sed do tempor, tempor',
  'ut labore raro./n',
  'Incididunt ut dolore, ',
  ' vita amparo,/n',
  'aliqua regnat,  ',
  'aura que perdura,/n',
  'veniam minim,  ',
  'voluptas que procura,/n',
  'quis nostrud arte, ',
  ' lumen que declaro./n',
]
const sonetoSegundaParte: string[] = [
  'Ut enim magna,  ',
  'saga resonante,/n',
  'ullamco voces,  ',
  'dulce melodía,/n',
  'laboris aura,  ',
  'canto delirante./n',
  'Irure spiritus,  ',
  'clara armonía,/n',
  'dolor in velit, ',
  ' eco fulgurante,/n',
  'esse laborum,  ',
  'fin de poesía./n',
]
const parteMusical = ['', '', '', '/n']
const modeloLetraId = ref(0)
const reftema = ref('')
const refbanda = ref('')
const refBPM = ref(80)
const refcompas = ref('4_4')
const funciones = [
  'I-IV-V-I',
  'I-II-IV-V',
  'I-II-V-VI',
  'I-III-VI-V',
  'I-III-V-VI',
  'I-VI-IV-V',
  'I-V-VI-V',
  'I-VI-II-V',
  'I-V-I-IV',
]
const funcionesSeleccionadas = ref(new Set<string>())
const conIntro = ref(false)
const conOutro = ref(false)
const conPuente = ref(false)
const refescala = ref('C')
const notas: string[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

const appStore = useAppStore()
const helper = HelperDisplayAcordesLatino.getInstance()
helper.latino = appStore.perfil.CifradoLatino

// Crear escalas mayores y menores
const escalas = [
  ...notas.map((nota) => ({
    value: nota,
    label: `${helper.GetAcorde(nota)} Mayor`,
  })),
  ...notas.map((nota) => ({
    value: `${nota}m`,
    label: `${helper.GetAcorde(nota)} Menor`,
  })),
].sort((a, b) => a.label.localeCompare(b.label))

let router: Router | null = null
onMounted(() => {
  router = useRouter()
})

function GetAcordesParte(acordesEscala: string[], funcion: string): string[] {
  const indice = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
  const partes = funcion.split('-')
  const acordesParte: string[] = []
  for (const parte of partes) {
    const idx = indice.indexOf(parte)
    if (idx !== -1 && idx < acordesEscala.length) {
      acordesParte.push(acordesEscala[idx])
    } else {
      acordesParte.push('?')
    }

  }
  return acordesParte
}

function nuevaCancion() {
  // Lógica para crear una nueva canción

  const appStore = useAppStore()
  const partes: Parte[] = []
  const ordenPartes: number[] = []
  if (funcionesSeleccionadas.value.size === 0) {
    partes.push(new Parte('vacio', ['?', '?', '?', '?']))
  } else 
  {
    const musica = new MusicaHelper()
    const acordes = musica.GetAcordesdeescala(refescala.value)
    console.log(acordes)
    let parte = 0
    
    for (var funcion of funcionesSeleccionadas.value) {
      partes.push(new Parte(funcion, GetAcordesParte(acordes, funcion)))
      ordenPartes.push(parte)
      parte++
    }
  }
  const cancion: string = reftema.value
  const banda: string = refbanda.value
  const acordes = new Acordes(partes, ordenPartes)
  const letra: string[][] = []
  if (conIntro.value) {
    letra.push(parteMusical)
  }
  letra.push(sonetoPrimeraParte)
  if (conPuente.value) {
    letra.push(parteMusical)
  }
  letra.push(sonetoSegundaParte)
  if (conOutro.value) {
    letra.push(parteMusical)
  }

  const letras: Letra = new Letra(letra)
  const totalLetra = letra.flat().length
  const totalAcordes = acordes.GetTotalAcordes()
  let aagregar = (totalLetra - totalAcordes) / 4
  let partecont = 0
  while (aagregar > 0) {
    acordes.ordenPartes.push(partecont)
    aagregar--
    partecont++
    partecont = partecont % partes.length

  }
  const bpm: number = refBPM.value
  const calidad: number = 0
  const compasSeleccionado = refcompas.value.split('_')
  const compasCantidad: number = parseInt(compasSeleccionado[0])
  const compasUnidad: number = parseInt(compasSeleccionado[1])
  const escala: string = refescala.value
  appStore.editandocancion = new Cancion(
    cancion,
    banda,
    acordes,
    letras,
    bpm,
    calidad,
    compasCantidad,
    compasUnidad,
    escala,
  )
  router?.push('/editar')
}
function toggleFuncion(funcion: string) {
  if (funcionesSeleccionadas.value.has(funcion)) {
    funcionesSeleccionadas.value.delete(funcion)
  } else {
    funcionesSeleccionadas.value.add(funcion)
  }
}
function chgIntro() {
  conIntro.value = !conIntro.value
}
function chgOutro() {
  conOutro.value = !conOutro.value
}
function chgPuente() {
  conPuente.value = !conPuente.value
}
</script>

<template>
  <div class="vistaedit">
    <div class="tituloeditSize">NUEVA CANCION</div>

    <div class="config-row">
      <span>Tema</span>

      <input
        type="text"
        placeholder="Ingrese el título de la canción"
        v-model="reftema"
        width="100%"
      />
    </div>

    <div class="config-row">
      <span>Banda</span>
      <input
        type="text"
        placeholder="Ingrese el nombre de la banda"
        width="100%"
        v-model="refbanda"
      />
    </div>

    <div class="config-row">
      <span>⏱️ TEMPO</span>
      <input type="number" v-model="refBPM" min="40" max="240" />
      <select v-model="refcompas">
        <option value="2_4">2/4</option>
        <option value="3_4">3/4</option>
        <option value="4_4">4/4</option>
      </select>
    </div>

    <div class="config-row">
      <span>📝 MODELO DE LETRA</span>
      <select v-model="modeloLetraId">
        <option
          v-for="(modelo, index) in modeloLetra"
          :key="index"
          :value="index"
        >
          {{ modelo }}
        </option>
      </select>
    </div>

    <div class="config-row">
      🎸 Escala
      <select v-model="refescala">
        <option
          v-for="escala in escalas"
          :key="escala.value"
          :value="escala.value"
        >
          {{ escala.label }}
        </option>
      </select>
    </div>

    <div class="config-row">
      <span>Funciones</span>
      <div class="divFunciones">
        <div
          v-for="funcion in funciones"
          :key="funcion"
          class="clickeableVista"
          :class="{ seleccionada: funcionesSeleccionadas.has(funcion) }"
          @click="toggleFuncion(funcion)"
        >
          {{ funcion }}
        </div>
      </div>
    </div>

    <div class="config-row">
      <span>Con partes</span>
      <div class="divFunciones">
        <div
          class="clickeableVista"
          :class="{ seleccionada: conIntro }"
          @click="chgIntro()"
        >
          INTRO
        </div>
        <div
          class="clickeableVista"
          :class="{ seleccionada: conOutro }"
          @click="chgOutro()"
        >
          OUTRO
        </div>
        <div
          class="clickeableVista"
          :class="{ seleccionada: conPuente }"
          @click="chgPuente()"
        >
          PUENTE
        </div>
      </div>
    </div>

    <div class="botonera">
      <button @click="nuevaCancion()" class="btnGuardar">
        ➕ Nueva Cancion
      </button>
      <button @click="emit('cerrar')" class="btnGuardar">Cancelar</button>
    </div>
  </div>
</template>
<style scoped>
.seleccionada {
  font-weight: bold;
  background-color: rgb(223, 177, 51);
}
.vistaedit {
  font-size: x-large;
  position: absolute;
  left: 20%;
  top: 20%;
  max-width: 70%;
  font: 2em;
  padding: 8px;
  border-radius: 10px;
  background-color: rgb(41, 37, 37);
  color: white;
  z-index: 1000;
  border: 3px solid #8b4513;
}
.config-row {
  display: flex;
  align-items: center;
  margin-top: 3px;
}
.config-row span {
  margin-right: 6px;
}

.config-box {
  align-items: center;
  margin-right: 20px;
}

.clickeableVista {
  cursor: pointer;
  min-width: 60px;
  padding: 3px;
  text-align: center;
  border: 1px solid #ccc;
  margin: 5px;
}
.tituloeditSize {
  font-size: x-large;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  background-color: rgb(209, 169, 38);
}
.botonera {
  margin-top: 15px;
  text-align: right;
}
.divFunciones {
  display: flex;
  flex-wrap: wrap;
}
@media (max-width: 768px) {
  .vistaedit {
    left: 3%;
    top: 10%;
    font-size: small;
  }
  .botonera {
    text-align: center;
  }
}
</style>
