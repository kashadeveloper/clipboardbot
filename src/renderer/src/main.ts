import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { SnackbarService } from 'vue3-snackbar'

import 'vue3-snackbar/styles'

const app = createApp(App)

let redirectedOnce = false

router.beforeEach(async (to, _, next) => {
  const token = await window.api.getStore('token')

  if (token && to.path === '/' && !redirectedOnce) {
    redirectedOnce = true
    next('/home')
  } else {
    next()
  }
})

app.use(router)
app.use(SnackbarService)

app.mount('#app')
