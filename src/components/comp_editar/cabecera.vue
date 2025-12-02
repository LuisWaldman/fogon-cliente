<script setup lang="ts">
import { Cancion } from '../../modelo/cancion/cancion'
import editarescala from './editarescala.vue'
import editararchivo from './editararchivo.vue'
import editarmedias from './editarmedias.vue'
import editaryoutube from './editarYoutube.vue'
import editartiempo from './editartiempo.vue'
import emoticonOrigen from '../comp_home/emoticonOrigen.vue'
import SpanSilabas from './spanSilabas.vue'
import { Tiempo } from '../../modelo/tiempo'
const tiempo = new Tiempo()
import { ref } from 'vue'
import { OrigenCancion } from '../../modelo/cancion/origencancion'
import { useAppStore } from '../../stores/appStore'
import { HelperDisplayAcordesLatino } from '../../modelo/display/helperDisplayAcordesLatino'
import { CancionManager } from '../../modelo/cancion/CancionManager'
import { HelperJSON } from '../../modelo/cancion/HelperJSON'
import { HelperDisplayEditTexto } from '../../modelo/displayEditTexto/helperDisplayEditTexto'
import type { textoResumen } from '../../modelo/displayEditTexto/textoResumen'
const helper = HelperDisplayAcordesLatino.getInstance()
function arreglartexto(texto: string): string {
  if (texto == null || texto === undefined) return ''
  let processed = texto.replace(/-/g, ' ')
  if (processed.length === 0) return processed

  // First letter lowercase, rest uppercase
  processed =
    processed.charAt(0).toUpperCase() + processed.slice(1).toLocaleLowerCase()

  // Truncate if longer than 50 characters
  if (processed.length > 50) {
    processed = processed.substring(0, 47) + '...'
  }

  return processed
}
const props = defineProps<{
  cancion: Cancion
  origen: OrigenCancion
}>()

const viendo = ref('' as string)
const emit = defineEmits(['viendo'])
function clickCambiar(nviendo: string) {
  if (nviendo === viendo.value) {
    viendo.value = 'inicio'
    emit('viendo', 'inicio')
    return
  }
  emit('viendo', nviendo)
  viendo.value = nviendo
}

const appStore = useAppStore()
function clickCerrar(modificado: boolean) {
  viendo.value = ''
  if (modificado) {
    appStore.cancionModificada = true
  }
}
helper.latino = appStore.perfil.CifradoLatino

const helperTexto = new HelperDisplayEditTexto()
const refTexto = ref<textoResumen>(helperTexto.getResumen(props.cancion.letras))
function Actualizar() {
  refTexto.value = helperTexto.getResumen(props.cancion.letras)
}

defineExpose({ Actualizar })

function guardarCambios(origenDestino: string) {
  let usuario = props.origen.usuario
  if (appStore.estadosApp.estadoLogin === 'logueado') {
    usuario = appStore.perfil.usuario
  }
  CancionManager.getInstance()
    .Save(
      new OrigenCancion(origenDestino, props.cancion.archivo, usuario),
      props.cancion,
    )
    .catch((error) => {
      console.error('Error al guardar los cambios:', error)
    })
}

