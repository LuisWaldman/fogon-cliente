<script setup lang="ts">
import { ref } from 'vue'
import qr from './qr.vue'

const props = defineProps<{
  titulo: string
  link: string
}>()

const emit = defineEmits(['cerrar'])
const copiado = ref(false)

function copiarUrl() {
  if (props.link) {
    navigator.clipboard.writeText(props.link)
    copiado.value = true
    setTimeout(() => {
      copiado.value = false
    }, 2000)
  }
}
</script>

<template>
  <div class="modal-backdrop" @click="emit('cerrar')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>🔥 {{ titulo }}</h2>
        <button class="close-btn" @click="emit('cerrar')" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div class="modal-body">
        <div class="qr-container">
          <qr :url="link" />
        </div>

        <div class="url-section">
          <div class="url-display">
            <span class="url-text">{{ link }}</span>
          </div>
          <button
            class="btn-copy"
            :class="{ copied: copiado }"
            @click="copiarUrl"
          >
            <span v-if="!copiado">
              📋 Copiar URL
            </span>
            <span v-else>
              ✅ Copiado
            </span>
          </button>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="emit('cerrar')" class="btn-primary">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

/* Modal content */
.modal-content {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid #6a4c93;
  color: white;
}

/* Modal header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(106, 76, 147, 0.3);
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-radius: 14px 14px 0 0;
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  word-break: break-word;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #2d2825;
  padding: 4px 8px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Modal body */
.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* QR Container */
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: rgba(169, 168, 246, 0.05);
  border-radius: 12px;
  border: 2px solid rgba(106, 76, 147, 0.3);
}

/* URL Section */
.url-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.url-display {
  background-color: #2a2a2a;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 8px;
  padding: 12px 16px;
  word-break: break-all;
}

.url-text {
  color: #a78bfa;
  font-size: 0.95rem;
  font-family: monospace;
}

.btn-copy {
  padding: 12px 24px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-copy:hover {
  border-color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.1);
  transform: translateY(-1px);
}

.btn-copy.copied {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
  color: white;
}

/* Modal footer */
.modal-footer {
  display: flex;
  justify-content: center;
  padding: 20px 24px;
  border-top: 1px solid rgba(106, 76, 147, 0.3);
  background-color: rgba(26, 26, 26, 0.5);
  border-radius: 0 0 14px 14px;
}

/* Buttons */
.btn-primary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(106, 76, 147, 0.4);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(106, 76, 147, 0.5);
}

/* Responsive design */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
    max-height: calc(100vh - 40px);
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }

  .modal-header h2 {
    font-size: 1.3rem;
  }

  .qr-container {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .modal-header {
    border-radius: 0;
  }

  .modal-header h2 {
    font-size: 1.1rem;
  }
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(106, 76, 147, 0.1);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(106, 76, 147, 0.4);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(106, 76, 147, 0.6);
}
</style>
