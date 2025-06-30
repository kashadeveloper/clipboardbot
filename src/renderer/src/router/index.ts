import Home from '@renderer/views/Home.vue'
import Settings from '@renderer/views/Settings.vue'
import Welcome from '@renderer/views/Welcome.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: Welcome },
  { path: '/home', component: Home },
  { path: '/settings', component: Settings }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