function DescargarJSON() {
  const cancionJSON = HelperJSON.CancionToJSON(props.cancion)
  const blob = new Blob([cancionJSON], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const nombreArchivo =
    `${appStore.editandocancion.archivo}.json`.toLocaleLowerCase()
  a.download = nombreArchivo
  a.click()
  URL.revokeObjectURL(url)
}
function EnviarAlFogon() {
  const origenN = new OrigenCancion('fogon', '', '')
  CancionManager.getInstance().Save(origenN, props.cancion)
}
</script>

<template>
  <div class="navbarFogon">
    <div style="display: flex; flex-wrap: wrap">
      <div
        class="divctrlEdit"
        :class="viendo === 'archivo' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('archivo')"
      >
        <div style="display: flex">
          <emoticonOrigen :origen="origen.origenUrl" />
          <label>{{ arreglartexto(cancion.banda) }}</label>
          <label v-if="cancion.calidad == -1">♻️</label>
          <label v-else-if="cancion.calidad == 0">⭐⚫⚫⚫⚫</label>
          <label v-else-if="cancion.calidad == 1">⭐⭐⚫⚫⚫</label>
          <label v-else-if="cancion.calidad == 2">⭐⭐⭐⚫⚫</label>
        </div>
        <div class="tituloEdit titulocancion">
          {{ arreglartexto(cancion.cancion) }}
        </div>
      </div>
      <div
        class="divctrlEdit"
        :class="viendo === 'escala' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('escala')"
      >
        <label>Escala</label>
        <div>
          <label class="tituloEdit" v-if="cancion.escala">{{
            helper.GetAcorde(cancion.escala)
          }}</label>
        </div>
      </div>

      <div
        class="divctrlEdit"
        :class="viendo === 'tiempo' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('tiempo')"
      >
        <label>BPM: {{ cancion.bpm }} </label>
        <div>
          <label class="tituloEdit"
            >DURACION:
            {{ tiempo.formatSegundos(cancion.duracionCancion) }}</label
          >
        </div>
      </div>

      <div
        class="divctrlEdit"
        :class="viendo === 'editartexto' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('editartexto')"
      >
        <label>🔤 Letra</label>
        <div>
          <div>Versos: {{ refTexto.versos }}</div>
          <div>Silabas: <SpanSilabas :silabas="refTexto.silabas" /></div>
          <div>Rimas: {{ refTexto.rimas }}</div>
        </div>
      </div>
      <div
        class="divctrlEdit"
        :class="viendo === 'acordes' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('acordes')"
      >
        <label>🎸 Acordes</label>
        <div>
          <div>Acordes: 4</div>
          <div>Partes: 2</div>
          <div>Funciones: I VI V</div>
        </div>
      </div>

      <div
        class="divctrlEdit"
        :class="viendo === 'pentagramas' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('pentagramas')"
      >
        <label>Partituras</label>
        <div>
          <label class="tituloEdit">
            🎼 {{ cancion.pentagramas.length }}
          </label>
        </div>
      </div>

      <div
        class="divctrlEdit"
        :class="viendo === 'medias' ? 'edintandoCtrl' : ''"
        @click="clickCambiar('medias')"
      >
        <label>📺 Video</label>
        <div>
          <label class="tituloEdit" v-if="cancion.medias.length > 0">📺</label>
          <label class="tituloEdit" v-else>No</label>
        </div>
      </div>

      <div class="divctrlEdit">
        <label>Guardar</label>
        <div style="display: flex; flex-direction: row;">
          <button
            @click="EnviarAlFogon()"
            v-if="appStore.estadosApp.estadoSesion === 'conectado'"
          >
            🔥 FOGON
          </button>
          <button @click="guardarCambios('local')">💾 Local</button>

          <button
            v-if="appStore.estadosApp.estadoLogin === 'logueado'"
            @click="guardarCambios('server')"
          >
            🗄️ Servidor
          </button>
          <button @click="DescargarJSON" class="btnDescarga">
            ⬇️ Descargar
          </button>
        </div>
      </div>
    </div>

    <div
      class="divctrlEdit"
      v-if="
        viendo == 'medias' ||
        viendo == 'archivo' ||
        viendo == 'escala' ||
        viendo == 'tiempo'
      "
    >
      <editarmedias
        v-if="viendo == 'medias' && appStore.perfil.ModoDesarrollador"
        :cancion="cancion"
        :origen="origen"
        @cerrar="clickCerrar"
      ></editarmedias>
      <editaryoutube
        v-if="viendo == 'medias'"
        :cancion="cancion"
        :origen="origen"
        @cerrar="clickCerrar"
      ></editaryoutube>
      <editararchivo
        v-if="viendo == 'archivo'"
        @cerrar="clickCerrar"
        :cancion="cancion"
        :origen="origen"
      ></editararchivo>
      <editarescala
        v-if="viendo == 'escala'"
        :cancion="cancion"
        @cerrar="clickCerrar"
      ></editarescala>
      <editartiempo
        v-if="viendo == 'tiempo'"
        :cancion="cancion"
        @cerrar="clickCerrar"
      ></editartiempo>
    </div>
  </div>
</template>

<style scoped>
/* Navbar principal con diseño moderno - padding reducido */
.navbarFogon {
  width: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 50%, #353333 100%);
  border: none;
  border-bottom: 2px solid #a9a8f6;
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.15);
  padding: 12px 10px 8px 10px;
  backdrop-filter: blur(10px);
}

/* Contenedor principal de controles con mejor layout - gap reducido */
.navbarFogon > div:first-child {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: stretch;
  margin-bottom: 0;
}

/* Estilos mejorados para cada control de edición - más compacto */
.divctrlEdit {
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.08) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  border: 1px solid rgba(169, 168, 246, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  margin: 0;
  min-width: 140px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.divctrlEdit::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #a9a8f6, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.divctrlEdit:hover {
  border-color: #a9a8f6;
  box-shadow: 0 8px 25px rgba(169, 168, 246, 0.25);
  transform: translateY(-2px);
}

.divctrlEdit:hover::before {
  opacity: 1;
}

