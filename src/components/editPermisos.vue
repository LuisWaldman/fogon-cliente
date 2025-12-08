<script setup lang="ts">
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
const emit = defineEmits(['cerrar'])
</script>

<template>
  <div class="modal-backdrop" @click="emit('cerrar')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>⚙️ Administracion del Fogon</h2>
        <button class="close-btn" @click="emit('cerrar')" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div class="modal-body">
        <table v-if="appStore.usuariosSesion.length" style="width: 100%">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Perfil</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, idx) in appStore.usuariosSesion" :key="idx">
              <td>
                <img
                  v-if="user.PerfilUsr && user.PerfilUsr.imagen"
                  :src="user.PerfilUsr.imagen"
                  alt="Profile image"
                  class="profile-image"
                />
                {{ user.Usuario }}
              </td>

              <td style="display: flex;">
                <button class="option-btn" :class="{ 'selected': user.RolSesion === 'director' }">Director</button>
                <button class="option-btn" :class="{ 'selected': user.RolSesion === 'admin' }">Administrar</button>
                </td>
                
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-footer">
        <button @click="emit('cerrar')" class="btn-primary">Listo</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Profile image enhanced */
.profile-image {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border: 2px solid rgba(169, 168, 246, 0.3);
  margin-right: 12px;
  vertical-align: middle;
  object-fit: cover;
}

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
  max-width: 800px;
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
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Modal body */
.modal-body {
  padding: 24px;
}

/* Form sections */
.form-section {
  margin-bottom: 24px;
}

.section-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #a78bfa;
}

/* Input groups */
.input-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group label {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #a78bfa;
}

.input-row {
  display: flex;
  gap: 16px;
  width: 100%;
}

.input-group.half {
  flex: 1;
  min-width: 0;
}

/* Form inputs */
.form-input {
  width: 100%;
  min-width: 0;
  padding: 12px 16px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 8px;
  background-color: #2a2a2a;
  color: white !important;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  background-color: #333333;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  color: white !important;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Range inputs */
.range-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-input {
  flex: 1;
  height: 6px;
  background: #2a2a2a;
  border: 1px solid rgba(106, 76, 147, 0.4);
  border-radius: 3px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.range-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.range-value {
  min-width: 50px;
  text-align: right;
  color: #a78bfa;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Option grid */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.option-btn {
  padding: 10px 16px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.option-btn:hover {
  border-color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.1);
  transform: translateY(-1px);
}

.option-btn.selected {
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-color: #6a4c93;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(106, 76, 147, 0.4);
}

/* Layout buttons */
.layout-btn {
  flex-direction: row;
  gap: 8px;
}

.layout-icon {
  font-family: monospace;
  font-size: 1.2rem;
  color: #a78bfa;
}

.option-btn.selected .layout-icon {
  color: white;
}

/* Checkbox styling */
.checkbox-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  color: white;
}

.checkbox-item input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(106, 76, 147, 0.4);
  border-radius: 4px;
  background-color: #2a2a2a;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-item input[type='checkbox']:checked + .checkmark {
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  border-color: #6a4c93;
}

.checkbox-item input[type='checkbox']:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Modal footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(106, 76, 147, 0.3);
  background-color: rgba(26, 26, 26, 0.5);
  border-radius: 0 0 14px 14px;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}

.btn-primary {
  background: linear-gradient(135deg, #6a4c93 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(106, 76, 147, 0.4);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(106, 76, 147, 0.5);
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(106, 76, 147, 0.4);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: #6a4c93;
  transform: translateY(-1px);
}

/* Partitura section styling */
.partitura-section {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.1) 0%,
    rgba(106, 76, 147, 0.1) 100%
  );
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
}

.partitura-section .section-label {
  color: #c4b5fd;
  font-size: 1rem;
  margin-bottom: 16px;
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

  .input-row {
    flex-direction: column;
    gap: 0;
  }

  .input-group.half {
    margin-bottom: 16px;
  }

  .option-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 6px;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
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
