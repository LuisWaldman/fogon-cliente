import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router.ts'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'
import googleAuthPlugin from 'vue3-google-login'

const app = createApp(App)

const CLIENT_ID =
  '187897456683-j9oaks1v1tkd9pde73g65871fgj7k8sn.apps.googleusercontent.com'

const pinia = createPinia()
app.use(googleAuthPlugin, {
  clientId: CLIENT_ID,
})
app.use(pinia)
app.use(router)
app.mount('#app')
