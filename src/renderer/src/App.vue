<template>
  <router-view />
  <vue3-snackbar bottom :duration="4000" background-color="#fff"></vue3-snackbar>
</template>
<script lang="ts" setup>
import { Vue3Snackbar } from 'vue3-snackbar';
import { BotStateEvent } from './types/events/bot-state';
import { store } from './store/store';

window.electron.ipcRenderer.on("bot:state", (_, event: BotStateEvent) => {
  console.log(event)
  store.setBotState(event)
})
</script>
