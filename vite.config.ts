import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/fogon-cliente/', // Nombre del repo
  plugins: [vue()],
})
