<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cancion } from '../../modelo/cancion/cancion'
import { watch } from 'vue'
import { ResumenSecuencia } from '../../modelo/cancion/ResumenSecuencia'
import { helperEditarAcorde } from './helperEditarAcorde'

/*<span @click="click_editarsecuencia(index)" v-if="refEditandoSecuencia != index">🔄</span>
        <span @click="click_Sieditarsecuencia(index)" v-if="refEditandoSecuencia == index">[Si]</span>
        <span @click="click_Noeditarsecuencia(index)" v-if="refEditandoSecuencia == index">[No]</span>
*/
const refAcordesEditando = ref('')
</script>
<template>
  ACORDES{{ refAcordesEditando }}
</template>