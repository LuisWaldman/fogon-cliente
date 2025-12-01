<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { CompasEditable } from './compaseditable'
import editSecuencia from './editSecuencia.vue'
import editAcordes from './editAcordesCancion.vue'
import editPartes from './editPartesCancion.vue'
import { Pantalla } from '../../modelo/pantalla'
const props = defineProps<{
  compas: number
  cancion: Cancion
}>()
const editandoCompas = ref(props.compas)

const vistaLateral = ref('secuencia')
const acordesCancion = ref<string[]>([])

acordesCancion.value = [...new Set(props.cancion.acordes.GetTodosLosAcordes())]

function cambiarVistaLateral(vista: string) {
  vistaLateral.value = vista
}

const compaces = ref<CompasEditable[][]>([])
const refParteSeleccionada = ref<number>(-1)
function seleccionarParte(compas: CompasEditable) {
  refParteSeleccionada.value = compas.nroSecuencia
}
function calcularCompaces() {
  let renglon = []
  let renglones = []
  let letra = props.cancion.letras.GetTodosLosRenglones()
  let contSecuencia = 0
  let contAcordeEnSecuencia = 0

  for (let i = 0; i < letra.length; i++) {
    const compasEditable = new CompasEditable()
    compasEditable.iniciaparte = i == 0 ? true : false
    if (contSecuencia < props.cancion.acordes.ordenPartes.length) {
      const parte = props.cancion.acordes.ordenPartes[contSecuencia]
      if (
        contAcordeEnSecuencia >=
        props.cancion.acordes.partes[parte].acordes.length
      ) {
        // Marcar el compas anterior como término de parte
        if (renglon.length > 0) {
          renglon[renglon.length - 1].terminaparte = true
        }
        contSecuencia++
        contAcordeEnSecuencia = 0
        compasEditable.acorde =
          props.cancion.acordes.partes[parte].acordes[contAcordeEnSecuencia]
        compasEditable.nroSecuencia = contSecuencia
        compasEditable.iniciaparte = true
      } else {
        compasEditable.acorde =
          props.cancion.acordes.partes[parte].acordes[contAcordeEnSecuencia]
        compasEditable.nroSecuencia = contSecuencia
        compasEditable.terminaparte =
          contAcordeEnSecuencia ===
          props.cancion.acordes.partes[parte].acordes.length - 1
            ? true
            : false
        contAcordeEnSecuencia++
      }

      compasEditable.letra = letra[i]
      renglon.push(compasEditable)

      if (letra[i].includes('/n')) {
        renglones.push(renglon)
        renglon = []
      } else {
      }
    }
  }
  // Marcar el último compas como término de parte
  if (renglon.length > 0) {
    renglon[renglon.length - 1].terminaparte = true
  }
  renglones.push(renglon)
  compaces.value = renglones
}

onMounted(() => {
  calcularCompaces()
})

const pantalla = new Pantalla()

function estiloVistaPrincipal() {
  return `width: ${pantalla.getConfiguracionPantalla().anchoPrincipal}%; height: 100%`
}

function estiloVistaSecundaria() {
  return `height: ${pantalla.getAltoPantalla()}px; overflow-x: auto;`
}
</script>
<template>
  <div
    :style="{
      height: pantalla.getAltoPantalla() + 'px',
      overflow: 'hidden',
      display: 'flex',
    }"
  >
    <div :style="estiloVistaPrincipal()">
      <div
        class="editdivconteiner"
        :style="{ height: pantalla.getAltoPantalla() + 'px', overflow: 'auto' }"
      >
        <div
          class="editrenglon"
          v-for="(renglon, indexrenglon) in compaces"
          :key="indexrenglon"
        >
          <div
            :class="{
              editdiv: true,
              comienzoparte: compas.iniciaparte,
              finparte: compas.terminaparte,
              editandoSecuencia: refParteSeleccionada === compas.nroSecuencia,
            }"
            v-for="(compas, indexcompas) in renglon"
            :key="indexcompas"
            @click="seleccionarParte(compas)"
          >
            <div class="acordediv">
              {{ compas.acorde }}
            </div>
            <div v-if="compas.letra.trim() != ''" class="divletra">
              {{ compas.letra }}
            </div>
            <div class="divletra" v-else>♪</div>
          </div>
        </div>
      </div>
    </div>
    <div
      :style="{
        width: 100 - pantalla.getConfiguracionPantalla().anchoPrincipal + '%',
      }"
    >
      <div class="botoneraLateral">
        <button
          @click="cambiarVistaLateral('acordes')"
          :class="{ active: vistaLateral === 'acordes' }"
        >
          🎸 ACORDES
        </button>
        <button
          @click="cambiarVistaLateral('partes')"
          :class="{ active: vistaLateral === 'partes' }"
        >
          📋 PARTES
        </button>
        <button
          @click="cambiarVistaLateral('secuencia')"
          :class="{ active: vistaLateral === 'secuencia' }"
        >
          🎵 SECUENCIA
        </button>
      </div>
      <div :style="estiloVistaSecundaria()">
        <editAcordes
          :acordesCancion="acordesCancion"
          :cancion="cancion"
          v-if="vistaLateral === 'acordes'"
        ></editAcordes>

        <editPartes
          v-if="vistaLateral === 'partes'"
          :cancion="cancion"
          :acordesCancion="acordesCancion"
        ></editPartes>

        <editSecuencia
          v-if="vistaLateral === 'secuencia'"
          ref="ctrlSecuencia"
          :cancion="cancion"
          :compas="editandoCompas"
        ></editSecuencia>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editdivconteiner {
  border: 1px solid;
  padding: 4px;
  width: 100%;
  height: auto;
}

.acordediv {
  font-size: var(--tamanio-acorde);
  margin: 1px;
  border-radius: 5px;
  display: inline-block;
  color: #a9a8f6;
  margin-right: 4px;
}

.editrenglon {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0px;
  margin-bottom: 14px;
}
.editdiv {
  border: 1px solid;
  border-top: 5px solid rgb(189, 139, 98);
  padding: 4px;
  overflow: hidden;
  margin: 0px;
  height: 80px;
}
.comienzoparte {
  border-left: 8px solid;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.editandoSecuencia {
  border-top: 2px solid rgb(255, 0, 0);
}
.divletra {
  font-size: var(--tamanio-letra);
  color: white;
  width: max-content;
  min-width: 100%;
}

.finparte {
  border-right: 8px solid;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-right: 2px;
}

/* Button Styles - matching table component style */
.botoneraLateral {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(169, 168, 246, 0.2);
  flex-wrap: wrap;
}

.botoneraLateral button {
  padding: 12px 16px;
  border: 1px solid rgba(169, 168, 246, 0.5);
  border-radius: 8px;
  background: rgba(169, 168, 246, 0.1);
  color: #a9a8f6;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(10px);
}

.botoneraLateral button:hover:not(.active) {
  background: rgba(169, 168, 246, 0.2);
  border-color: rgba(169, 168, 246, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(169, 168, 246, 0.3);
}

.botoneraLateral button.active {
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.3),
    rgba(106, 112, 15, 0.3)
  );
  border-color: #a9a8f6;
  color: #fff;
  box-shadow: 0 0 20px rgba(169, 168, 246, 0.4);
}

.botoneraLateral button:active {
  transform: translateY(0);
}

/* Responsive design for buttons */
@media (max-width: 768px) {
  .botoneraLateral {
    flex-direction: column;
    gap: 4px;
    padding: 8px;
  }

  .botoneraLateral button {
    width: 100%;
    font-size: 0.8rem;
    padding: 10px 12px;
  }
}
</style>
