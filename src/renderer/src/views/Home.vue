<script lang="ts" setup>
import { onMounted } from 'vue'
import { store } from '../store/store'

function logHandler(_, message: string): void {
  const msg = message.trim()
  if (msg.length === 0) return

  const time = new Date().toLocaleTimeString()
  store.addLog(`[${time}] ${msg}`)

  return;
}

onMounted(() => {
  window.api.startBot()
  window.electron.ipcRenderer.removeAllListeners('bot:log')
  window.electron.ipcRenderer.on('bot:log', logHandler)
})

const stopBot = (): void => window.api.stopBot()

const startBot = (): void => window.api.startBot() 

</script>

<template>
  <header>
    <div>Логи Telegram бота</div>
    <div style="color: #fff; gap: 10px; display: flex;">
      <button v-if="store.botState.started == false" title="Запустить бота" @click="startBot()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-play-icon lucide-play">
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
      </button>
      <button v-else class="stop-bot" title="Остановить бота" @click="stopBot()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-pause-icon lucide-pause">
          <rect x="14" y="4" width="4" height="16" rx="1" />
          <rect x="6" y="4" width="4" height="16" rx="1" />
        </svg>
      </button>
      <RouterLink class="settings" title="Настройки" to="/settings"> <svg xmlns="http://www.w3.org/2000/svg" width="24"
          height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" class="lucide lucide-cog-icon lucide-cog">
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M12 2v2" />
          <path d="M12 22v-2" />
          <path d="m17 20.66-1-1.73" />
          <path d="M11 10.27 7 3.34" />
          <path d="m20.66 17-1.73-1" />
          <path d="m3.34 7 1.73 1" />
          <path d="M14 12h8" />
          <path d="M2 12h2" />
          <path d="m20.66 7-1.73 1" />
          <path d="m3.34 17 1.73-1" />
          <path d="m17 3.34-1 1.73" />
          <path d="m11 13.73-4 6.93" />
        </svg> </RouterLink>
    </div>
  </header>
  <div id="logs">
    <div v-for="(log, index) in store.logs" :key="index">
      {{ log }}
    </div>
  </div>
  <footer>
    <div>© 2025 by kashadeveloper</div>
    <a href="https://github.com/kashadeveloper/clipboardbot" target="_blank" style="color: #666; text-decoration: none">
      Github
    </a>
  </footer>
</template>

<style scoped>
button {
  background: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
}

header {
  background: #242424;
  padding: 12px 20px;
  font-size: 1.3em;
  font-weight: 600;
  color: #0af;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
}

#logs {
  flex-grow: 1;
  padding: 10px 20px;
  overflow-y: auto;
  background: #121212;
  font-family: monospace;
  font-size: 0.9em;
  line-height: 1.3em;
  white-space: pre-wrap;
}

footer {
  padding: 10px 20px;
  background: #242424;
  color: #666;
  font-size: 0.8em;
  user-select: none;
  text-align: center;
}

.hidden {
  display: none;
}

a {
  color: #fff;
  text-decoration: none;
}

a:active {
  color: #fff;
}

/* Убираем фон скроллбара */
::-webkit-scrollbar {
  width: 8px;
  background: transparent;
  /* фон скроллбара */
}

/* Сам ползунок (ручка) */
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.4);
  /* ползунок */
  border-radius: 4px;
}

/* При наведении на ползунок */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
