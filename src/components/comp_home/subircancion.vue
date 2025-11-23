<script setup lang="ts">
import { Cancion } from '../../modelo/cancion/cancion'
import { HelperJSON } from '../../modelo/cancion/HelperJSON'
import { onMounted, ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { useAppStore } from '../../stores/appStore'

const fileInput = ref<HTMLInputElement | null>(null)

function abrirDialogoArchivo() {
  fileInput.value?.click()
}

let router: Router | null = null
onMounted(() => {
  router = useRouter()
})

function manejarSeleccionArchivo(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Verificar que sea un archivo JSON
  if (!file.name.toLowerCase().endsWith('.json')) {
    alert('Por favor selecciona un archivo JSON válido')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const fileContent = e.target?.result as string
      const data = JSON.parse(fileContent)
      const cancion: Cancion = HelperJSON.JSONToCancion(JSON.stringify(data))
      const appStore = useAppStore()
      appStore.editandocancion = cancion
      router?.push('/editar')
    } catch (error) {
      console.error('Error al procesar el archivo JSON:', error)
      alert(
        'Error al procesar el archivo JSON. Verifica que el formato sea correcto.',
      )
    }
  }
  reader.readAsText(file)

  // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
  target.value = ''
}
</script>

<template>
  <button @click="abrirDialogoArchivo" class="action-btn primary">
    <span class="btn-icon">⬆️</span>
    <span class="button-text">Subir Canción</span>
  </button>

  <input
    ref="fileInput"
    type="file"
    accept=".json"
    style="display: none"
    @change="manejarSeleccionArchivo"
  />
</template>

<style scoped>
.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-height: 44px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.btn-icon {
  font-size: 1.1em;
  display: flex;
  align-items: center;
}

.action-btn.primary {
  border-color: rgba(169, 168, 246, 0.5);
  background: linear-gradient(
    135deg,
    rgba(169, 168, 246, 0.2),
    rgba(0, 0, 0, 0.6)
  );
}

.action-btn.primary:hover {
  border-color: rgba(169, 168, 246, 0.8);
  box-shadow: 0 4px 20px rgba(169, 168, 246, 0.3);
  transform: translateY(-2px);
}

.action-btn:active:not(:disabled) {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .button-text {
    display: none;
  }

  .action-btn {
    min-width: 44px;
    padding: 10px 12px;
  }
}

@media (max-width: 480px) {
  .action-btn {
    font-size: 0.8rem;
    padding: 8px 10px;
    min-height: 40px;
  }
}

@media (prefers-contrast: high) {
  .action-btn {
    border-width: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .action-btn {
    transition: none;
  }

  .action-btn::before {
    display: none;
  }

  .action-btn:hover {
    transform: none;
  }
}

.nombreCancion {
  font-weight: bold;
  border: 1px solid #ccc;
  font-size: 1.2em;
  padding: 10px;
}
.cancion {
  cursor: pointer;
  position: relative;
  padding: 15px;
  margin: 5px;
  border-radius: 4px;
  max-width: 24%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  color: #666;
}
.cancion:hover {
  background-color: #1f1818;
  color: #fff;
}
.origen-indicador {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
