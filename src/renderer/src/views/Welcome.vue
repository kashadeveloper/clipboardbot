<script setup lang="ts">
import { ref } from 'vue'
import { useSnackbar } from 'vue3-snackbar'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

function canGoBack(): boolean {
  console.log(route.query)
  return Boolean(route.query.canGoBack)
}

const token = ref('')
const userId = ref('')
const loading = ref(false)
const snackbar = useSnackbar()
const router = useRouter()

async function submit(): Promise<void> {
  const result = await window.api.checkCredentials(token.value, userId.value)
  console.log(result)

  if (!result) {
    return snackbar.add({
      text: 'Не удается подключить бота. Проверьте введенные данные'
    })
  } else {
    window.api.setStore('token', token.value)
    window.api.setStore('userId', userId.value)
    window.api.stopBot()
    router.replace('/home')
  }
}
</script>
<template>
  <div v-if="canGoBack()" style="cursor: pointer;color: #fff; margin: 10px;" @click="router.back()"><svg
      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-chevron-left-icon lucide-chevron-left">
      <path d="m15 18-6-6 6-6" />
    </svg></div>

  <div class="head">
    <h2>Настройка бота</h2>
    <p style="font-size: 13px; color: #c4c4c4">
      Данные можно будет изменить в любое время в настройках
    </p>
    <!-- eslint-disable prettier/prettier -->
    <a href="tg://resolve?domain=BotFather" style="text-decoration: none; font-size: 12px; color: #898888">Перейти в
      @BotFather</a>
  </div>
  <form class="container" @submit.prevent="submit">
    <input id="token" v-model="token" type="text" placeholder="Токен бота" />
    <input id="userId" v-model="userId" type="text" placeholder="ID пользователя" />
    <button onclick="submit()" :disabled="loading">Сохранить</button>
    <div class="footer">Введите данные и нажмите сохранить</div>
  </form>
</template>
<style scoped>
.head {
  margin-top: 4em;
  text-align: center;
  margin-bottom: 1em;
}

* {
  box-sizing: border-box;
}

.container {
  padding-inline: 20px;
}

h2 {
  margin-top: 0;
  text-align: center;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 24px;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: none;
  border-radius: 8px;
  background-color: #2c2c2c;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: background 0.2s;
}

input:focus {
  background-color: #3a3a3a;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #438fa0;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background-color: #4caf96;
}

.footer {
  text-align: center;
  margin-top: 16px;
  font-size: 12px;
  color: #888;
}
</style>
