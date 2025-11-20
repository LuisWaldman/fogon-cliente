<script setup lang="ts">
import { ref } from 'vue'

/*<span @click="click_editarsecuencia(index)" v-if="refEditandoSecuencia != index">🔄</span>
        <span @click="click_Sieditarsecuencia(index)" v-if="refEditandoSecuencia == index">[Si]</span>
        <span @click="click_Noeditarsecuencia(index)" v-if="refEditandoSecuencia == index">[No]</span>
*/
const refAcordesEditando = ref('')
</script>
<template>ACORDES{{ refAcordesEditando }}</template>
