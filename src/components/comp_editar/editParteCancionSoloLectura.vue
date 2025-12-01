<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Parte } from '../../modelo/cancion/acordes';


const props = defineProps<{
  parte: Parte
  quitando: boolean,
  reordenando: boolean,
  indexparte: number
}>()
const compaces = ref<string[][]>([]);
function CargarCancion() {
  const ncompaces = []
  for (const acordesStr of props.parte.acordes) {
    // Si acordesStr es un string, lo dividimos por espacios
    if (typeof acordesStr === 'string') {
      ncompaces.push(acordesStr.split(' ').filter(acorde => acorde.trim() !== ''))
    } else if (Array.isArray(acordesStr)) {
      // Si ya es un array, lo usamos directamente
      ncompaces.push(acordesStr)
    }
  }
  compaces.value = ncompaces
}
onMounted(() => {
  CargarCancion()
})

const emit = defineEmits<{
  'quitar-ok': [parteIndex: number]
}>()

defineOptions({
  name: 'EditParteCancionSoloLectura'
})

function handleQuitarOk(parteIndex: number) {
  emit('quitar-ok', parteIndex)
}

// Solo modo lectura - sin funcionalidad de edición

</script>

<template>
  <div class="clsParte">
    <div class="parteHeader">
      {{ parte.nombre }} <span v-if="reordenando">↕️</span>
      <button @click="handleQuitarOk(indexparte)" v-if="quitando">
        🗑️ QUITAR
      </button>
    </div>
    <div class="conteinerCompases" v-if="!reordenando">
      <div
        class="conteinerCompas"
        v-for="(compas, compasindex) in compaces"
        :key="compasindex"
      >
        <div class="compas">
          <div
            class="notaCompas"
            v-for="(nota, notindex) in compas"
            :key="notindex"
          >
            {{ nota }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notaCompas {
  padding: 4px 8px;
  margin: 2px;
  background: rgba(169, 168, 246, 0.2);
  border-radius: 4px;
  font-weight: 600;
  color: #a9a8f6;
}

.clsParte {
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  border-left: 4px solid #a9a8f6;
  border-radius: 4px;
}

.parteHeader {
  font-size: 1.1rem;
  font-weight: bold;
  color: #a9a8f6;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conteinerCompases {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: stretch;
}

.compas {
  display: flex;
  min-height: 40px;
  border: 1px solid rgba(169, 168, 246, 0.4);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  align-items: stretch;
  position: relative;
}

.conteinerCompas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}


</style>