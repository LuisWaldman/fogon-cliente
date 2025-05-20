import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router.ts'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import PrimeVue from 'primevue/config'

import './style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(PrimeVue)
app.use(router)
app.mount('#app')
