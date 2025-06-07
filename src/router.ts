import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Home from './views/home.vue'
import Tocar from './views/tocar.vue'
import Buscar from './views/buscar.vue'
import Editar from './views/editar.vue'
import Listas from './views/listas.vue'
import Configurar from './views/configurar.vue'
import Proximamente from './views/proximamente.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Proximamente },
  { path: '/home', component: Home },
  { path: '/editar', component: Editar },
  { path: '/tocar', component: Tocar, props: true },
  { path: '/listas', component: Listas },
  { path: '/buscar', component: Buscar },
  { path: '/configurar', component: Configurar },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