/* Control activo/editando con mejor indicador visual */
.edintandoCtrl {
  border: 2px solid #a9a8f6;
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2) 0%,
    rgba(207, 218, 65, 0.1) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  box-shadow:
    0 0 20px rgba(169, 168, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.edintandoCtrl::before {
  opacity: 1;
  background: linear-gradient(90deg, #cfda41, #a9a8f6, #cfda41);
}

/* Labels y títulos con mejor tipografía */
.divctrlEdit label {
  color: #a9a8f6;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: block;
}

.tituloEdit {
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.titulocancion {
  max-width: 350px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Botones mejorados con estilo consistente */
.divctrlEdit button {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 1px solid #a9a8f6;
  border-radius: 8px;
  color: #ffffff;
  padding: 8px 12px;
  margin: 3px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.divctrlEdit button:hover {
  background: linear-gradient(135deg, #a9a8f6 0%, #8b7cf6 100%);
  border-color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(169, 168, 246, 0.3);
}

.divctrlEdit button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(169, 168, 246, 0.2);
}

/* Botón especial de descarga */
.btnDescarga {
  background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
  border-color: #10b981 !important;
}

.btnDescarga:hover {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  border-color: #34d399 !important;
}

/* Mejoras en el layout de contenido de cada control */
.divctrlEdit > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Estilos para íconos y emojis */
.divctrlEdit label:first-child {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Panel secundario para editores - reducir margen */
.navbarFogon > .divctrlEdit:last-child {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(169, 168, 246, 0.2);
  border-radius: 12px;
  margin-top: 8px;
  padding: 15px;
}

/* Responsive design mejorado */
@media (max-width: 768px) {
  .navbarFogon {
    padding: 10px 15px;
  }

  .navbarFogon > div:first-child {
    gap: 8px;
  }

  .divctrlEdit {
    min-width: 120px;
    padding: 12px 16px;
    font-size: 0.85rem;
  }

  .tituloEdit {
    font-size: 1.1rem;
  }

  .divctrlEdit button {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .titulocancion {
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .divctrlEdit {
    min-width: 100px;
    padding: 10px 12px;
  }

  .divctrlEdit label {
    font-size: 0.8rem;
  }

  .tituloEdit {
    font-size: 1rem;
  }
}

/* Estados especiales */
.divctrlEdit .calidad-stars {
  font-size: 1.2rem;
  margin-left: 8px;
}

/* Animaciones y transiciones suaves */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.edintandoCtrl {
  animation: pulse 2s infinite ease-in-out;
}

/* Compatibilidad con estilos existentes */
.compartir_sesion {
  position: absolute;
  top: 160px;
  border: 2px solid #a9a8f6;
  background: rgba(0, 0, 0, 0.9);
  color: #a9a8f6;
  padding: 12px 16px;
  border-radius: 12px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(169, 168, 246, 0.2);
}

/* Otros estilos mantenidos para compatibilidad */
.dropdown-menu-end {
  right: 0;
  left: auto;
  min-width: 180px;
}

.dropdown-submenu {
  position: relative;
}

.imgConectado {
  box-sizing: content-box;
  border: 6px double #a9a8f6;
}

.dropdown-submenu .dropdown-menu {
  top: 0;
  right: 100%;
  left: auto;
  margin-top: -1px;
  margin-right: -1px;
  border-radius: 6px 0 6px 6px;
}

.dropdown-submenu:hover .dropdown-menu {
  display: block;
}

.dropdown-submenu > .dropdown-toggle::after {
  display: block;
  content: ' ';
  float: right;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px 5px 5px 0;
  border-right-color: #ccc;
  margin-top: 5px;
  margin-right: -10px;
}

.dropdown-submenu:hover > .dropdown-toggle::after {
  border-right-color: #999;
}

.dropdown-superior-derecha {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 5;
}

/* Estilos específicos para Escala, Partituras y Video - texto más grande */
.divctrlEdit:nth-child(2) .tituloEdit,
.divctrlEdit:nth-child(6) .tituloEdit,
.divctrlEdit:nth-child(7) .tituloEdit {
  font-size: 2.5rem !important;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
}

/* En móviles también aumentar el tamaño */
@media (max-width: 768px) {
  .divctrlEdit:nth-child(2) .tituloEdit,
  .divctrlEdit:nth-child(6) .tituloEdit,
  .divctrlEdit:nth-child(7) .tituloEdit {
    font-size: 1.8rem !important;
  }
}

@media (max-width: 480px) {
  .divctrlEdit:nth-child(2) .tituloEdit,
  .divctrlEdit:nth-child(6) .tituloEdit,
  .divctrlEdit:nth-child(7) .tituloEdit {
    font-size: 1.5rem !important;
  }
}
</style>
